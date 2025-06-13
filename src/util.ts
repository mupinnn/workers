import type { Context } from "hono";

type FontStyle = "normal" | "italic";
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type FontConfig = {
  path: string;
  style: FontStyle;
  weight: FontWeight;
};

export async function getLocalFonts(
  c: Context,
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
        const name = "font-family";
        const fontURL = new URL(`/fonts/${path}`).toString();
        const response = await c.env.ASSETS.fetch(fontURL);

        if (!response.ok) {
          throw new Error(`Failed to load font`);
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
