// vite.config.js
export default {
  root: 'public', // Serve files directly from the public folder
  build: {
    outDir: '../dist', // Output folder (outside public)
    emptyOutDir: true, // Clean it before building
  },
};

