# Hero Section — Design Spec

Date: 2026-07-23
Scope: Hero section only (first build pass of a larger portfolio site). Full design-system context lives in the original brief (industrial/AI-infrastructure aesthetic); this spec narrows that down to a buildable, honest-content hero.

## 1. Purpose

Win local-business clients for: website creation, UGC ads, social media ads, short-form content, graphic design, copywriting, and agentic AI systems. Copy and card priority are written for a local business owner, not a general audience. Past construction/site-supervisor experience is present only as a brief credibility footnote — never the headline focus.

## 2. Stack

- Next.js 14 (App Router), TypeScript
- Tailwind CSS, theme extended with the palette/type tokens below
- React Three Fiber + drei (3D centerpiece)
- Framer Motion (hover tilt, staggered entrance)
- shadcn/ui (Button and nav primitives only — minimal surface for this pass)

Chosen over a Vite SPA because the site continues past the hero into a full multi-section site later; Next.js is the final-shape foundation (routing, image/font optimization), avoiding a rebuild.

## 3. Visual system (carried from original brief)

**Palette**

| Name | Hex | Usage |
|---|---|---|
| Slate base | `#0B1220` | Page background |
| Concrete | `#1A2333` | Card/panel surfaces |
| Concrete deep | `#141C29` | Card gradient shadow end |
| Steel line | `rgba(255,255,255,0.06)` | Blueprint grid overlay |
| Safety amber | `#F5A623` | Primary CTA, half the bento cards |
| Terminal green | `#2ECC8F` | Live/system status, other half of bento cards |
| Frost | `rgba(255,255,255,0.08)` | Glass panel fill |
| Text hi | `#E9EEF5` | Headlines |
| Text mid | `#8B98AC` | Body copy |
| Text low | `#4C5A70` | Captions, labels |

Two accents only (amber, green). No third accent.

**Typography**

- Display: heavy condensed grotesk, caps, tight tracking (Space Grotesk 700 or Archivo Black)
- Body: Inter or Plus Jakarta Sans, regular weight
- Data/mono: JetBrains Mono or Fira Code — reserved strictly for status pill, terminal card lines, stat/caption labels

## 4. Layout

Asymmetric split, not centered.

- **Left (~60%)**: status pill → display headline → sub-line pitching the six services → primary CTA.
- **Right (~40%)**: 2×2 bento grid, offset so it visually continues past the fold.
- **Center/background**: R3F 3D scene (centerpiece + loose primitives) sits behind/among the left column as atmosphere and focal point, with one blueprint-style annotation label.
- **Floating card**: glass panel, slight rotation (~-3deg), overlaps the bottom edge of the bento grid, breaking the grid intentionally (only place overlap is allowed).

## 5. Component breakdown

```
app/
  layout.tsx        (fonts, theme, metadata)
  page.tsx          (renders Hero only, this pass)
components/
  hero/
    StatusPill.tsx
    Headline.tsx
    HeroScene.tsx      (R3F canvas)
    BentoStack.tsx     (2x2 grid container)
    BentoCard.tsx       (shared card: accent underline, icon/visual, headline, caption)
    FloatingCard.tsx    (qualitative proof card)
  ui/                   (shadcn primitives: Button, nav link)
lib/
  tokens.ts             (palette/type constants mirrored into tailwind.config.ts)
```

## 6. Copy

**Status pill**: `KL, MY | AVAILABLE FOR NEW PROJECTS` — pulsing green dot. (Not "AI SYSTEMS: DEPLOYED" — no live system to claim yet.)

**Headline** (draft, open to iteration): "WEBSITES AND AI SYSTEMS BUILT FOR LOCAL BUSINESS GROWTH" — leads with web design + AI automation, not construction background.

**Sub-line**: one sentence covering the six services in plain language for a local business owner (sites, ads, content, automation) — final copy written at implementation time.

**Bento cards** (all four, 2×2):
1. **Web Design** (amber underline) — "sites that turn visitors into calls/DMs" framing, caption styled as `VIEW APPROACH →` (no case studies yet, so no fabricated stat).
2. **AI Systems / Automation** (green underline) — terminal-style card cycling real, specific process-name strings (doc generation, chat/automation flows actually built) at 2-3s interval. No generic "Loading..." text.
3. **Social Media / UGC Ads** (amber underline) — short-form + UGC ad production pitch.
4. **Graphic Design + Copywriting** (green underline) — combined creative-services card.

**Floating card**: qualitative only, no invented numbers (e.g. multilingual badge: `EN / MY / ZH / TA`, or a turnaround-time claim) — per explicit decision not to use placeholder stats.

**Safety/experience footnote**: single low-emphasis line (e.g. "10+ years on high-rise safety-critical sites"), placed small in hero corner or nav area — not a card, not a headline driver.

## 7. 3D scene (R3F)

Single `Canvas`, one shared lighting rig (soft key + rim light) so every object reads as one material family.

- **Centerpiece**: `RoundedBox` (drei), `MeshStandardMaterial` (low roughness, metalness ~0.7) + drei `Environment` preset for reflections. Idle motion: slow `rotation.y` drift + gentle vertical float via `useFrame` sine wave. Photoreal hard-hat/scroll renders from the original brief are out of scope here — they need real 3D production tooling (Blender/Spline) not available in this environment; flagged as a later follow-up rather than faked with primitives.
- **Loose primitives**: 4-6 small dark-matte `Box`/`Icosahedron` meshes at varying depth/opacity, slow independent rotation, atmosphere only.
- **Annotation**: one drei `Html`-anchored blueprint-style leader-line + caption pointing at the centerpiece. Single label only.
- **Fallback**: WebGL feature-detect; falls back to a static gradient panel image so the hero never breaks.

## 8. Motion (Framer Motion)

- Bento cards: `whileHover` mouse-driven perspective tilt (rotateX/Y ~4-6deg), spring transition, slight scale.
- AI Systems terminal card: mono lines cycle in/out every 2-3s.
- Floating card: static rotation, no scroll-reveal needed (no content below the fold in this pass).
- Page load: status pill → headline → 3D scene fade/rise in, staggered ~80ms apart — one orchestrated entrance, restrained elsewhere.

## 9. Explicitly out of scope (this pass)

- Any section below the hero (bento-grid-of-services page, case studies, footer, etc.)
- Photoreal hard-hat / scroll 3D renders (needs external 3D tooling)
- Any fabricated stats/numbers — none exist yet for this venture
- Publishing to a remote / pushing anywhere — git itself was initialized local-only partway through the build (see the plan's Global Constraints) so subagent-driven review could diff each task; history stays local until the user finalizes it

## 10. Verification plan

Run the Next.js dev server and check the actual rendered page (desktop + mobile viewport) before calling the hero done: layout correctness, bento hover-tilt behavior, 3D idle animation, WebGL-unavailable fallback path. Compiling/type-checking alone does not verify this — it's a visual product.
