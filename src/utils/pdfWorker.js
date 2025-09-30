// PDF.js worker configuration for Vite
import { pdfjs } from 'react-pdf';

// Configure the worker to use local file with .js extension (v3.11.174)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export { pdfjs };