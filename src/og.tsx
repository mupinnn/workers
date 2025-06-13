import { Hono } from "hono";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
import { loadFonts, loadImage } from "./util";

const og = new Hono<{ Bindings: CloudflareBindings }>();

og.get("/", async (c) => {
  try {
    const { title, origin = "main" } = c.req.query();

    const fonts = await loadFonts(c, [
      {
        path: "bricolage-grotesque-latin-700-normal.ttf",
        weight: 700,
        style: "normal",
      },
      {
        path: "inter-latin-400-normal.ttf",
        weight: 400,
        style: "normal",
      },
    ]);
    const mainLogo = await loadImage(c, "logo/logo-main-240x240.png");
    const labLogo = await loadImage(c, "logo/logo-lab-240x240.png");

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 64,
            fontFamily: '"bricolage-grotesque-latin-700-normal.ttf"',
            fontWeight: 700,
            color: "#0E0D0D",
            background: "#FFF857",
            width: "100%",
            height: "100%",
            padding: 48,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            textAlign: "left",
            justifyContent: "center",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {origin === "main"
              ? mainLogo && <img src={mainLogo} width={24} height={24} />
              : labLogo && <img src={labLogo} width={24} height={24} />}
            <span
              style={{
                fontSize: 24,
                fontWeight: 400,
                fontFamily: "inter-latin-400-normal.ttf",
                color: "#292828",
              }}
            >
              {origin === "main" ? "mupin.dev" : "lab.mupin.dev"}
            </span>
          </div>
          <h1 style={{ margin: 0 }}>{title}</h1>

          <div
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              borderRadius: 40,
              background: "#FF8686",
              right: 48,
              bottom: 48,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 50,
              height: 50,
              borderRadius: 40,
              background: "#4273B4",
              right: 123,
              bottom: 123,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts,
      },
    );
  } catch (error: unknown) {
    console.error(error);
    return c.json(
      {
        error: "Failed to generate OG image",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

export { og };
