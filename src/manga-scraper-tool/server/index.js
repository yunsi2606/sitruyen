import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

const PORT = 3001;

// Utility to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// QUEUE STATE
let jobs = [];
let isProcessing = false;

function broadcastQueue() {
    io.emit('queue-updated', jobs);
}

function emitLog(jobId, type, message) {
    const timestamp = new Date().toLocaleTimeString();
    io.emit('log', { jobId, type, message, timestamp });
}

async function scrapeImages(job) {
    let browser;
    try {
        emitLog(job.id, 'info', `Launching browser for: ${job.url} (Headless: ${job.headless})`);

        // Launch options
        const launchOptions = {
            headless: job.headless,
            args: ['--start-maximized', '--disable-web-security']
        };

        browser = await chromium.launch(launchOptions);

        // Create context with stealth-like features
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            viewport: null, // Allow maximize to work
        });

        const page = await context.newPage();

        // Block unnecessary resources to speed up but keep scripts/images
        await page.route('**/*.(font|woff|woff2)', route => route.abort());

        emitLog(job.id, 'info', 'Navigating to page...');
        try {
            await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        } catch (e) {
            emitLog(job.id, 'info', `Warning: Navigation timeout or error, continuing anyway... ${e.message}`);
        }

        emitLog(job.id, 'info', 'Waiting for initial content load...');
        await delay(3000);

        // Smart Infinite Scroll
        emitLog(job.id, 'info', 'Starting smart scroll...');
        let lastHeight = await page.evaluate('document.body.scrollHeight');
        let scrollAttempts = 0;
        const maxScrollAttempts = 30;

        while (scrollAttempts < maxScrollAttempts) {
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await delay(1500);

            let newHeight = await page.evaluate('document.body.scrollHeight');
            if (newHeight === lastHeight) {
                // Double check by waiting
                await delay(2000);
                newHeight = await page.evaluate('document.body.scrollHeight');
                if (newHeight === lastHeight) break;
            }
            lastHeight = newHeight;
            scrollAttempts++;
            if (scrollAttempts % 5 === 0) emitLog(job.id, 'info', `Scrolled... (Attempt ${scrollAttempts})`);
        }

        emitLog(job.id, 'info', 'Scroll complete. Extracting images...');

        const imagePayloads = await page.evaluate(async () => {
            const results = [];
            const seen = new Set();

            const isBig = (el) => {
                const rect = el.getBoundingClientRect();
                // Heuristic: Must be somewhat large to be a manga page
                const isVisible = rect.width > 0 && rect.height > 0;
                const isLargeEnough = (rect.width > 300 && rect.height > 300) || (el.naturalWidth > 300 && el.naturalHeight > 300);
                return isVisible && isLargeEnough;
            };

            // 1. Standard Images
            const imgs = Array.from(document.querySelectorAll('img'));
            for (const img of imgs) {
                if (isBig(img) && img.src) {
                    if (img.src.startsWith('blob:')) {
                        try {
                            const blob = await fetch(img.src).then(r => r.blob());
                            const reader = new FileReader();
                            const base64 = await new Promise(resolve => {
                                reader.onloadend = () => resolve(reader.result);
                                reader.readAsDataURL(blob);
                            });
                            if (!seen.has(base64)) {
                                seen.add(base64);
                                results.push({ type: 'base64', data: base64, ext: '.jpg' });
                            }
                        } catch (e) { }
                    } else if (!img.src.startsWith('data:')) {
                        // Clean URL
                        const info = img.src;
                        if (!seen.has(info)) {
                            seen.add(info);
                            results.push({ type: 'url', url: info });
                        }
                    }
                }
            }

            // 2. Canvas (often used for protection)
            const canvases = Array.from(document.querySelectorAll('canvas'));
            for (const canvas of canvases) {
                if (isBig(canvas)) {
                    try {
                        const data = canvas.toDataURL('image/jpeg');
                        if (!seen.has(data)) {
                            seen.add(data);
                            results.push({ type: 'base64', data: data, ext: '.jpg' });
                        }
                    } catch (e) { }
                }
            }

            return results;
        });

        emitLog(job.id, 'info', `Found ${imagePayloads.length} images.`);

        if (imagePayloads.length === 0) {
            throw new Error('No images found. Site might be protected.');
        }

        if (!fs.existsSync(job.outputDir)) {
            fs.mkdirSync(job.outputDir, { recursive: true });
        }

        job.progress.total = imagePayloads.length;
        broadcastQueue();

        let downloadedCount = 0;
        for (let i = 0; i < imagePayloads.length; i++) {
            const payload = imagePayloads[i];
            const ext = payload.ext || path.extname(new URL(payload.url || 'x.jpg').pathname) || '.jpg';
            // Clean extension logic
            let safeExt = ext.split('?')[0];
            if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(safeExt.toLowerCase())) {
                safeExt = '.jpg';
            }

            const filename = `image_${String(i + 1).padStart(3, '0')}${safeExt}`;
            const filePath = path.join(job.outputDir, filename);

            try {
                if (payload.type === 'base64') {
                    const base64Data = payload.data.replace(/^data:image\/\w+;base64,/, "");
                    fs.writeFileSync(filePath, base64Data, 'base64');
                    downloadedCount++;
                } else {
                    // Critical Fix: Use page.evaluate to fetch inside the browser context
                    // This bypasses 403 errors by ensuring exact same headers/cookies/referer
                    try {
                        const base64Content = await page.evaluate(async (u) => {
                            const response = await fetch(u);
                            if (!response.ok) throw new Error(response.status);
                            const blob = await response.blob();
                            return new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            });
                        }, payload.url);

                        const data = base64Content.split(',')[1];
                        fs.writeFileSync(filePath, data, 'base64');
                        downloadedCount++;
                    } catch (fetchError) {
                        // Fallback to context request if browser fetch fails (rare)
                        const response = await context.request.get(payload.url);
                        if (response.ok()) {
                            const buffer = await response.body();
                            fs.writeFileSync(filePath, buffer);
                            downloadedCount++;
                        } else {
                            emitLog(job.id, 'error', `Failed to download ${payload.url}: ${fetchError.message}`);
                        }
                    }
                }

                job.progress.current = downloadedCount;
                if (i % 5 === 0 || i === imagePayloads.length - 1) {
                    broadcastQueue();
                }
            } catch (e) {
                emitLog(job.id, 'error', `Error saving image ${i}: ${e.message}`);
            }
        }

        emitLog(job.id, 'success', `Successfully downloaded ${downloadedCount} images to ${job.outputDir}`);

    } catch (error) {
        emitLog(job.id, 'error', `Critical Error: ${error.message}`);
        throw error; // Re-throw to mark job as error
    } finally {
        if (browser) await browser.close();
    }
}

async function processQueue() {
    if (isProcessing) return;

    let nextJob = jobs.find(j => j.status === 'pending');
    if (!nextJob) return;

    isProcessing = true;

    while (nextJob) {
        nextJob.status = 'processing';
        broadcastQueue();

        try {
            await scrapeImages(nextJob);
            nextJob.status = 'completed';
        } catch (error) {
            nextJob.status = 'error';
            nextJob.errorMsg = error.message;
        }

        broadcastQueue();
        nextJob = jobs.find(j => j.status === 'pending');
    }

    isProcessing = false;
    broadcastQueue();
}

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('queue-updated', jobs);

    socket.on('add-job', (data) => {
        const { url, outputDir, headless = true } = data;
        if (!url || !outputDir) return;

        const newJob = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            url,
            outputDir,
            headless,
            status: 'pending',
            progress: { current: 0, total: 0 },
            errorMsg: ''
        };

        jobs.push(newJob);
        broadcastQueue();
        processQueue(); // Start if not running
    });

    socket.on('remove-job', (id) => {
        const index = jobs.findIndex(j => j.id === id);
        if (index !== -1 && jobs[index].status !== 'processing') {
            jobs.splice(index, 1);
            broadcastQueue();
        }
    });

    socket.on('clear-completed', () => {
        jobs = jobs.filter(j => j.status === 'pending' || j.status === 'processing');
        broadcastQueue();
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
