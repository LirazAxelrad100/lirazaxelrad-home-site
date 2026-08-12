# Handoff: Liraz Axelrad — Personal Site (Hebrew, RTL)

## Overview
Personal site for Liraz Axelrad — product management + meditation + migration/life-transitions mentor, writing in Hebrew. The homepage is a menu-driven "editorial" concept: a fixed vertical menu of six topics; hovering/clicking a topic reveals an image and (on click) a content panel. Content pages (About, Writing, Writing Post, Contact) share a simple header and a shared footer.

## About the Design Files
The files in this bundle are **design references built in HTML** (a lightweight internal templating system, not React) — they show the intended layout, styling, copy, and interaction behavior, not production code to copy directly. Recreate these designs in the target codebase's existing environment (React, Next.js, plain HTML/CSS, etc.) using its established patterns — or choose the most appropriate framework if none exists yet.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy are final for the sections built. A few sections are stand-ins:
- Tagline text under the name ("בלה בלה בלה") is a placeholder — needs real copy.
- Five of six menu-hover images are placeholders (assets/menu-thumb-placeholder.png) — only "אודות", "בלוג", and "תמיכה" have real photos.
- "הגירה" (migration) and "ניהול מוצר" (PM) content panels currently link to the About page — they need their own dedicated pages eventually.

## Screens / Views

### 1. Homepage — default state (index.dc.html, no menu item active)
**Purpose:** Landing page; browsing entry point into the site's six topics.
**Layout:** Full-height flex column, RTL. Header row (space-between) at top; below it a flex row with the menu (nav, max-width 640px when nothing is hovered) and an image-reveal zone (flex:1, max-width 640px) to its start side; footer pinned at bottom.
**Header:**
- Name "לירז אקסלרד" — Rubik, weight 200, clamp(36px,6vw,64px), line-height 1, wrapped in a link that resets to this default state.
- Tagline directly below, no gap: 16px, oklch(0.55 0 0).
- Right side: subscribe link "הרשמה לעדכונים" (14px, gray, darkens on hover) + an RSS icon link (inline SVG, 16×16, same gray, darkens on hover), gap 18px between them.
**Menu (6 items, numbered 01–06):** אודות, בלוג, הגירה, מדיטציה, ניהול מוצר, תמיכה. Each row: a number in a circle + label, gap 22px, vertical padding 20px/28px (default) or 14px/20px (when a panel is active — tighter). Label: Rubik weight 200 default, 500 on hover, font-size 34px default / 22px when a panel is active. Number circle: 32px default, grows to 54px on hover with weight 500 and a solid fill in the current accent color (default oklch(0.42 0.01 260)), text white; otherwise transparent bg, gray text, weight 300, font-size 14px (22px on hover). Transition: all 0.3s ease on the circle.
**Image reveal (hover only, no panel open):** A square (aspect-ratio:1) div, background: url(image) center top/cover. Default (not hovered): opacity 0, scale(0.6) rotate(-16deg), filter grayscale(1). On hover: opacity 1, scale(1) rotate(0), transition opacity .3s, transform .75s cubic-bezier(0.34,2.2,0.4,1). If "grayscale hover" is on (default), the image is meant to flash grayscale then fade to full color over ~1.8s on every hover — **note:** this reveal-fade has been unreliable in testing (works on the first hover, not consistently on subsequent switches between items) and needs a more robust implementation in the target codebase (e.g. driven by real transition events or a proper animation library) rather than the timer-based hack currently in the prototype.
**Footer:** shared Footer component (see below).

### 2. Homepage — item selected (index.dc.html, activeKey set, e.g. "אודות")
**Purpose:** Same page, now showing one topic's content panel instead of the image-reveal zone.
**Layout changes from state 1:**
- Menu column narrows to a fixed 260px, items shrink (padding 14px/20px, label font-size 22px).
- Image-reveal zone is replaced by a content panel: flex:1, max-width 640px, background oklch(0.96 0.003 260), border-radius 6px, padding 48px/44px.
- Panel content: eyebrow line (13px, accent color, letter-spacing 0.5px) → title (Rubik 500, 28px) → body paragraph (16px, line-height 1.8, oklch(0.4 0 0)) → CTA link (15px, weight 600, accent color, arrow "←" suffix) linking to the topic's dedicated page (about/writing/contact).
- Clicking the name in the header resets back to state 1 (clears activeKey).
**Content per topic** (eyebrow / title / body / CTA / link target):
- אודות → קצת עליי / (bio 1-liner) / הסיפור המלא → about.dc.html
- בלוג → מהכתיבה האחרונה · 28.07.2026 / (post teaser) / כל הפוסטים → writing.dc.html
- הגירה → ליווי וצמיחה / … / עוד על הליווי → about.dc.html (needs own page)
- מדיטציה → MBSR ובודהיזם / … / עוד על התרגול → about.dc.html (needs own page)
- ניהול מוצר → ליווי אישי / … / עוד על הליווי → about.dc.html (needs own page)
- תמיכה → צור קשר / … / לטופס יצירת קשר → contact.dc.html

### 3. Content page template (about.dc.html — same shell used by writing.dc.html, writing-post.dc.html, contact.dc.html)
**Purpose:** Standard article/page shell for About, Writing (list + post), and Contact.
**Layout:**
- Header: identical name+tagline block as the homepage (no subscribe/RSS/menu here — just the name, linking back to index.dc.html, and the tagline below it).
- Content area is page-specific, centered, max-width varies by page (640px for About intro / Contact, 760px for Writing list, 680px for a Writing post, 900px for the About "what I do" section) with generous top/bottom padding (56–100px).
- Typography for body content uses **David Libre** (serif, weight 500 for headings) + **Heebo** (sans, body text) — distinct from the Rubik used in the header/homepage-menu, intentionally: Rubik reads as the "voice"/nav layer, David Libre + Heebo as the "reading" layer.
- Footer at the bottom (shared component).
**About page specifics:** intro section (h1 + 3 paragraphs) then a "מה שאני עושה" section (h2 + 3 sub-items, each an h3 + paragraph) then a CTA link to Contact.

## Shared Component: Footer (Footer.dc.html)
Appears at the bottom of every page (homepage + all content pages). RTL, Heebo font, top border, margin-top:80px. Row (space-between, wraps): name (David Libre, 18px) + email mailto link (14px, gray) on one side; social links (LinkedIn, Instagram, 14px gray, darken on hover) + a language-mirror link ("English site" → en.dc.html) on the other. Below that row, centered copyright line (12px, light gray).

## Interactions & Behavior
- **Hover** any menu item → number circle grows/fills, label goes bold, image-reveal zone (if no panel open) shows that item's photo with a spring-in scale+rotate.
- **Click** a menu item → opens that item's content panel (replaces the image zone), narrows the menu column. Does not navigate away from index.dc.html.
- **Click** the name/logo (in either header state) → returns to the homepage default state (clears active panel).
- Full navigation to a dedicated page happens via the panel's CTA link (or directly via writing.dc.html, about.dc.html, contact.dc.html).
- No loading/error/empty states — this is a static content site; the Contact page has a form UI but no submit handler wired.
- Not designed responsive/mobile yet — current layout assumes a wide viewport (row layout, padding: … 6vw); needs a mobile breakpoint (stacked menu + image, or a different interaction pattern) before shipping.

## State Management
- activeKey (string|null): which menu topic's panel is open. null = homepage default state.
- hoverKey (string|null): which topic is currently hovered (drives the image-reveal + number circle fill when no panel is open).
- revealPhase ('gray'|'color') + a generation counter: drives the grayscale→color fade on hover. See the fidelity note above — treat this as a rough intent, not a pattern to port as-is.
- Tweakable props (via the prototype's tweak panel, not necessarily needed in the final app): accentColor (drives the active number-circle fill, eyebrow text, CTA link color), grayscaleHover (on/off toggle for the grayscale-fade effect).

## Design Tokens
**Colors:**
- Background: oklch(0.985 0 0) (near-white)
- Primary text: oklch(0.32 0 0)
- Body/paragraph text: oklch(0.4 0 0) / oklch(0.45 0 0)
- Muted/secondary text: oklch(0.5 0 0) / oklch(0.55 0 0) / oklch(0.65 0 0)
- Accent (links, active circle, eyebrows, CTAs): oklch(0.42 0.01 260), hover-darkens to oklch(0.3 0.01 260)
- Panel background: oklch(0.96 0.003 260)
- Borders: oklch(0.9 0 0)

**Typography:**
- Rubik (weights 200/300/400/500/600/700) — homepage name, menu, panel titles.
- David Libre (weights 400/500/700, serif) — content page headings.
- Heebo (weights 300–700) — content page body text, footer.
- Scale in use: 14px (small links/eyebrows), 15–17px (body/buttons), 22–28px (subheads/panel titles), 34–64px (name/hero, responsive via clamp()).

**Spacing:** page gutters 6vw; section padding generally 40–100px vertical; gaps of 18/22/24/28/48px between grouped elements.

**Border radius:** 4–6px on cards/panels/inputs.

**Shadows:** none in the current build (the image-reveal previously had a drop shadow; it was intentionally removed).

## Assets
- assets/menu-thumb-about.png — About hover image (portrait/headshot).
- assets/menu-thumb-blog.jpg — Blog hover image (cherry-blossom petals on a curb, Berlin street photo).
- assets/menu-thumb-meditation.png — Meditation hover image (Buddha statue, cropped from the bottom to keep the head visible).
- assets/menu-thumb-support.jpg — Support hover image (rose petals on gravel).
- assets/menu-thumb-placeholder.png — used for הגירה and ניהול מוצר; needs real photos before launch.
All images are casual/personal photography (not stock) — keep that tone for any replacements.

## Screenshots
- screenshot-homepage-default.png — state 1 (no menu item active)
- screenshot-homepage-active.png — state 2 (אודות panel open)
- screenshot-content-page.png — state 3 (About content page)

## Files
- index.dc.html — Homepage (covers states 1 and 2 above).
- about.dc.html — Content page template (also representative of writing.dc.html / writing-post.dc.html / contact.dc.html, included for reference).
- writing.dc.html, writing-post.dc.html, contact.dc.html — other content pages using the same shell.
- Footer.dc.html — shared footer, imported by every page.
- en.dc.html — English mirror of the site (separate, simpler multi-section layout — not part of the menu-concept redesign; may need to be redesigned to match once the Hebrew homepage direction is finalized).
- assets/ — images referenced above.

These .dc.html files render directly in a browser; open index.dc.html to see the live prototype.
