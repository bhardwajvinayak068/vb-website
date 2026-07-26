You are building a single-page marketing website for an AI-driven growth agency owned by Vinayak Bhardwaj (brand initials "VB"). Follow this brief exactly — do not improvise on content, copy, colors, or section order. Where a technical implementation detail isn't specified, use your best judgement, but the design decisions below are final and already approved by the client.

Read `build-brief.md` in this same folder first — it contains the full copy, asset filenames, color palette, and interaction specs. Treat it as the source of truth. This prompt tells you how to execute it.

## Tech stack
- Plain HTML/CSS/JS, or React if you think it's cleaner to maintain — your call, but keep it a single deployable static site (this will be hosted on Vercel, no backend/database needed).
- Use `animejs` (via its `createLayout` layout-diffing API) specifically for the service-card expand-on-hover effect — nothing else needs a JS animation library.
- No CMS, no auth, no forms that submit anywhere — all contact actions link out to WhatsApp/Instagram/LinkedIn/email directly.

## Assets
All image/video files are provided in `/assets/images/` using the exact filenames listed in `build-brief.md` section 2. Reference them by those filenames — do not rename or assume different paths. If a file is missing when you start, use a clearly-labeled placeholder box (not a broken image icon) so the layout is still checkable.

## Build order
1. Set up base HTML structure + CSS variables for the color palette (exact hex values are in the brief — do not substitute similar-looking colors).
2. Load Space Grotesk from Google Fonts for all real text.
3. Build the page loader (matrix-digit animation) as a full-screen overlay that fades out after content is ready — don't block real page load behind it artificially, just cover the flash of unstyled content.
4. Build sections in this exact order: Nav → Hero → About → Services → Portfolio/Proof → CTA → Footer. Section content and copy must match `build-brief.md` word-for-word — do not paraphrase or "improve" the copy. Each service card should display its small skill tags (listed in the brief) below the description, styled as compact pill/badge elements, not full-size text. The About section should include the one-line platform-flexibility note (WordPress/Wix) from the brief, kept short and clearly secondary to the main story.
5. Implement interactions per the spec in brief section 7, in this priority order (do the essential ones first, polish ones last if time-constrained):
   - Essential: responsive layout, glassmorphism cards, primary/secondary button styles, footer social hover-cards.
   - Important: hero cursor-reveal effect (with a working mobile fallback — tap to reveal, don't just skip it on mobile), about-section word-scatter hover, site-wide cursor comet-tail trail (chain of fading/shrinking green segments following the cursor, hidden over hero, respects reduced-motion, desktop-only).
   - Nice-to-have if time allows: service-card expand-on-hover via animejs layout, scroll parallax, CTA background video with static image fallback.
6. Wire up all contact links exactly as specified: primary CTA buttons and nav button link to the WhatsApp URL in the brief (with the pre-filled message), footer icons link to WhatsApp/Instagram/LinkedIn respectively.
7. Add favicon links in the `<head>`. Dedicated favicon files aren't ready yet — use `logo.png` as a temporary favicon (crop/resize it as needed to work at small sizes) rather than generating a new one. This should be easy to swap out later once real favicon files are provided — don't hardcode assumptions that make replacing it difficult.
8. Make sure the whole page is fully responsive — mobile, tablet, desktop. Pay particular attention to: the hero text position (bottom-left, must not overlap the portrait's face at any screen size), the 7-card service grid reflowing sensibly on narrow screens, and the footer hover-cards having a sensible mobile equivalent (tap or always-visible label, since hover doesn't exist on touch).

## Hard constraints — do not deviate from these
- Do not add a testimonials section. None exist yet; do not fabricate one or leave an empty placeholder that looks broken — just omit it entirely.
- Do not link the wedding site's live URL anywhere. Only use the provided wedding site screenshot images in the portfolio section.
- Do not invent additional services, pricing, or contact methods beyond what's listed in the brief.
- Do not change the hex color values, font choice, or copy without asking first.
- Keep the primary CTA ("Book a call"/WhatsApp) visually distinct from secondary buttons (more saturated green glass + stronger glow), per the brief — don't make all buttons identical.

## Quality bar (non-negotiable, per client's own reference checklist)
Before considering the build done, explicitly verify each of these — don't skip because they're less visible than the visual design:
- Page load under 2 seconds (compress images and especially `cta-glow.mp4`).
- WCAG AA color contrast on all text (green-on-black and gray-on-black combos included) — verify, don't eyeball.
- Full keyboard navigation for nav, buttons, and footer social links — not mouse-only.
- Semantic HTML: one `<h1>`, logical heading order, `<nav>`/`<main>`/`<footer>` landmarks, alt text on every image.
- Real `<title>`, meta description, and Open Graph tags (share image can be a placeholder if not yet provided).
- Mobile is its own designed layout, not a shrunk desktop — rework hero text placement, service grid stacking, and all hover-only interactions (word-scatter, tilt, cursor trail, footer tooltips) into real touch equivalents.
- Sanity-check the combined motion feel once everything is assembled together (loader + hero reveal + word-scatter + tilt + cursor trail + layout-diffing cards) — if it feels like a lot happening at once rather than restrained, reduce intensity/frequency rather than cutting effects.

## When you're done
Give me a summary of what was implemented exactly as specced vs. any part you had to adapt or simplify (e.g. if the animejs layout effect wasn't feasible in the time available, say so explicitly rather than silently dropping it) — so nothing gets lost between what was planned and what was shipped.
