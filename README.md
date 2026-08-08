# StockLens — Explainable AI Market Intelligence

A production-quality landing page for StockLens, an explainable, agentic AI stock research
platform focused on Indian equities (RELIANCE, TCS, INFY, HDFCBANK).

## Stack
Next.js (App Router) · TypeScript · Tailwind CSS v4 · hand-built shadcn/ui-style primitives ·
Recharts · Framer Motion · Zustand · lucide-react

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

## Notes

- All financial data is local demo/mock data in `data/demo-stocks.ts` — no live APIs are called.
- Fonts: this project ships with a system-font fallback (see the comment at the top of
  `app/layout.tsx`) because the sandbox this was built in could not reach
  fonts.googleapis.com. To use the real Inter / Manrope / JetBrains Mono webfonts, swap in
  the `next/font/google` block described in that comment (works out of the box on any
  environment with normal internet access).
- `Github` is no longer exported by the installed lucide-react version, so a small custom
  `GithubIcon` component is used instead (`components/icons/github-icon.tsx`).

## Structure

```
app/                 page.tsx, layout.tsx, globals.css
components/landing/  one component per section (navbar, hero, agent-network, etc.)
components/charts/   stock-chart, portfolio-chart, mini-sparkline (Recharts)
components/ui/       shadcn-style primitives (button, card, tabs, table, sheet, ...)
store/                Zustand store powering the interactive stock demo
data/                 demo-stocks.ts — mock data for TCS, RELIANCE, INFY, HDFCBANK
```
