import * as http from "http";

export function createServer(host = "127.0.0.1", port = 34569) {
  const server = http.createServer((req, res) => {
    if (req.url!.startsWith("/text")) {
      res.end(req.method + " " + req.url);
    } else if (req.url!.startsWith("/json")) {
      res.end(JSON.stringify({ method: req.method, url: req.url }));
    } else if (req.url!.startsWith("/post")) {
      const buffers: any[] = [];
      req.on("data", (chunk) => buffers.push(chunk));
      req.on("end", () => {
        const body = Buffer.concat(buffers).toString("utf8");
        res.end(JSON.stringify({ method: req.method, url: req.url, body }));
      });
    } else {
      res.statusCode = 404;
      res.end(req.method + " " + req.url);
    }
  });
  const url = "http://" + host + ":" + port;
  server.listen(port, host);
  return { url, host, port, server };
}
