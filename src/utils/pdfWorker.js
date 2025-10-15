// PDF.js worker configuration for Vite/Electron builds
import { pdfjs } from 'react-pdf';
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';

// Use the bundled worker path so it resolves under both dev server and file:// protocols
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

export { pdfjs };