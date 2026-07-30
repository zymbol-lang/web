#!/usr/bin/env node
// Static dev server for this directory, with caching turned off.
//
//   node tests/serve.mjs [port]        # default 8080, binds 0.0.0.0 for phone/tablet testing
//
// Why not `python3 -m http.server`: it sends `Last-Modified` and nothing else — no
// `Cache-Control`, no `ETag`. With no `Cache-Control` a browser falls back to the RFC 9111
// heuristic (freshness ≈ 10% of the file's age) and simply does not revalidate, so a phone
// keeps serving whatever it cached. That is invisible until a module is *renamed or deleted*:
// a stale `playground.js` still holding `import { EXAMPLES } from './examples.js'` fetches a
// file that no longer exists, the whole ES module graph fails, and the page loads dead with
// nothing in the UI to explain it. Every response here carries `no-store`.
//
// Plain Node, no npm dependency (web/ has no package.json — see CLAUDE.md).

import { createServer } from 'http';
import { createReadStream, statSync } from 'fs';
import { join, extname, resolve, sep } from 'path';
import { fileURLToPath } from 'url';
import { networkInterfaces } from 'os';

const ROOT = resolve(join(fileURLToPath(import.meta.url), '..', '..'));
const PORT = Number(process.argv[2] ?? 8080);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.woff2': 'font/woff2',
  '.ttf':  'font/ttf',
  '.xml':  'application/xml; charset=utf-8',
  // The playground fetches examples as text; without an explicit type these would be
  // application/octet-stream and `res.text()` would still work, but the browser's network
  // panel becomes useless for debugging a bad path.
  '.zy':   'text/plain; charset=utf-8',
  '.zyp':  'application/zip',
};

const server = createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch {
    res.writeHead(400).end('bad request');
    return;
  }
  if (urlPath.endsWith('/')) urlPath += 'index.html';

  // Containment check: resolve first, then verify the result is still under ROOT. A lexical
  // check on the raw path would miss `%2e%2e` and symlinked directories.
  const abs = resolve(join(ROOT, urlPath));
  if (abs !== ROOT && !abs.startsWith(ROOT + sep)) {
    res.writeHead(403).end('forbidden');
    return;
  }

  let st;
  try {
    st = statSync(abs);
    if (st.isDirectory()) throw new Error('directory');
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
       .end(`404 ${urlPath}\n`);
    console.log(`  404  ${urlPath}`);
    return;
  }

  res.writeHead(200, {
    'Content-Type': MIME[extname(abs).toLowerCase()] ?? 'application/octet-stream',
    'Content-Length': st.size,
    'Cache-Control': 'no-store, must-revalidate',
  });
  createReadStream(abs).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  const lan = Object.values(networkInterfaces()).flat()
    .filter(i => i && i.family === 'IPv4' && !i.internal)
    .map(i => i.address);
  console.log(`serving ${ROOT} with Cache-Control: no-store\n`);
  console.log(`  http://localhost:${PORT}/playground.html`);
  for (const ip of lan) console.log(`  http://${ip}:${PORT}/playground.html`);
  console.log('\nCtrl+C to stop');
});
