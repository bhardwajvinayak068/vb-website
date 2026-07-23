# Nav + Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal nav and a footer with real contact channels to the existing hero page, and give the hero's "Start a project" CTA a working destination.

**Architecture:** Two new small components (`Nav`, `Footer`) rendered around the existing `Home` page's hero content, plus a one-line edit to `Headline.tsx` swapping its dead `<Button>` for a `mailto:` anchor styled via the already-exported `buttonVariants`. No new component library or state — this is static content plus anchor-link navigation.

**Tech Stack:** Same as the hero build — Next.js 14 (App Router, TypeScript), Tailwind, Vitest + React Testing Library. No new dependencies.

## Global Constraints

- Real contact data, use exactly as given, never invent alternates:
  - Email: `bhardwajvinayak068@gmail.com`
  - WhatsApp link: `https://wa.me/60182302045` (digits only, no `+`, no spaces)
  - Instagram: `https://www.instagram.com/vinayak_ai_tech?igsh=bnJjNWo0dGFyaXN5`
- Palette/type rules carried from the hero build: only two accents (amber `#F5A623`, green `#2ECC8F`) anywhere; mono (JetBrains Mono, `font-mono`) reserved for status/data/label elements (nav links, footer links, footer closing line/copyright all qualify — they're short caps labels, not body prose); display font (Space Grotesk 700) for the nav wordmark; body copy (Inter) is not used in nav/footer since neither has prose sentences.
- No fabricated stats or claims anywhere in nav/footer copy.
- Nav has no button — text links only, per the original design brief's "no button clutter" rule. The one CTA button stays in the hero.
- Git: local-only, one commit per task, never add a remote, never push (same policy the hero build ended on).
- No sticky nav, no mobile hamburger menu, no social icon marks — explicitly out of scope this pass (see spec section 7).

---

## File Structure

```
components/
  layout/
    Nav.tsx
    Nav.test.tsx
    Footer.tsx
    Footer.test.tsx
  hero/
    Headline.tsx      (modified: CTA button -> mailto anchor)
    Headline.test.tsx (modified: assert link+href instead of button)
app/
  page.tsx            (modified: render Nav/Footer, add id="services")
  page.test.tsx        (modified: assert Nav/Footer render, #services anchor wiring)
  globals.css          (modified: add smooth-scroll)
```

---

### Task 1: Nav

**Files:**
- Create: `components/layout/Nav.tsx`, `components/layout/Nav.test.tsx`

**Interfaces:**
- Consumes: nothing outside this task.
- Produces: `Nav()` — no props.

- [ ] **Step 1: Write the failing test**

`components/layout/Nav.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders the VB wordmark', () => {
    render(<Nav />)
    expect(screen.getByText('VB')).toBeInTheDocument()
  })

  it('links Services to the #services anchor', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /^services$/i })).toHaveAttribute(
      'href',
      '#services'
    )
  })

  it('links Contact to the #contact anchor', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /^contact$/i })).toHaveAttribute(
      'href',
      '#contact'
    )
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/layout/Nav.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/layout/Nav.tsx`**

```tsx
export function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-steel-line bg-slate-base px-6 py-5 md:px-16">
      <div>
        <span className="font-display text-lg uppercase tracking-wide text-text-hi">
          VB
        </span>
        <div className="mt-1 h-0.5 w-6 rounded-full bg-safety-amber" />
      </div>
      <div className="flex gap-6 font-mono text-xs uppercase tracking-wide text-text-mid">
        <a href="#services" className="transition-colors hover:text-text-hi">
          Services
        </a>
        <a href="#contact" className="transition-colors hover:text-text-hi">
          Contact
        </a>
      </div>
    </nav>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/layout/Nav.test.tsx
```
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Nav.tsx components/layout/Nav.test.tsx
git commit -m "feat: add Nav component"
```

---

### Task 2: Footer

**Files:**
- Create: `components/layout/Footer.tsx`, `components/layout/Footer.test.tsx`

**Interfaces:**
- Consumes: nothing outside this task.
- Produces: `Footer()` — no props. Renders an element with `id="contact"` (the nav's Contact anchor target).

- [ ] **Step 1: Write the failing test**

`components/layout/Footer.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('has id="contact" as the nav anchor target', () => {
    const { container } = render(<Footer />)
    expect(container.querySelector('#contact')).not.toBeNull()
  })

  it('links Email to the correct mailto address', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
      'href',
      'mailto:bhardwajvinayak068@gmail.com'
    )
  })

  it('links WhatsApp to the correct wa.me URL', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /whatsapp/i })).toHaveAttribute(
      'href',
      'https://wa.me/60182302045'
    )
  })

  it('links Instagram to the correct profile URL', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute(
      'href',
      'https://www.instagram.com/vinayak_ai_tech?igsh=bnJjNWo0dGFyaXN5'
    )
  })

  it('renders the closing line and copyright', () => {
    render(<Footer />)
    expect(screen.getByText('Based in Kuala Lumpur.')).toBeInTheDocument()
    expect(
      screen.getByText('© 2026 VB. All rights reserved.')
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/layout/Footer.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/layout/Footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-steel-line bg-slate-base px-6 py-10 md:px-16"
    >
      <div className="flex flex-col gap-4 font-mono text-xs uppercase tracking-wide text-text-mid md:flex-row md:gap-8">
        <a
          href="mailto:bhardwajvinayak068@gmail.com"
          className="transition-colors hover:text-text-hi"
        >
          Email
        </a>
        <a
          href="https://wa.me/60182302045"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-text-hi"
        >
          WhatsApp
        </a>
        <a
          href="https://www.instagram.com/vinayak_ai_tech?igsh=bnJjNWo0dGFyaXN5"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-text-hi"
        >
          Instagram
        </a>
      </div>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-wide text-text-low">
        Based in Kuala Lumpur.
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-text-low">
        © 2026 VB. All rights reserved.
      </p>
    </footer>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/layout/Footer.test.tsx
```
Expected: PASS — 5 tests passed.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.tsx components/layout/Footer.test.tsx
git commit -m "feat: add Footer component with real contact links"
```

---

### Task 3: Headline CTA fix (button -> mailto anchor)

**Files:**
- Modify: `components/hero/Headline.tsx`, `components/hero/Headline.test.tsx`

**Interfaces:**
- Consumes: `buttonVariants` from `@/components/ui/button` (already exported), `cn` from `@/lib/utils` (already exists).
- Produces: `Headline()` — no props (unchanged signature). The CTA is now an `<a>`, not a `<button>`.

- [ ] **Step 1: Update the test to expect a link, not a button**

Replace the full contents of `components/hero/Headline.test.tsx` with:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Headline } from './Headline'

describe('Headline', () => {
  it('renders the headline, sub-line, and a brief safety footnote', () => {
    render(<Headline />)
    expect(
      screen.getByRole('heading', {
        name: /websites and ai systems built for local business growth/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/short-form content/i)).toBeInTheDocument()
    expect(
      screen.getByText(/10\+ years on high-rise safety-critical sites/i)
    ).toBeInTheDocument()
  })

  it('CTA links to a real mailto address', () => {
    render(<Headline />)
    expect(
      screen.getByRole('link', { name: /start a project/i })
    ).toHaveAttribute('href', 'mailto:bhardwajvinayak068@gmail.com')
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/hero/Headline.test.tsx
```
Expected: FAIL — `getByRole('link', { name: /start a project/i })` finds nothing (current markup is a `<button>`).

- [ ] **Step 3: Update `components/hero/Headline.tsx`**

Replace the full file contents with:

```tsx
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Headline() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-5xl uppercase leading-[1.05] tracking-tight text-text-hi md:text-6xl">
        Websites and AI systems built for local business growth
      </h1>
      <p className="mt-5 text-base text-text-mid">
        Sites, social ads, short-form content, and automation — built and run
        for local businesses that want more calls, more DMs, and less manual
        work.
      </p>
      <a
        href="mailto:bhardwajvinayak068@gmail.com"
        className={cn('mt-8', buttonVariants({ variant: 'primary' }))}
      >
        Start a project
      </a>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-wide text-text-low">
        10+ years on high-rise safety-critical sites
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/hero/Headline.test.tsx
```
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Commit**

```bash
git add components/hero/Headline.tsx components/hero/Headline.test.tsx
git commit -m "fix: give the hero CTA a real mailto destination"
```

---

### Task 4: Wire Nav + Footer into the page, add smooth-scroll and the #services anchor

**Files:**
- Modify: `app/page.tsx`, `app/page.test.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: `Nav` from `@/components/layout/Nav`, `Footer` from `@/components/layout/Footer` (both from Tasks 1-2).
- Produces: `Home()` unchanged signature; the rendered tree now includes `Nav`, the hero `main`, and `Footer`, with the bento/floating-card column carrying `id="services"`.

- [ ] **Step 1: Update the test**

Replace the full contents of `app/page.test.tsx` with:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/supportsWebGL', () => ({
  supportsWebGL: () => false,
}))

import Home from './page'

describe('Home', () => {
  it('composes the full hero: status pill, headline, bento cards, floating card', () => {
    render(<Home />)
    expect(
      screen.getByText('KL, MY | AVAILABLE FOR NEW PROJECTS')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /websites and ai systems built for local business growth/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText('Web Design')).toBeInTheDocument()
    expect(screen.getByText('AI Systems')).toBeInTheDocument()
    expect(
      screen.getByText('EN / MY / ZH / TA — MULTILINGUAL ON SITE')
    ).toBeInTheDocument()
  })

  it('renders Nav and Footer around the hero', () => {
    render(<Home />)
    expect(screen.getByText('VB')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /whatsapp/i })).toHaveAttribute(
      'href',
      'https://wa.me/60182302045'
    )
  })

  it('gives the Services nav link a real #services anchor target', () => {
    const { container } = render(<Home />)
    expect(
      screen.getByRole('link', { name: /^services$/i })
    ).toHaveAttribute('href', '#services')
    expect(container.querySelector('#services')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run app/page.test.tsx
```
Expected: FAIL — `Nav`/`Footer` not rendered yet, no `#services` element.

- [ ] **Step 3: Update `app/page.tsx`**

Replace the full file contents with:

```tsx
'use client'

import { motion } from 'framer-motion'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { StatusPill } from '@/components/hero/StatusPill'
import { Headline } from '@/components/hero/Headline'
import { HeroScene } from '@/components/hero/HeroScene'
import { BentoStack } from '@/components/hero/BentoStack'
import { FloatingCard } from '@/components/hero/FloatingCard'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative min-h-screen overflow-hidden bg-slate-base px-6 py-16 md:px-16 md:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-16 md:grid-cols-[60fr_40fr]"
        >
          <div className="relative flex flex-col justify-center gap-8">
            <motion.div variants={item}>
              <StatusPill
                location="KL, MY"
                label="AVAILABLE FOR NEW PROJECTS"
              />
            </motion.div>
            <motion.div variants={item}>
              <Headline />
            </motion.div>
            <motion.div variants={item} className="h-72 md:h-96">
              <HeroScene />
            </motion.div>
          </div>
          <motion.div
            id="services"
            variants={item}
            className="relative self-start pb-10"
          >
            <BentoStack />
            <FloatingCard />
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Add smooth-scroll to `app/globals.css`**

Replace the full file contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 5: Run the test to confirm it passes**

```bash
npx vitest run app/page.test.tsx
```
Expected: PASS — 3 tests passed.

- [ ] **Step 6: Run the full suite**

```bash
npx vitest run
```
Expected: PASS — all tests across the hero build plus this task's new/modified tests.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx app/page.test.tsx app/globals.css
git commit -m "feat: wire Nav/Footer into the page, add #services anchor and smooth-scroll"
```

---

### Task 5: Manual browser verification

Automated tests confirm hrefs and rendered content; they don't confirm real click-to-scroll behavior, external-link behavior, or that nothing regressed visually. Required before this pass counts as done.

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server and open the page**

```bash
npm run dev
```
Open `http://localhost:3000`. Confirm the Nav bar renders above the hero (VB wordmark left, Services/Contact links right, thin bottom border) and the Footer renders below the hero (three contact links, closing line, copyright, thin top border).

- [ ] **Step 2: Check nav anchor behavior**

Click "Services" — confirm the page smooth-scrolls so the bento grid is in view. Click "Contact" — confirm it smooth-scrolls to the footer.

- [ ] **Step 3: Check link correctness**

Inspect (via browser dev tools or a DOM query) that: the footer's Email link is `mailto:bhardwajvinayak068@gmail.com`, WhatsApp is `https://wa.me/60182302045`, Instagram is the given profile URL, and the hero's "Start a project" is `mailto:bhardwajvinayak068@gmail.com`. Do not actually complete a WhatsApp/Instagram navigation away from the page — checking the `href` attribute is sufficient.

- [ ] **Step 4: Check the CTA still looks like a button**

Confirm "Start a project" is visually unchanged from before (amber fill, same size/position) now that it's an anchor instead of a `<button>`.

- [ ] **Step 5: Check mobile viewport**

Resize to ~375px wide. Confirm the nav's two links and wordmark don't wrap awkwardly, and the footer's three links stack cleanly without horizontal overflow.

- [ ] **Step 6: Check the browser console**

Confirm no errors or React warnings during load, anchor clicks, or hover.

- [ ] **Step 7: Stop the dev server** once verification is complete.

---

## Self-Review Notes

- **Spec coverage:** real contact data used verbatim (Task 2), nav wordmark/2-links/no-button (Task 1), footer contact links + closing line + copyright (Task 2), CTA fix via existing `buttonVariants` (Task 3), page wiring + `#services` anchor + smooth-scroll (Task 4), manual verification of click-to-scroll and external links (Task 5). All spec sections covered.
- **No placeholders:** every step has complete code or an exact command with expected output.
- **Type consistency:** `Nav()` and `Footer()` both take no props, matching how Task 4 renders them (`<Nav />`, `<Footer />`). `Headline()`'s signature is unchanged, so no caller elsewhere needs updating beyond its own test.
