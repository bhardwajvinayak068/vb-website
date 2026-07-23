# Nav + Footer — Design Spec

Date: 2026-07-23
Scope: Site nav and footer, plus giving the hero's existing CTA a real destination. Second build pass, following the hero section (see [2026-07-23-hero-section-design.md](2026-07-23-hero-section-design.md)).

## 1. Purpose

The hero currently reads as a floating fragment — no nav, no footer, and its "Start a project" CTA has no destination (flagged in the hero's final review). This pass makes the page feel like a real, contactable site: a minimal nav per the original brief's "wordmark/monogram left, 2-3 text links right, no button clutter" rule, a footer carrying real contact channels, and a working CTA.

## 2. Real contact data (confirmed with the user — do not invent alternates)

- Email: `bhardwajvinayak068@gmail.com`
- WhatsApp: `+60182302045` → link as `https://wa.me/60182302045` (digits only, no `+`, no spaces)
- Instagram: `https://www.instagram.com/vinayak_ai_tech?igsh=bnJjNWo0dGFyaXN5`

## 3. Nav

- Layout: static (non-sticky) top bar, full width, thin `border-b border-steel-line`, `bg-slate-base`.
- Left: "VB" monogram — display font (Space Grotesk 700), caps, small amber accent (e.g. a thin amber underline or dot, consistent with the bento cards' accent-underline language). Not a full logo mark — text monogram only.
- Right: two text links, mono caps per the nav's quiet/data-adjacent register: `SERVICES` (anchor to `#services`, the bento grid section) and `CONTACT` (anchor to `#contact`, the footer). Smooth-scroll on click.
- No button in the nav — the spec's "no button clutter" rule holds; the one CTA stays in the hero.

## 4. Footer

- `id="contact"` (this is the nav's Contact anchor target).
- Sits directly below the hero. Thin top border (`border-t border-steel-line`) mirrors the nav's bottom border — visual bookend for the page.
- Content, top to bottom (or left-to-right on desktop, stacked on mobile):
  - Three contact links, mono caps, quiet color (`text-text-mid`, hover `text-text-hi`):
    - `EMAIL` → `mailto:bhardwajvinayak068@gmail.com`
    - `WHATSAPP` → `https://wa.me/60182302045`
    - `INSTAGRAM` → `https://www.instagram.com/vinayak_ai_tech?igsh=bnJjNWo0dGFyaXN5`
  - Closing line: "Based in Kuala Lumpur." — quiet, same weight/tone as the hero's safety footnote (`text-text-low`, small, mono caps).
  - Copyright line: "© 2026 VB. All rights reserved."
- No fabricated claims, no stats — plain contact + closing line only, consistent with the hero's honesty constraint.

## 5. CTA fix

`components/hero/Headline.tsx`'s "Start a project" `<Button>` is replaced with an anchor styled identically via the already-exported `buttonVariants` from `components/ui/button.tsx`:

```tsx
<a href="mailto:bhardwajvinayak068@gmail.com" className={buttonVariants({ variant: 'primary' })}>
  Start a project
</a>
```

No change to `Button`'s own API — this reuses the existing `cva` variant function so the visual stays byte-identical to today's rendered button.

## 6. Component breakdown

```
components/
  layout/
    Nav.tsx        (wordmark + SERVICES/CONTACT anchor links)
    Footer.tsx     (contact links + closing line + copyright, id="contact")
app/
  page.tsx         (renders Nav above the existing hero motion.div, Footer below it;
                    adds id="services" to the BentoStack's wrapping element so the
                    nav's Services link has a real target)
components/hero/
  Headline.tsx     (CTA button -> mailto anchor via buttonVariants)
```

## 7. Explicitly out of scope (this pass)

- Sticky/scroll-shrink nav behavior — static bar only.
- Mobile hamburger menu — at only two links, both stay visible at all widths; revisit if the nav grows.
- Social icons (SVG icon marks) — text labels only this pass, consistent with the site's current icon-free, typography-led language.
- Any additional footer content (sitemap, legal pages, newsletter signup) — not needed yet.

## 8. Verification plan

Same standard as the hero: run the dev server, check rendered output in the browser (desktop + mobile), confirm both nav links smooth-scroll to their real targets, confirm all three footer links and the hero CTA open/behave correctly (mailto opens a compose window, wa.me and Instagram links have correct hrefs), and check for console errors — not just passing unit tests.
