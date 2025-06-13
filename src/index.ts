import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono in Cloudflare Workers!");
});

export default app;
