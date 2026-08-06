# VB — Growth, Engineered.

Single-page static site for Vinayak Bhardwaj's AI-driven growth agency.

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

Glass surfaces depend on the `.ambient` layers behind them: a soft far glow, a
tilted circuit grid, and a handful of near "nodes". Under a fine pointer they
parallax at different rates as the cursor moves within that section — nearer
layers shift more — and the node closest to the cursor brightens. Everything
defaults to a static 0 offset, so with the module gated off (touch, reduced
motion) the layers still render correctly, just still.

There is no separate page-wide texture image any more — the tilted CSS grid
inside `.ambient` already covers that job in Services/About/Work, and having
both the static image and the animated grid stacked was genuine redundancy,
not two things doing different jobs.

The cursor trail is one continuous SVG stroke (a quadratic-smoothed curve
through the same eased point chain used before), not a row of dots. A
`linearGradient` whose `x1/y1/x2/y2` are re-pointed at the tail and head every
frame fades it from transparent to bright along whatever direction it's
actually travelling — that's what makes it read as a light beam instead of a
line of circles.

Glass surfaces depend on the `.ambient` layers behind them. `backdrop-filter`
over flat `#0A0A0A` returns flat `#0A0A0A` — a grey tile. The out-of-focus glows
plus `saturate()` in `--glass-blur` are what make the panes read as glass.

## Content rules

Set by the brief, do not undo without asking:

- No testimonials section — none exist yet.
- The wedding site's live URL is never linked; screenshots only.
- No invented services, pricing, stats, or contact methods.

## Deployment

| | |
| --- | --- |
| Live site | <https://vinayakbhardwaj.com/> |
| Vercel dashboard | <https://vercel.com/me-only10/vb-website> |
| GitHub repo | <https://github.com/bhardwajvinayak068/vb-website> (public) |

**Dashboard access:** log into vercel.com with the account already linked to
the local `vercel` CLI (`vercel whoami`). No separate signup — the project
lives under the `me-only10` team.

**Redeploy after changes:**

```bash
git add -A && git commit -m "..."
git push
```

GitHub auto-deploy-on-push is wired up — `bhardwajvinayak068/vb-website` is
connected under **Settings → Git**, so `git push` alone ships to production.
`vercel --prod --yes` still works as a manual fallback if a deploy needs
retriggering without a new commit.

**`.vercelignore` matters here.** The Vercel CLI does not read `.gitignore`
for upload purposes. Without `.vercelignore` mirroring the same exclusions,
`assets/_originals/` (65 MB of uncompressed source photos) uploads on every
deploy and — because this project has no build step and serves the directory
as-is — becomes genuinely public at `/assets/_originals/...`. This happened on
the first deploy and was caught and fixed before the client saw the link.
Keep any new top-level directory that shouldn't be public in both ignore files.

**Analytics:** Vercel Web Analytics is wired in via the plain-HTML script tag
in `index.html` (`/_vercel/insights/script.js`), not the `@vercel/analytics`
npm package — this site has no bundler, so nothing would consume that
package's `inject()` export. Confirmed live and serving the real script, not a
404 or SPA fallback.

## Open items — needs the client's copy, not another rewrite

`build-brief.md` does not cover four sections that are already built and
live. Each one is marked `DRAFT` in `index.html` (search for that string) so
it's easy to find and swap without hunting:

- **How I Work** (`#process`) — step descriptions are written, not from the
  brief. Step names come from the supplied `process-*.png` filenames.
- **Experience timeline** (inside `#about`) — mirrors the arc already in the
  approved About paragraph. Deliberately asserts no dates, employers, or job
  titles, since none exist anywhere in the brief.
- **Agentic AI Systems card** — first sentence is the brief's approved copy
  verbatim; the appended micro-SaaS sentence and the `Micro-SaaS Builds` tag
  are not.
- **Tools I Use** (`#tools`) is the one exception — every badge is an already-
  approved service tag from `build-brief.md` §3, just regrouped. No invented
  copy there.

None of this is asserting anything false (no dates, no pricing, no fabricated
history), but it was written to fill a gap, not transcribed from an approved
source — flag it to the client before treating it as final.
