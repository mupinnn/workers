# Workers

Cloudflare Workers that powers [mupin.dev](https://mupin.dev)

```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```

## Acknowledgement

- https://github.com/vinhphm/site-worker, https://vinh.dev/writing/dynamic-og-images-cloudflare-workers.html - My first reference when searching up
  for running OG image generator on Cloudflare Workers.
