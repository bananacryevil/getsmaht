# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Window size and position persistence

This app preserves window size and position across launches for a frictionless study workflow. The main window and notes windows persist independently, so your Notes window reopens exactly where you last placed it, separate from the main window.

Details:

- State is stored in your user data folder as `window-state.json`.
- The file contains keys for each window type, e.g. `{ "main": { x, y, width, height }, "notes": { ... } }`.
- If a legacy single-object format exists, it's read and migrated seamlessly.

## PDF Viewer Keyboard Shortcuts

The built-in PDF viewer supports a set of ergonomic keyboard and mouse shortcuts:

- Ctrl + Mouse Wheel: Smooth zoom in/out at cursor position
- Ctrl + + / =: Zoom in
- Ctrl + -: Zoom out
- Ctrl + 0: Reset zoom to 100%
- Left / Right Arrow: Previous / Next page
- Home / End: First / Last page
- Space / Shift+Space: Scroll down/up by almost one screen
- PageDown / PageUp: Scroll down/up by almost one screen
- F: Fit width
- P: Fit page
- T: Toggle table of contents
- Double-click: Zoom in at pointer
- Shift + Double-click: Zoom out at pointer

The viewer also remembers the last page and zoom per document, restoring your reading position when you return.
