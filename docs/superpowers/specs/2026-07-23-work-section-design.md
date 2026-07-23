# Recent Work (Placeholder) Section — Design Spec

Date: 2026-07-23
Scope: A structural placeholder section for case studies, with no fabricated project content. Fourth build pass, following the hero, nav/footer, and services section.

## 1. Purpose

Three services (Website Design, Graphic Design, Copywriting) need documented case studies before they can be shown as proof of work — flagged as a follow-up in the hero spec's section 8. No real projects are ready to describe yet. This section exists so the page has an honest placeholder — visibly "not yet filled," never content that could be mistaken for a real client project. No invented client names, fake results, screenshots, or project details anywhere in this pass.

## 2. Content

Section heading (display font, caps): **"RECENT WORK"** (draft, open to iteration).

Three placeholder cards, one per service awaiting a case study:
1. Website Design
2. Graphic Design
3. Copywriting

Each card shows only: the service name, and a quiet status line — **"Case study coming soon."** No other copy. No fabricated client type, no invented outcome, no placeholder image implying a real screenshot.

## 3. Visual treatment (must read as "pending," not as a finished item)

- Dashed border (not the solid `bg-concrete` card treatment used everywhere else on the site) — a deliberate visual signal that this is an empty/pending state, distinct from real content cards (hero bento, services grid).
- Muted text throughout (`text-text-low`/`text-text-mid`), no accent-color underline (accents mark real, populated content elsewhere on the site — a placeholder shouldn't borrow that visual language).
- No hover interaction, no motion beyond the same scroll-reveal treatment as the services section (consistency of page behavior, not a new interaction to learn).

## 4. Layout

- New section between `ServicesSection` and `Footer`. Root element gets `id="work"` (ready for a future nav link, but not linked from `Nav.tsx` this pass — see section 6).
- Heading, then a 3-column grid on desktop (one card per pending case study), collapsing to a single column on mobile.

## 5. Motion

Same `whileInView` scroll-reveal pattern as the services section (fade/rise in, staggered), for page-wide consistency — not a new motion language to introduce.

## 6. Explicitly out of scope (this pass)

- Any real project content (client names, screenshots, results, dates) — none exists yet.
- A "Work" nav link — deliberately not added yet, so nav doesn't point visitors at a section that's currently just placeholders. Add it once real case studies replace these cards.
- Individual case-study detail pages — not needed until real content exists.

## 7. Verification plan

Same standard as prior passes: dev server, check rendered section in browser (desktop + mobile), confirm it visually reads as a placeholder/pending state (not mistakable for real content), confirm no nav link was added, check console errors.
