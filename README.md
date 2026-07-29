# VB — Growth, Engineered.

Single-page static site for Vinayak Bhardwaj's AI-driven growth agency.
Built from `build-brief.md` (content, palette, interaction spec) and
`claude-code-prompt.md` (execution rules).

## Stack

Plain HTML/CSS/JS. No build step, no framework, no backend. Deploy the repo
root to Vercel (or any static host) as-is.

The only dependency is [anime.js](https://animejs.com) v4, vendored at
`js/vendor/anime.esm.min.js` and used solely for the service-card
expand-on-hover reflow (`createLayout`). It is dynamically imported and only
fetched once the services grid is approached, so it stays off the critical path.

## Local preview

```bash
python3 -m http.server 8899
```

Then open <http://localhost:8899>.

## Layout

```
index.html            all markup, one page
css/style.css         tokens + every style; palette lives in :root
js/main.js            all interactions, one self-contained module per effect
js/vendor/            anime.js v4 (ESM bundle)
fonts/                Space Grotesk woff2 (self-hosted, variable, latin + latin-ext)
assets/images/        compressed, web-ready assets — the ones the site loads
assets/_originals/    untouched source images (gitignored, ~65 MB)
tools/og-source.html  source page for the OG share image (noindex, not linked)
```

### Assets

Everything under `assets/images/` is generated from `assets/_originals/images/`.
Originals were 65 MB; the shipped set is ~2.6 MB. To re-compress after replacing
a source file, the transforms used were:

| Asset | Transform |
| --- | --- |
| service icons | `cwebp -q 78 -resize 256 0` |
| hero pair | `cwebp -q 82 -resize {1200,800} 0` |
| `bg-texture` | `cwebp -q 72 -resize 1400 0` |
| `cta-glow` | `cwebp -q 62 -resize 1280 0` |
| wedding shots | `cwebp -q 80 -resize 1000 0` |
| `cta-glow.mp4` | `ffmpeg -vf scale=1280:-2 -c:v libx264 -crf 31 -preset slow -an -movflags +faststart` |

The service icons are neon artwork on an **opaque black** square, so they are
composited with `mix-blend-mode: screen` to drop the black onto the glass cards.

## Swapping the favicon

The favicons are temporary, cropped from `logo.png`. Replace these three files
and nothing else changes:

```
assets/images/favicon-32.png
assets/images/favicon-180.png
assets/images/favicon-512.png
```

## Regenerating the OG image

Edit `tools/og-source.html`, then screenshot it at exactly 1200×630 and save to
`assets/images/og-image.png`.

## Motion

Every effect is off by default for people who ask for less:

- `prefers-reduced-motion: reduce` disables the cursor trail, the CTA video
  loop (the static poster still shows), scroll reveals, and all movement.
  Colour and opacity cues remain.
- Touch devices get the cursor trail removed entirely and real tap equivalents
  for the hero reveal (tap, plus a one-time auto-hint) and the footer social
  cards (always-visible labels).
- The card expand-on-hover and tilt only run on `(hover: hover) and
  (pointer: fine)` at ≥1001px.

anime.js owns `transform` on the service cards during the layout reflow, so the
cursor tilt deliberately uses the independent `rotate` property — the two
compose instead of overwriting each other.

The hero reveal masks the **cyborg** layer in, rather than punching the portrait
out. A zero-radius `radial-gradient` is engine-dependent (Chrome paints the last
stop, Safari paints it transparent), so masking the base portrait meant Safari
showed the cyborg by default. `opacity` on the cyborg is a second, independent
guard: if `mask-image` fails entirely, the portrait still wins.

There is no nav bar. The header is a fully transparent fixed layer holding two
floating elements: the wordmark and a single toggle button. The nav collapses to
that button at **every** width, not just mobile, and the links live in a glass
panel that opens from it. That is what lets the header stay pinned — an
always-visible strip of link text measured 2.4:1 over the light wedding
screenshots, but a button carries its own glass background, so nothing is ever
reading against the page behind it.

The hero portrait uses `object-fit: cover` with `object-position: 50% 0%` — top
anchored, so it fills the frame at full scale and any excess is trimmed off the
**bottom**. The head and shoulders are never cut.

Glass surfaces depend on the `.ambient` glow layers behind them. `backdrop-filter`
over flat `#0A0A0A` returns flat `#0A0A0A` — a grey tile. The out-of-focus glows
plus `saturate()` in `--glass-blur` are what make the panes read as glass.

## Content rules

Set by the brief, do not undo without asking:

- No testimonials section — none exist yet.
- The wedding site's live URL is never linked; screenshots only.
- No invented services, pricing, stats, or contact methods.
