import * as http from "http";
import * as https from "https";
import * as querystring from "querystring";

function formatUrl(url: string, qs?: Record<string, any>) {
  const isHttps = url.substr(0, 6).toLowerCase() === "https:";
  if (qs) {
    if (url.indexOf("?") === -1) {
      url += "?" + querystring.stringify(qs);
    } else {
      url += "&" + querystring.stringify(qs);
    }
  }
  return { isHttps, url };
}

export const DEFAULT_TIMEOUT = 60000;

export const DEFAULT_AGENT = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: Infinity,
  maxFreeSockets: 256,
  timeout: DEFAULT_TIMEOUT,
});

export interface Response extends http.IncomingMessage {
  body: any;
}

export interface RequestOptions {
  method?: string;
  url: string;
  qs?: Record<string, any>;
  body?: any;
  json?: boolean;
  text?: boolean;
  headers?: http.OutgoingHttpHeaders;
}

/**
 * 发送请求
 * @param options
 */
export function request(options: RequestOptions): Promise<Response> {
  return new Promise((resolve, reject) => {
    const method = options.method ? options.method.toUpperCase() : "GET";
    const formatted = formatUrl(options.url, options.qs);
    const opts: http.RequestOptions = {
      method,
      headers: Object.assign({}, options.headers),
      timeout: DEFAULT_TIMEOUT,
      agent: DEFAULT_AGENT,
    };
    if (options.body) {
      opts.headers!["content-type"] = "application/json";
    }
    const lib = (formatted.isHttps ? https : http) as typeof http;
    const req = lib.request(formatted.url, opts, res => {
      req.on("error", reject);
      const buffers: any[] = [];
      res.on("data", chunk => buffers.push(chunk));
      res.on("end", () => {
        try {
          const body = Buffer.concat(buffers);
          const res2 = res as Response;
          if (options.text) {
            res2.body = body.toString("utf8");
          } else if (options.json) {
            res2.body = JSON.parse(body.toString("utf8"));
          } else {
            res2.body = body;
          }
          resolve(res2);
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on("error", reject);
    if (options.body) {
      req.end(JSON.stringify(options.body));
    } else {
      req.end();
    }
  });
}
