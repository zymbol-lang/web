#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Serve this checkout of the site on the local network, for a phone to open.
//
//   node zymbol_vm/tools/serve.mjs [PORT]        (default 8077)
//
// Serves the worktree's root — the current site and zymbol_vm/ side by side — on
// every interface, with caching off so a reload always takes the latest module,
// and prints the addresses to open: the new playground, and the current one to
// compare it with. Development only: nothing here is how the site is published.

import { createServer } from 'http';
import { createReadStream, statSync } from 'fs';
import { networkInterfaces } from 'os';
import { dirname, extname, join, normalize, resolve, sep } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PORT = Number(process.argv[2] ?? 8077);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.zy': 'text/plain; charset=utf-8', '.zyp': 'application/zip', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json', '.xml': 'application/xml',
};

createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = normalize(join(ROOT, path));
  if (file !== ROOT && !file.startsWith(ROOT + sep)) { res.writeHead(403).end(); return; }
  try {
    if (statSync(file).isDirectory()) file = join(file, 'index.html');
    const size = statSync(file).size;
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': size,
      'Cache-Control': 'no-store',
    });
    if (req.method === 'HEAD') { res.end(); return; }
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }).end('not found\n');
  }
}).listen(PORT, '0.0.0.0', () => {
  const ips = Object.values(networkInterfaces()).flat()
    .filter(a => a && a.family === 'IPv4' && !a.internal).map(a => a.address);
  for (const ip of ips.length ? ips : ['127.0.0.1']) {
    console.log(`new playground:      http://${ip}:${PORT}/zymbol_vm/playground.html`);
    console.log(`current playground:  http://${ip}:${PORT}/playground.html`);
  }
});
