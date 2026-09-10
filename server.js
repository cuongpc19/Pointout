#!/usr/bin/env node
/**
 * Zero-dependency static server for the game.
 *
 * Deliberately no framework and no node_modules: the game is plain static files, and a dev
 * server that needs an install is one more thing that can be broken on a fresh clone.
 *
 *   node server.js            -> http://localhost:5273
 *   node server.js 8080       -> http://localhost:8080
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.argv[2] || process.env.PORT || 5273);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }
  if (urlPath === "/") urlPath = "/index.html";

  // Resolve inside ROOT only — a path that escapes it is refused rather than served.
  const file = path.resolve(ROOT, "." + urlPath);
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("404 — " + urlPath);
      return;
    }
    res.writeHead(200, {
      "content-type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "content-length": st.size,
      // Dev server: never let the browser hold a stale build.
      "cache-control": "no-cache, no-store, must-revalidate",
    });
    fs.createReadStream(file).pipe(res);
  });
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`\n  Cổng ${PORT} đang bận. Thử:  node server.js ${PORT + 1}\n`);
    process.exit(1);
  }
  throw e;
});

server.listen(PORT, () => {
  console.log(`\n  Point Out — Color Escape`);
  console.log(`  ➜  http://localhost:${PORT}\n`);
});
