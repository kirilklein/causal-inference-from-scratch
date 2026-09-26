import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ROOT, BASE } from "./build.mjs";

const directory = path.join(ROOT, "dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".py": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};
const server = http.createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (pathname === "/") {
    response.writeHead(302, { Location: BASE }).end();
    return;
  }
  const relative = pathname.startsWith(BASE)
    ? pathname.slice(BASE.length)
    : null;
  const file =
    relative === null
      ? null
      : path.resolve(
          directory,
          relative + (pathname.endsWith("/") ? "index.html" : ""),
        );
  if (!file || !file.startsWith(directory + path.sep)) {
    response.writeHead(404).end("Not found");
    return;
  }
  try {
    const content = await readFile(file);
    response
      .writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      })
      .end(content);
  } catch (error) {
    if (!["ENOENT", "EISDIR"].includes(error.code)) throw error;
    response
      .writeHead(404, { "Content-Type": "text/html; charset=utf-8" })
      .end(await readFile(path.join(directory, "404.html")));
  }
});
server.listen(Number(process.env.PORT || 4173), "127.0.0.1", () =>
  console.log(
    `Course preview: http://127.0.0.1:${server.address().port}${BASE}`,
  ),
);
