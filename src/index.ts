import { Hono } from "hono";
import { og } from "./og";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono in Cloudflare Workers!");
});

app.route("/og", og);

export default app;
