# Cloudflare Pages

This repository is prepared for Cloudflare Pages as a static site.

## Pages settings

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root

The build copies `prototypes/plan-view` into `dist`, so the app is served from the domain root.

## Local checks

```sh
npm run verify
npm run build
```

To preview with Wrangler:

```sh
npm run build
npm run preview
```

The live app content is edited in `prototypes/plan-view/data/content.json`.
