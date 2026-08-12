@AGENTS.md

# Project: Liraz Axelrad personal site

## What it is
Personal site for Liraz Axelrad — product management + meditation + migration/life-transitions mentor. Next.js (App Router) + TypeScript + Tailwind CSS. Two independent language versions, not translations of each other:
- Hebrew (RTL) at `/` — primary/default language.
- English (LTR) at `/en`.

Both use the same menu-driven interactive homepage (hover reveals a photo, click opens an info panel — no navigation) built in `components/HomeMenu.tsx`, driven by per-locale content in `content/he.ts` / `content/en.ts` (shape defined in `content/types.ts`). Original high-fidelity design prototype (static `.dc.html` files + handoff README) is preserved in `design/` for reference.

Repo: https://github.com/LirazAxelrad100/lirazaxelrad-home-site

## Status: working v1, pushed to GitHub, not yet deployed
- Homepage (both locales), About, Writing (list + post), Contact all built and verified in-browser.
- Contact form posts to `app/api/contact/route.ts`, sends via Resend — **not yet functional** until `RESEND_API_KEY` is set (see `.env.example`); until then it fails gracefully with an error message.
- SEO basics in place: per-page metadata, `sitemap.ts`, `robots.ts`, hreflang alternates.
- All body copy is placeholder Lorem Ipsum on purpose — Liraz will supply real Hebrew and English copy later (per page, per locale). Short structural labels (menu items, buttons, form field labels) are already real, not placeholder.

## Key decisions
- **Claude writes the code; Liraz reviews/tests in browser and handles all git commands herself** (add/commit/push) — for her portfolio, and her stated preference for this project.
- **Not a translation-key i18n setup.** Each locale has its own independent content object (menu order, item count, copy can all differ). Chosen over next-intl/dictionaries because Liraz explicitly wants different menu order/content per language, not structural parity.
- **Routing:** Next.js "multiple root layouts" pattern — `app/(he)/` is a route group (no URL segment, so Hebrew sits at bare `/`) with its own root layout (`<html lang="he" dir="rtl">`); `app/en/` is a real folder (adds `/en` prefix) with its own root layout (`<html lang="en" dir="ltr">`). No top-level `app/layout.tsx` — each locale is genuinely root.
- **Homepage-only compact spacing:** `Header` and `Footer` both take an optional `compact` prop, used only when rendered from `HomeMenu` (the homepage). This exists because Liraz found the homepage specifically felt oversized/required scrolling, while About/Writing/Contact felt fine as-is — so sizing was tuned per-surface, not globally. Don't collapse this back into one shared size.
- **Homepage layout: no `flex-1` stretch on the menu/image row.** It was removed deliberately — `min-h-screen` + `flex-1` on that row was stretching to fill the viewport, which created a large empty gap above the footer once the menu became more compact. Don't re-add it without checking the footer gap again.
- Subscribe link was removed entirely (not wanted). RSS icon lives in the footer only (moved from header), positioned right of LinkedIn in Hebrew — which mirrors to LinkedIn's *left* in English, since footer social links use direction-aware (`dir`) start/end positioning, not a fixed side. This mirroring is intentional, not a bug.
- Node.js wasn't installed on this machine — installed via nvm (`~/.nvm`, default alias is v24.19.0). If commands like `npm`/`node` aren't found in a fresh shell, `nvm`'s init lines are in `~/.zshrc`.

## What's next
- Liraz to create a free Resend account and provide the API key to enable real contact-form email delivery.
- Deploy to Vercel, connected to the GitHub repo.
- Point `lirazaxelrad.com` at Vercel (currently on WordPress; domain was registered through WordPress.com but is Liraz's own and portable).
- Liraz to supply real Hebrew + English copy (Markdown) per page to replace placeholder text.
- Decide whether "הגירה/Migration" and "ניהול מוצר/Product Management" get their own dedicated pages (currently their panel CTAs link to the About page as a stand-in, matching the original design's intent).
- Blog/Writing section is in for now but Liraz was still undecided on keeping it long-term.
