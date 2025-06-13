import { Hono } from "hono";
import { logger } from "hono/logger";
import { cache } from "hono/cache";
import { except } from "hono/combine";
import { og } from "./og";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("*", logger()).use(
  "*",
  except(
    (c) => c.req.url.includes("localhost"),
    cache({
      cacheName: async (c) => {
        const url = new URL(c.req.url);
        const params = url.searchParams.toString();
        return `${c.req.method} ${url.pathname}${params}`;
      },

      // one week, revalidate up to one day after expired
      cacheControl: "max-age=604800, stale-while-revalidate=86400",
    }),
  ),
);

app.get("/", (c) => {
  return c.text("Hi!");
});

app.route("/og", og);

export default app;
