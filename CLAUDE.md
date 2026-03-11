# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A leaderboard web app tracking how many times cyclists have ridden Page Mill Road (Palo Alto, CA) in a Halloween costume. Each rider links to their Strava profile. Live at `www.pagemillinginahalloweencostume.com`.

## Commands

```bash
npm run dev      # Local dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # ESLint (next/core-web-vitals)
```

No test framework is configured.

## Architecture

**Next.js 14** app using the **Pages Router** (`pages/`). The `app/` directory is unused scaffold from create-next-app — ignore it.

- `pages/riders.js` — The entire app. Single page that fetches `riders.json` client-side, sorts by count descending, computes rank (with ties), and renders a leaderboard table.
- `styles/style.css` + `styles/1.css` — All styling (custom CSS with Google Fonts: Vollkorn, Varela). Tailwind is configured but mostly unused.
- `next.config.js` — `output: 'standalone'`, redirects `/` → `/riders`.
- `index.js` and `index.html` — Legacy artifacts, not used by the Next.js app.

## Rider Data

Each rider has `name`, `id` (Strava athlete ID), and `count` (costumed rides).

- **Local dev**: `public/riders.json` (stub with one entry).
- **Production**: Rider data lives in `chart/pagemilling/values.yaml` under the `riders` key. It's mounted into the container via a Kubernetes ConfigMap at `/app/public/riders.json`, overriding the repo stub. To update rider counts, edit `values.yaml` and `helm upgrade` — no image rebuild needed.
- **Rider photos**: Each rider needs a JPEG at `public/<Name>.jpg` matching their `name` field exactly (e.g., `Megan Gardner.jpg`). Photos are baked into the Docker image.

## Deployment

Deployed to Kubernetes via Helm chart at `chart/pagemilling/`. Container image: `ghcr.io/maugt/pagemilling/pagemilling:latest`. Uses nginx ingress with cert-manager (Let's Encrypt) and Cloudflare DNS via external-dns.

The Dockerfile is a multi-stage Node 18 Alpine build producing a standalone Next.js server on port 3000.
