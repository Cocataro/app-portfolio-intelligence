const http = require('http');
const fs = require('fs');

const PAPERCLIP_PORT = 3100;
const DASHBOARD_PORT = 3201;

http.createServer((req, res) => {
  // Serve dashboard HTML for root
  if (req.url === '/' || req.url === '/index.html') {
    try {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(fs.readFileSync('/paperclip/dashboard.html'));
    } catch(e) {
      res.writeHead(500);
      res.end('Dashboard file not found at /paperclip/dashboard.html');
    }
    return;
  }

  // Proxy ALL /api requests to Paperclip
  if (req.url.startsWith('/api')) {
    const proxyOpts = {
      hostname: '127.0.0.1',
      port: PAPERCLIP_PORT,
      path: req.url,
      method: req.method,
      headers: {...req.headers}
    };
    // Remove host header so Paperclip sees localhost
    delete proxyOpts.headers.host;

    const proxyReq = http.request(proxyOpts, proxyRes => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    proxyReq.on('error', e => {
      res.writeHead(502);
      res.end('Proxy error: ' + e.message);
    });
    req.pipe(proxyReq);
    return;
  }

  // Everything else: 404
  res.writeHead(404);
  res.end('Not found');
}).listen(DASHBOARD_PORT, '0.0.0.0', () => {
  console.log('Dashboard proxy running on port ' + DASHBOARD_PORT);
});
