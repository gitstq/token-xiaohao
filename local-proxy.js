const http = require("node:http");
const { URL } = require("node:url");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 8787);
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "authorization,content-type,x-api-key,anthropic-version",
  "Access-Control-Max-Age": "86400"
};

function sendJson(res, status, body) {
  res.writeHead(status, {
    ...corsHeaders,
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(body));
}

function getTargetUrl(req) {
  const localUrl = new URL(req.url, `http://${HOST}:${PORT}`);
  const target = localUrl.searchParams.get("target");
  if (!target) return null;

  const targetUrl = new URL(target);
  if (!ALLOWED_PROTOCOLS.has(targetUrl.protocol)) return null;
  return targetUrl;
}

const server = http.createServer(async (req, res) => {
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
});

server.listen(PORT, HOST, () => {
  console.log(`Local proxy listening on http://${HOST}:${PORT}`);
});
