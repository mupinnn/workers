import { Buffer } from "node:buffer";

type FontStyle = "normal" | "italic";
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type FontConfig = {
  path: string;
  style: FontStyle;
  weight: FontWeight;
};

export async function loadFonts(
  c: HonoContextBindings,
  fonts: FontConfig[],
): Promise<
  Array<{
    data: ArrayBuffer;
    name: string;
    style: FontStyle;
    weight: FontWeight;
  }>
> {
  try {
    const fontPromises = fonts.map(
      async ({ path, weight, style = "normal" }) => {
        const name = path;
        const fontURL = new URL(`/fonts/${path}`, c.req.url).toString();
        const response = await c.env.ASSETS.fetch(fontURL);

        if (!response.ok) {
          throw new Error(
            `Failed to load font at ${fontURL} with status ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.arrayBuffer();

        return {
          data,
          name,
          weight,
          style,
        };
      },
    );

    return Promise.all(fontPromises);
  } catch (error: unknown) {
    throw new Error(
      `Failed to load fonts: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function loadImage(
  c: HonoContextBindings,
  path: string,
): Promise<string | null> {
  try {
    const imageURL = new URL(`/images/${path}`, c.req.url).toString();
    const response = await c.env.ASSETS.fetch(imageURL);
    const data = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";
    const base64Image = Buffer.from(data).toString("base64");

    return `data:${contentType};base64,${base64Image}`;
  } catch (error: unknown) {
    console.warn(
      `Failed to load image: ${error instanceof Error ? error.message : String(error)}`,
    );

    return null;
  }
}
