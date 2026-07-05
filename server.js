const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 5177);
const root = path.resolve(__dirname, "..");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".csv": "text/csv; charset=utf-8"
};

function send(res, status, body, type) {
  res.writeHead(status, {
    "Content-Type": type || "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function safePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const target = path.resolve(root, cleanPath.replace(/^\/+/, ""));
  if (!target.startsWith(root)) return null;
  return target;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url === "/" ? "/proto-calder-comic-studio/index.html" : req.url;
  const target = safePath(urlPath);

  if (!target) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.stat(target, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      send(res, 404, "Not found");
      return;
    }

    const ext = path.extname(target).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    fs.createReadStream(target).pipe(res);
  });
});

server.listen(port, () => {
  console.log(`Proto Calder Comic Studio running at http://localhost:${port}`);
});

