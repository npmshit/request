import { createServer } from "./example_server";

const { url } = createServer();
console.log("PID: %s, URL: %s", process.pid, url);
