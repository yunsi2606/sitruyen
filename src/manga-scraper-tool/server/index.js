import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';

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

        let startIdx = (job.startImageIndex || 1) - 1;
        if (startIdx < 0) startIdx = 0;
        const payloadsToDownload = imagePayloads.slice(startIdx);

        if (payloadsToDownload.length === 0) {
            throw new Error(`Start index ${job.startImageIndex} is out of bounds (only found ${imagePayloads.length} images).`);
        }

        if (!fs.existsSync(job.outputDir)) {
            fs.mkdirSync(job.outputDir, { recursive: true });
        }

        job.progress.total = payloadsToDownload.length;
        broadcastQueue();

        let downloadedCount = 0;
        for (let i = 0; i < payloadsToDownload.length; i++) {
            const payload = payloadsToDownload[i];
            const ext = payload.ext || path.extname(new URL(payload.url || 'x.jpg').pathname) || '.jpg';
            // Clean extension logic
            let safeExt = ext.split('?')[0];
            if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(safeExt.toLowerCase())) {
                safeExt = '.jpg';
            }

            const filename = `image_${String(startIdx + i + 1).padStart(3, '0')}${safeExt}`;
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

// UPLOAD LOGIC

/**
 * Parse chapter number from folder name.
 * Supports: chap-1, chap-2.5, chap-100, Chap 3, chap_4
 */
function parseChapterNumber(folderName) {
    const match = folderName.match(/chap(?:ter)?[- _]?([\d.]+)/i);
    return match ? parseFloat(match[1]) : null;
}

/**
 * Natural sort for image filenames: image_001.jpg < image_002.jpg < image_010.jpg
 */
function naturalSort(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Scan a source directory for chap-* folders and return sorted list.
 */
function scanChapterFolders(sourceDir) {
    if (!fs.existsSync(sourceDir)) return [];

    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    const chapters = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const num = parseChapterNumber(entry.name);
        if (num === null) continue;

        const folderPath = path.join(sourceDir, entry.name);
        const imageFiles = fs.readdirSync(folderPath)
            .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
            .sort(naturalSort);

        chapters.push({
            folderName: entry.name,
            folderPath,
            chapterNumber: num,
            imageCount: imageFiles.length,
            imageFiles,
        });
    }

    // Sort by chapter number
    chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
    return chapters;
}

/**
 * Login to Strapi Admin to get JWT token for admin-only operations.
 */
async function loginAdmin(strapiUrl, email, password) {
    const response = await fetch(`${strapiUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Admin login failed (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return result.data?.token || result.token;
}

/**
 * Find a folder in Strapi Media Library by name and parent.
 * Requires admin JWT.
 */
async function findStrapiFolder(strapiUrl, adminJwt, name, parentId = null) {
    let url = `${strapiUrl}/upload/folders?filters[name][$eq]=${encodeURIComponent(name)}`;
    if (parentId) {
        url += `&filters[parent][id][$eq]=${parentId}`;
    } else {
        url += `&filters[parent][id][$null]=true`;
    }

    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${adminJwt}` },
    });

    if (!response.ok) return null;
    const result = await response.json();
    if (result.data && result.data.length > 0) {
        return result.data[0].id;
    }
    return null;
}

/**
 * Create a folder in Strapi Media Library.
 * Requires admin JWT.
 */
async function createStrapiFolder(strapiUrl, adminJwt, name, parentId = null) {
    const response = await fetch(`${strapiUrl}/upload/folders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${adminJwt}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, parent: parentId }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Create folder failed (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return result.data.id;
}

/**
 * Find or create a folder. Requires admin JWT.
 */
async function ensureStrapiFolder(strapiUrl, adminJwt, name, parentId = null) {
    const existing = await findStrapiFolder(strapiUrl, adminJwt, name, parentId);
    if (existing) return existing;
    return await createStrapiFolder(strapiUrl, adminJwt, name, parentId);
}

/**
 * Fetch story slug from Strapi. Uses API token (content API).
 * Tries both numeric ID and documentId.
 */
async function getStorySlug(strapiUrl, apiToken, storyId) {
    // Try fetching with filters first (works with both ID types)
    const filterUrl = `${strapiUrl}/api/stories?filters[id][$eq]=${storyId}&fields[0]=slug&pagination[limit]=1`;
    let response = await fetch(filterUrl, {
        headers: { 'Authorization': `Bearer ${apiToken}` },
    });

    if (response.ok) {
        const result = await response.json();
        if (result.data && result.data.length > 0) {
            const item = result.data[0];
            return item.attributes?.slug || item.slug || `story-${storyId}`;
        }
    }

    // Fallback: try direct ID fetch
    response = await fetch(`${strapiUrl}/api/stories/${storyId}?fields[0]=slug`, {
        headers: { 'Authorization': `Bearer ${apiToken}` },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch story #${storyId} (${response.status})`);
    }

    const result = await response.json();
    const data = result.data;
    return data.attributes?.slug || data.slug || `story-${storyId}`;
}

/**
 * Upload a single image file to Strapi Media Library into a specific folder.
 * Uses authToken for authentication — pass adminJwt when folder placement is needed.
 * When folderId is set, uses admin endpoint (/upload) which respects folder placement.
 * Otherwise uses content API endpoint (/api/upload) for API token auth.
 * Returns the uploaded file ID.
 */
async function uploadImageToStrapi(filePath, strapiUrl, authToken, folderId = null) {
    const fileStream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    const formData = new FormData();
    formData.append('files', fileStream, fileName);
    if (folderId) {
        formData.append('fileInfo', JSON.stringify({ folder: folderId }));
    }

    // Admin JWT uses /upload (admin route), API token uses /api/upload (content API)
    const uploadEndpoint = folderId ? `${strapiUrl}/upload` : `${strapiUrl}/api/upload`;

    const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            ...formData.getHeaders(),
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return result[0].id;
}

/**
 * Check if a chapter with given chapter_number already exists for a story.
 */
async function chapterExists(strapiUrl, apiToken, storyId, chapterNumber) {
    const url = `${strapiUrl}/api/chapters?filters[story][id][$eq]=${storyId}&filters[chapter_number][$eq]=${chapterNumber}&pagination[limit]=1`;
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${apiToken}` },
    });

    if (!response.ok) return false;
    const result = await response.json();
    return result.data && result.data.length > 0;
}

/**
 * Create a chapter entry in Strapi and link uploaded images.
 */
async function createChapter(strapiUrl, apiToken, { title, chapterNumber, storyId, imageIds, isVipOnly, viewCount }) {
    const response = await fetch(`${strapiUrl}/api/chapters`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: {
                title,
                chapter_number: chapterNumber,
                story: storyId,
                images: imageIds,
                is_vip_only: isVipOnly,
                chap_published_at: new Date().toISOString().split('T')[0],
                view_count: viewCount,
            }
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Create chapter failed (${response.status}): ${errorText}`);
    }

    return await response.json();
}

/**
 * Main upload handler: process an upload job.
 */
async function uploadChapters(job) {
    const { sourceDir, strapiUrl, apiToken, storyId, isVipOnly } = job;

    emitLog(job.id, 'info', `Scanning folder: ${sourceDir}`);
    const chapters = scanChapterFolders(sourceDir);

    if (chapters.length === 0) {
        throw new Error(`No chap-* folders found in ${sourceDir}`);
    }

    emitLog(job.id, 'info', `Found ${chapters.length} chapter folders`);

    // Fetch story slug for folder organization
    let storySlug;
    try {
        storySlug = await getStorySlug(strapiUrl, apiToken, storyId);
        emitLog(job.id, 'info', `Story slug: ${storySlug}`);
    } catch (err) {
        emitLog(job.id, 'error', `Could not fetch story slug: ${err.message}. Using fallback.`);
        storySlug = `story-${storyId}`;
    }

    // Login admin for folder management (admin-only API)
    let adminJwt = null;
    let storyImageFolderId = null;
    let storyFolderId = null;

    if (job.adminEmail && job.adminPassword) {
        try {
            adminJwt = await loginAdmin(strapiUrl, job.adminEmail, job.adminPassword);
            emitLog(job.id, 'info', '🔑 Admin login successful');

            storyImageFolderId = await ensureStrapiFolder(strapiUrl, adminJwt, 'story-image', null);
            storyFolderId = await ensureStrapiFolder(strapiUrl, adminJwt, storySlug, storyImageFolderId);
            emitLog(job.id, 'info', `📁 Media folder ready: story-image/${storySlug}/`);
        } catch (err) {
            emitLog(job.id, 'error', `Folder setup failed: ${err.message}. Uploading without folders.`);
            adminJwt = null;
        }
    } else {
        emitLog(job.id, 'info', 'No admin credentials provided. Uploading without folder organization.');
    }

    // Count total images for overall progress
    const totalImages = chapters.reduce((sum, ch) => sum + ch.imageCount, 0);
    job.progress.total = totalImages;
    broadcastQueue();

    let uploadedImages = 0;
    let createdChapters = 0;
    let skippedChapters = 0;

    for (let ci = 0; ci < chapters.length; ci++) {
        const chapter = chapters[ci];

        // Check if chapter already exists → skip
        const exists = await chapterExists(strapiUrl, apiToken, storyId, chapter.chapterNumber);
        if (exists) {
            emitLog(job.id, 'info', `⏭ Skipping Chap ${chapter.chapterNumber} (already exists)`);
            uploadedImages += chapter.imageCount;
            job.progress.current = uploadedImages;
            broadcastQueue();
            skippedChapters++;
            continue;
        }

        // Create chapter subfolder: story-image/<slug>/chap-<number>
        let chapFolderId = null;
        if (adminJwt && storyFolderId) {
            try {
                chapFolderId = await ensureStrapiFolder(strapiUrl, adminJwt, chapter.folderName, storyFolderId);
            } catch (err) {
                // If folder creation fails due to expired token, refresh once
                if (err.message.includes('401') && job.adminEmail && job.adminPassword) {
                    try {
                        await delay(3000); // Avoid rate limit
                        adminJwt = await loginAdmin(strapiUrl, job.adminEmail, job.adminPassword);
                        emitLog(job.id, 'info', '🔑 Token refreshed');
                        chapFolderId = await ensureStrapiFolder(strapiUrl, adminJwt, chapter.folderName, storyFolderId);
                    } catch (retryErr) {
                        emitLog(job.id, 'error', `Could not create folder ${chapter.folderName}: ${retryErr.message}`);
                    }
                } else {
                    emitLog(job.id, 'error', `Could not create folder ${chapter.folderName}: ${err.message}`);
                }
            }
        }

        emitLog(job.id, 'info', `📤 Uploading Chap ${chapter.chapterNumber} (${chapter.imageCount} images) → 📁 story-image/${storySlug}/${chapter.folderName}/`);

        // Upload all images for this chapter
        const imageIds = [];
        for (let i = 0; i < chapter.imageFiles.length; i++) {
            const imgFile = chapter.imageFiles[i];
            const imgPath = path.join(chapter.folderPath, imgFile);

            try {
                const uploadToken = (adminJwt && chapFolderId) ? adminJwt : apiToken;
                const fileId = await uploadImageToStrapi(imgPath, strapiUrl, uploadToken, chapFolderId);
                imageIds.push(fileId);
            } catch (err) {
                // If 401 (token expired), refresh and retry once with delay
                if (err.message.includes('401') && job.adminEmail && job.adminPassword) {
                    try {
                        await delay(3000); // Avoid rate limit
                        adminJwt = await loginAdmin(strapiUrl, job.adminEmail, job.adminPassword);
                        emitLog(job.id, 'info', '🔑 Token refreshed');
                        const uploadToken = (adminJwt && chapFolderId) ? adminJwt : apiToken;
                        const fileId = await uploadImageToStrapi(imgPath, strapiUrl, uploadToken, chapFolderId);
                        imageIds.push(fileId);
                    } catch (retryErr) {
                        emitLog(job.id, 'error', `Failed to upload ${imgFile} after retry: ${retryErr.message}`);
                    }
                } else {
                    emitLog(job.id, 'error', `Failed to upload ${imgFile}: ${err.message}`);
                }
            }

            uploadedImages++;
            job.progress.current = uploadedImages;

            // Broadcast every 3 images or at the end
            if (i % 3 === 0 || i === chapter.imageFiles.length - 1) {
                broadcastQueue();
            }
        }

        if (imageIds.length === 0) {
            emitLog(job.id, 'error', `No images uploaded for Chap ${chapter.chapterNumber}, skipping creation`);
            continue;
        }

        // Create chapter entry
        const title = `Chap ${chapter.chapterNumber}`;
        const randomViews = Math.floor(Math.random() * ((job.maxViews || 0) - (job.minViews || 0) + 1)) + (job.minViews || 0);

        try {
            await createChapter(strapiUrl, apiToken, {
                title,
                chapterNumber: chapter.chapterNumber,
                storyId,
                imageIds,
                isVipOnly: job.isVipOnly,
                viewCount: randomViews,
            });
            createdChapters++;
            emitLog(job.id, 'success', `✅ Created "${title}" with ${imageIds.length} images`);
        } catch (err) {
            emitLog(job.id, 'error', `Failed to create chapter: ${err.message}`);
        }
    }

    emitLog(job.id, 'success', `Upload complete: ${createdChapters} chapters created, ${skippedChapters} skipped, ${uploadedImages} images processed`);
}

// REST endpoint to scan folders (for frontend preview)
app.post('/api/scan-folders', (req, res) => {
    const { sourceDir } = req.body;
    if (!sourceDir) return res.status(400).json({ error: 'Missing sourceDir' });

    try {
        const chapters = scanChapterFolders(sourceDir);
        res.json({ chapters });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// QUEUE PROCESSOR
async function processQueue() {
    if (isProcessing) return;

    let nextJob = jobs.find(j => j.status === 'pending');
    if (!nextJob) return;

    isProcessing = true;

    while (nextJob) {
        nextJob.status = 'processing';
        broadcastQueue();

        try {
            if (nextJob.jobType === 'upload') {
                await uploadChapters(nextJob);
            } else {
                await scrapeImages(nextJob);
            }
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

// SOCKET EVENTS
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('queue-updated', jobs);

    // Scrape job
    socket.on('add-job', (data) => {
        const { url, outputDir, headless = true, startImageIndex = 1 } = data;
        if (!url || !outputDir) return;

        const newJob = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            jobType: 'scrape',
            startImageIndex,
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

    // Upload job
    socket.on('add-upload-job', (data) => {
        const { sourceDir, strapiUrl, apiToken, storyId, isVipOnly = false, minViews = 0, maxViews = 0 } = data;
        if (!sourceDir || !strapiUrl || !apiToken || !storyId) {
            socket.emit('log', { jobId: 'SYSTEM', type: 'error', message: 'Missing required fields for upload', timestamp: new Date().toLocaleTimeString() });
            return;
        }

        const newJob = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            jobType: 'upload',
            sourceDir,
            strapiUrl,
            apiToken,
            storyId,
            isVipOnly,
            minViews,
            maxViews,
            adminEmail: data.adminEmail || '',
            adminPassword: data.adminPassword || '',
            // For display purposes
            url: `Upload → Story #${storyId}`,
            outputDir: sourceDir,
            status: 'pending',
            progress: { current: 0, total: 0 },
            errorMsg: ''
        };

        jobs.push(newJob);
        broadcastQueue();
        processQueue();
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
