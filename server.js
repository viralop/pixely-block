const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const LEVELS_DIR = path.join(__dirname, 'js', 'levels');

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  if (req.method === 'PUT' && req.url.startsWith('/save-level/')) {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      const fname = path.basename(req.url);
      if (!fname.startsWith('level-') || !fname.endsWith('.js')) {
        res.writeHead(400); res.end('Invalid filename'); return;
      }
      const fpath = path.join(LEVELS_DIR, fname);
      fs.writeFile(fpath, body, err => {
        if (err) { res.writeHead(500); res.end('Write failed'); return; }
        console.log('Saved: ' + fname);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, file: fname }));
      });
    });
    return;
  }

  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  const fpath = path.join(__dirname, urlPath);

  if (!fpath.startsWith(__dirname)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(fpath, (err, data) => {
    if (err) {
      res.writeHead(404); res.end('Not found'); return;
    }
    const ext = path.extname(fpath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('Pixely Block server at http://localhost:' + PORT);
  console.log('Levels folder: ' + LEVELS_DIR);
});
