# E7kini

Next.js starter for the E7kini app, beginning with the login screen.

## Run locally

Install Node.js first, then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy on EasyPanel

**Use Dockerfile, not Nixpacks or Railpack.** Nix/Railpack builds fail on some EasyPanel hosts.

1. **Source → Build** → select **Dockerfile** (not Nixpacks).
2. **Dockerfile path:** `Dockerfile`
3. **Start command:** empty, or `npm start` — **not** `npm run dev`
4. **Port:** `3000`
5. Copy env vars from `.env.local.example` into the **Environment** tab.

A successful build log starts with `FROM node:20-alpine`, not `Nixpacks` or `nix-env`.
