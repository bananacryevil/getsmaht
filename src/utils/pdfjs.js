import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?raw';

// The workerSrc is a string of the worker code. We need to create a blob URL from it.
const workerBlob = new Blob([workerSrc], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(workerBlob);

GlobalWorkerOptions.workerSrc = workerUrl;

export { getDocument };

