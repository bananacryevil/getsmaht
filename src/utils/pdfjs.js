import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

// Set the worker source to the local copy in the public folder
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

export { getDocument };

