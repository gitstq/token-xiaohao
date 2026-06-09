const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "authorization,content-type,x-api-key,anthropic-version",
  "Access-Control-Max-Age": "86400",
  "X-Token-Xiaohao-Proxy": "1"
};

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function sendJson(res, status, body) {
  res.writeHead(status, {
    ...corsHeaders,
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(body));
}

function safeJoin(root, pathname) {
  const normalized = path.normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, "");
  const filePath = path.join(root, normalized || "index.html");
  if (!filePath.startsWith(root)) return null;
  return filePath;
}

function serveStatic(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let filePath = safeJoin(ROOT, requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
  if (!filePath) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": contentTypes[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600"
  });
  fs.createReadStream(filePath).pipe(res);
}

function getTargetUrl(req) {
  const localUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const target = localUrl.searchParams.get("target");
  if (!target) return null;

  const targetUrl = new URL(target);
  if (!ALLOWED_PROTOCOLS.has(targetUrl.protocol)) return null;
  return targetUrl;
}

async function proxyRequest(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  let targetUrl;
  try {
    targetUrl = getTargetUrl(req);
  } catch {
    sendJson(res, 400, { error: "Invalid target URL" });
    return;
  }

  if (!targetUrl) {
    sendJson(res, 400, { error: "Missing target URL" });
    return;
  }

  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    const lower = name.toLowerCase();
    if (["host", "origin", "referer", "connection"].includes(lower)) continue;
    if (Array.isArray(value)) headers.set(name, value.join(","));
    else if (value) headers.set(name, value);
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
      duplex: "half",
      redirect: "follow"
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");
    Object.entries(corsHeaders).forEach(([name, value]) => responseHeaders.set(name, value));
    res.writeHead(response.status, Object.fromEntries(responseHeaders));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    sendJson(res, 502, { error: error.message || "Proxy request failed" });
  }
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/healthz")) {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.url.startsWith("/proxy")) {
    proxyRequest(req, res);
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`Token Xiaohao is listening on http://${HOST}:${PORT}`);
});
