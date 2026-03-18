// Using PDF.js Legacy Build (v3.11.174) for maximum compatibility.
// This version is stable and avoids modern ESM worker issues in Vite.
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
import mammoth from 'mammoth';

// Reference the legacy worker copied to /public/pdf.worker.js
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const getFileExtension = (fileName = '') => fileName.split('.').pop()?.toLowerCase() || '';

const isPdfFile = (file) => file.type === 'application/pdf' || getFileExtension(file.name) === 'pdf';
const isDocxFile = (file) =>
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    getFileExtension(file.name) === 'docx';
const isTextFile = (file) => file.type === 'text/plain' || getFileExtension(file.name) === 'txt';

const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();

    // Use Uint8Array for the data, which is most compatible across PDF.js versions.
    const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        // Disable worker for the initial fetch to avoid CORS/loading issues in some environments,
        // but still use the worker for actual parsing.
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
    });
    
    const pdf = await loadingTask.promise;

    const maxPages = Math.min(pdf.numPages, 15);
    const pageTexts = [];

    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item) => item.str || '')
            .join(' ')
            .trim();
        pageTexts.push(pageText);
    }

    return pageTexts.join('\n').trim();
};

const extractDocxText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
};

export const extractResumeText = async (file, options = {}) => {
    const {
        allowPdf = true,
        allowDocx = true,
        allowTxt = true,
        minLength = 1,
    } = options;

    if (!file) throw new Error('No file provided.');

    let text = '';

    if (allowPdf && isPdfFile(file)) {
        text = await extractPdfText(file);
    } else if (allowDocx && isDocxFile(file)) {
        text = await extractDocxText(file);
    } else if (allowTxt && isTextFile(file)) {
        text = (await file.text()).trim();
    } else {
        const ext = getFileExtension(file.name).toUpperCase();
        throw new Error(`Unsupported file format (${ext}). Please upload PDF or DOCX.`);
    }

    if (!text || text.trim().length < minLength) {
        throw new Error(
            'The file appears to be empty or is a scanned/image-only PDF. Please upload a text-based PDF.'
        );
    }

    return text.trim();
};
