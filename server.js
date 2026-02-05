const express = require('express');
const path = require('path');
const fs = require('fs');
const livereload = require('livereload');

const PORT = process.env.PORT || 8080;
const app = express();

// Livereload server — watch html/ and css/
const lrServer = livereload.createServer({
  exts: ['html', 'css', 'js'],
});
lrServer.watch([
  path.join(__dirname, 'html'),
  path.join(__dirname, 'css'),
]);

const LR_SNIPPET = `<script>(function(){var s=document.createElement('script');s.src='http://'+location.hostname+':35729/livereload.js?snipver=1';document.body.appendChild(s);})();</script>`;

// Static asset directories — try URL-encoded filename on disk if decoded fails
for (const dir of ['css', 'js', 'images', 'videos', 'audio', 'other', 'models']) {
  const dirPath = path.join(__dirname, dir);
  app.use(`/${dir}`, (req, res, next) => {
    // Express decodes %20 → space, but files on disk may have literal %20 in name
    const encodedName = req.path.slice(1); // strip leading /
    const encodedPath = path.join(dirPath, encodedName);
    if (fs.existsSync(encodedPath)) {
      return res.sendFile(encodedPath);
    }
    next();
  }, express.static(dirPath));
}

// Serve HTML files with livereload snippet injected before </body>
function serveHtml(filePath, res) {
  if (!fs.existsSync(filePath)) return false;
  let html = fs.readFileSync(filePath, 'utf-8');
  html = html.replace('</body>', LR_SNIPPET + '</body>');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
  return true;
}

// Homepage
app.get('/', (req, res) => {
  serveHtml(path.join(__dirname, 'html', 'index.html'), res);
});

// Project pages: /projects/<slug> → html/<slug>
app.get('/projects/:slug', (req, res) => {
  const filePath = path.join(__dirname, 'html', req.params.slug);
  if (!serveHtml(filePath, res)) {
    res.status(404).send('Not found');
  }
});

// Generic pages: /<page> → html/<page>
app.get('/:page', (req, res) => {
  // Skip asset directories
  if (['css', 'js', 'images', 'videos', 'audio', 'other', 'models', 'favicon.ico'].includes(req.params.page)) {
    return res.status(404).send('Not found');
  }
  const filePath = path.join(__dirname, 'html', req.params.page);
  if (!serveHtml(filePath, res)) {
    // Try with .html extension
    const withExt = filePath + '.html';
    if (!serveHtml(withExt, res)) {
      res.status(404).send('Not found');
    }
  }
});

app.listen(PORT, () => {
  console.log(`Serving at http://localhost:${PORT}`);
  console.log('Livereload active — watching html/ and css/');
});
