import type { Context } from "hono";

declare global {
  type HonoContextBindings = Context<{ Bindings: CloudflareBindings }>;
}
