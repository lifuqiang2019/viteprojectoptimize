import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Enable gzip compression
app.use(compression());

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 4173;
app.listen(PORT, () => {
  console.log(`Preview server running at http://localhost:${PORT}`);
  console.log('Gzip compression enabled');
});
