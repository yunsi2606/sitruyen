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

async function scrapeImages(url, outputDir, headless, socket) {
    let browser;
    try {
        socket.emit('log', `Launching browser for: ${url} (Headless: ${headless})`);

        // Launch options
        const launchOptions = {
            headless: headless,
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

        socket.emit('log', 'Navigating to page...');
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        } catch (e) {
            socket.emit('log', `Warning: Navigation timeout or error, continuing anyway... ${e.message}`);
        }

        socket.emit('log', 'Waiting for initial content load...');
        await delay(3000);

        // Smart Infinite Scroll
        socket.emit('log', 'Starting smart scroll...');
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
            if (scrollAttempts % 5 === 0) socket.emit('log', `Scrolled... (Attempt ${scrollAttempts})`);
        }

        socket.emit('log', 'Scroll complete. Extracting images...');

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

        socket.emit('log', `Found ${imagePayloads.length} images.`);

        if (imagePayloads.length === 0) {
            socket.emit('error', 'No images found. The site might be protected or content is hidden.');
            // If headless was true, might need to suggest headful
            if (headless) {
                socket.emit('log', 'Tip: Try disabling "Headless Mode" to see if manual interaction is needed.');
            }
            return;
        }

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

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
            const filePath = path.join(outputDir, filename);

            try {
                if (payload.type === 'base64') {
                    const base64Data = payload.data.replace(/^data:image\/\w+;base64,/, "");
                    fs.writeFileSync(filePath, base64Data, 'base64');
                    downloadedCount++;
                } else {
                    // Critical Fix: Use page.evaluate to fetch inside the browser context
                    // This bypasses 403 errors by ensuring exact same headers/cookies/referer
                    try {
                        const base64Content = await page.evaluate(async (url) => {
                            const response = await fetch(url);
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
                            socket.emit('log', `Failed to download ${payload.url}: ${fetchError.message || response.status()}`);
                        }
                    }
                }

                socket.emit('progress', {
                    current: downloadedCount,
                    total: imagePayloads.length,
                    message: `Saved ${filename}`
                });
            } catch (e) {
                socket.emit('log', `Error saving image ${i}: ${e.message}`);
            }
        }

        socket.emit('complete', `Successfully downloaded ${downloadedCount} images to ${outputDir}`);

    } catch (error) {
        socket.emit('error', `Critical Error: ${error.message}`);
        console.error(error);
    } finally {
        if (browser) await browser.close();
    }
}

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('start-scrape', async (data) => {
        // headless defaults to true if not provided
        const { url, outputDir, headless = true } = data;
        if (!url || !outputDir) {
            socket.emit('error', 'Missing URL or Output Directory');
            return;
        }
        await scrapeImages(url, outputDir, headless, socket);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
