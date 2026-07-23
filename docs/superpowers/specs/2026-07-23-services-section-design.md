# Services Section — Design Spec

Date: 2026-07-23
Scope: A full services section below the hero, covering all 7 offerings in depth. Third build pass, following the hero ([2026-07-23-hero-section-design.md](2026-07-23-hero-section-design.md)) and nav/footer ([2026-07-23-nav-footer-design.md](2026-07-23-nav-footer-design.md)).

## 1. Purpose

The hero's bento grid is a compact 4-card teaser (some services combined, e.g. "Graphic Design & Copy"). This section is the real depth: all 7 distinct services, each with a description and concrete deliverable bullets — still no fabricated stats or case studies (those come later, once real project examples exist), just a clear, honest scope of what's delivered.

## 2. Relationship to the hero

The hero's bento grid stays exactly as-is (already built, reviewed, and shipped) — it remains the above-the-fold teaser. This new section is additive, placed below the hero. The nav's existing `Services` link (currently `href="#services"` pointing at the hero's bento column) retargets to this new section instead, since a visitor clicking "Services" expects the full list, not the teaser. The hero's bento column loses its `id="services"`; this section's wrapper takes it.

## 3. Content

Section heading (display font, caps): **"WHAT I DO"** (draft, open to iteration, same as the hero headline's treatment).

Seven service blocks, in this order, each with a one-sentence description and 2-3 deliverable bullets — no invented metrics, no case-study claims:

1. **Website Design** — "Custom-built sites that load fast and turn visitors into calls or messages."
   - Mobile-responsive, fast load times
   - Built to convert — clear CTAs, simple contact/booking flow
   - Ongoing edits after launch, not a one-off handoff

2. **Social Media Ads** — "Paid campaigns run and optimized for local reach, not just impressions."
   - Platform setup (Meta/Instagram/TikTok ads)
   - Audience targeting for local customers
   - Weekly performance check-ins

3. **UGC Ads** — "Authentic, creator-style ad content that doesn't look like an ad."
   - Scripted and directed for real engagement
   - Multiple hooks/variations per concept
   - Ready-to-run formats (9:16, captions included)

4. **Short-Form Content** — "Reels and TikToks built around what actually gets watched, not just posted."
   - Hook-first scripting
   - Edited for retention (pacing, captions, sound)
   - Batched shooting for a consistent posting cadence

5. **Graphic Design** — "Visuals that stay consistent across everything you post."
   - Social templates, menus, posters, basic brand assets
   - Consistent colors/type across all materials
   - Fast turnaround for one-off requests

6. **Copywriting** — "Words that sound like a person, not a template."
   - Website copy, ad captions, product descriptions
   - Matches your actual voice, not generic filler
   - Edited for the platform it's going on

7. **Agentic AI Systems** — "Automation that handles the repetitive parts of running a business."
   - Chatbots for FAQs/bookings/lead capture
   - Document/report generation automation
   - Built around your actual workflow, not a generic template

## 4. Layout

- Section sits directly below the hero's `<main>`, above the `Footer`. `id="services"` on the section's root element.
- Section heading, then a 2-column grid of 7 expanded service cards. 7 items in 2 columns: rows 1-3 hold two cards each (items 1-6), row 4 holds item 7 (Agentic AI Systems) alone — full width or centered, not stretched to look like a mistake.
- Each card: same visual anatomy as the hero's `BentoCard` (accent underline, title, body) but larger/roomier — the description as a normal paragraph, then the 2-3 bullets as an actual list (not comma-joined prose). Accent alternates amber/green down the grid, same two-accent rule as everywhere else on the site.
- Cards are larger than the hero's teaser cards (more vertical padding, given the extra bullet content) but share the same rounded-corner/`bg-concrete` card language — visually related to the hero bento, not a different design system.

## 5. Motion

Scroll-triggered reveal: cards fade/rise in as they enter the viewport, staggered (not simultaneous) — this is the first below-the-fold content on the site, and the original brief calls for exactly this pattern ("scroll-triggered reveal for sections below the fold — cards rise/fade in, staggered, not simultaneous"). Same easing/duration language as the hero's entrance animation (opacity 0→1, y 16→0, ~0.5s), staggered per card via Framer Motion's `whileInView` (not `animate`, since this content starts below the fold and shouldn't animate until scrolled into view).

No hover-tilt on these cards (that's the hero bento's signature interaction; repeating it here would dilute it — these cards are for reading, not a repeated gimmick).

## 6. Explicitly out of scope (this pass)

- Real case studies / project examples for Website Design, Graphic Design, or Copywriting — flagged in the hero spec as needing real work to reference; still not available.
- Pricing information — not decided yet.
- Per-service dedicated pages/links ("Learn more" going anywhere) — this section is descriptive only, no deep-linking into individual service detail pages this pass.

## 7. Verification plan

Same standard as prior passes: run the dev server, check the rendered section in the browser (desktop + mobile), confirm the nav's Services link now scrolls to this section (not the hero bento) and that scroll-triggered stagger reveal fires correctly on scroll, confirm the odd 7th card doesn't look broken/misaligned, and check for console errors.
