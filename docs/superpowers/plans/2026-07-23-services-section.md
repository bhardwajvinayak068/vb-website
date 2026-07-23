# Services Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full services section below the hero covering all 7 offerings in depth (description + deliverable bullets each), with scroll-triggered reveal, and retarget the nav's existing Services link to point at this new section instead of the hero's bento teaser.

**Architecture:** Two new small components (`ServiceCard` — static presentational card, no hover-tilt; `ServicesSection` — heading + 2-column grid of 7 `ServiceCard`s with `whileInView` scroll-reveal) rendered between the existing hero `<main>` and `<Footer>` in `app/page.tsx`. The hero's bento column loses its `id="services"`; the new section's root takes it, so the nav's unchanged `href="#services"` link now lands here.

**Tech Stack:** Same as prior passes — Next.js 14, TypeScript, Tailwind, Framer Motion, Vitest + React Testing Library. No new dependencies. `whileInView` requires `IntersectionObserver`, which jsdom does not implement — this plan adds a minimal stub to `vitest.setup.ts`.

## Global Constraints

- Only two accents anywhere (amber `#F5A623` = `bg-safety-amber`, green `#2ECC8F` = `bg-terminal-green`) — alternate down the 7-card grid, same rule as everywhere else on the site.
- Mono (`font-mono`) reserved for status/data/label content. Service card descriptions and bullets are body prose, not data — they use the default body font (Inter), no `font-mono`, consistent with the hero's final-review decision on bento card copy.
- No fabricated stats, metrics, or case-study claims anywhere in the service copy — deliverable bullets only, exactly as drafted and approved.
- No hover-tilt interaction on `ServiceCard` — that's the hero bento's signature interaction; explicitly not repeated here (spec section 5).
- Scroll reveal uses `whileInView` (not `animate` on mount) since this content starts below the fold — `viewport={{ once: true }}` so it doesn't re-fire on every scroll pass.
- Git: local-only, one commit per task, never add a remote, never push.
- Real content only — the 7 service titles, descriptions, and bullets below are final copy, already reviewed and approved; use them verbatim, don't paraphrase.

---

## File Structure

```
components/
  services/
    ServiceCard.tsx
    ServiceCard.test.tsx
    ServicesSection.tsx
    ServicesSection.test.tsx
app/
  page.tsx            (modified: render ServicesSection, remove id="services" from hero's bento column)
  page.test.tsx        (modified: assert #services now lands on ServicesSection, not the hero bento)
vitest.setup.ts         (modified: add IntersectionObserver stub for whileInView)
```

---

### Task 1: ServiceCard

**Files:**
- Create: `components/services/ServiceCard.tsx`, `components/services/ServiceCard.test.tsx`

**Interfaces:**
- Consumes: nothing outside this task.
- Produces: `ServiceCard({ accent: 'amber' | 'green', title: string, description: string, bullets: string[] })`.

- [ ] **Step 1: Write the failing test**

`components/services/ServiceCard.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServiceCard } from './ServiceCard'

describe('ServiceCard', () => {
  const bullets = ['First bullet', 'Second bullet', 'Third bullet']

  it('renders the title, description, and all bullets', () => {
    render(
      <ServiceCard
        accent="amber"
        title="Website Design"
        description="Custom-built sites that load fast."
        bullets={bullets}
      />
    )
    expect(
      screen.getByRole('heading', { name: 'Website Design' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('Custom-built sites that load fast.')
    ).toBeInTheDocument()
    bullets.forEach((bullet) => {
      expect(screen.getByText(bullet)).toBeInTheDocument()
    })
  })

  it('uses the amber accent underline', () => {
    render(
      <ServiceCard accent="amber" title="X" description="Y" bullets={['Z']} />
    )
    expect(screen.getByTestId('accent-underline')).toHaveClass(
      'bg-safety-amber'
    )
  })

  it('uses the green accent underline', () => {
    render(
      <ServiceCard accent="green" title="X" description="Y" bullets={['Z']} />
    )
    expect(screen.getByTestId('accent-underline')).toHaveClass(
      'bg-terminal-green'
    )
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/services/ServiceCard.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/services/ServiceCard.tsx`**

```tsx
interface ServiceCardProps {
  accent: 'amber' | 'green'
  title: string
  description: string
  bullets: string[]
}

export function ServiceCard({
  accent,
  title,
  description,
  bullets,
}: ServiceCardProps) {
  const accentClass = accent === 'amber' ? 'bg-safety-amber' : 'bg-terminal-green'

  return (
    <div className="h-full rounded-2xl bg-concrete p-6">
      <div
        data-testid="accent-underline"
        className={`mb-4 h-1 w-10 rounded-full ${accentClass}`}
      />
      <h3 className="font-display text-xl uppercase text-text-hi">{title}</h3>
      <p className="mt-3 text-sm text-text-mid">{description}</p>
      <ul className="mt-4 space-y-2">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-sm text-text-mid">
            <span className="text-text-low">—</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/services/ServiceCard.test.tsx
```
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add components/services/ServiceCard.tsx components/services/ServiceCard.test.tsx
git commit -m "feat: add ServiceCard component"
```

---

### Task 2: ServicesSection

**Files:**
- Create: `components/services/ServicesSection.tsx`, `components/services/ServicesSection.test.tsx`
- Modify: `vitest.setup.ts`

**Interfaces:**
- Consumes: `ServiceCard` from `./ServiceCard`.
- Produces: `ServicesSection()` — no props. Renders a `<section id="services">`.

- [ ] **Step 1: Add the IntersectionObserver stub to `vitest.setup.ts`**

Replace the full contents of `vitest.setup.ts` with:

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jsdom doesn't implement IntersectionObserver; framer-motion's whileInView
// needs one present on the global object to avoid throwing under test.
// @ts-expect-error minimal test stub, not a full IntersectionObserver
global.IntersectionObserver = IntersectionObserverStub
```

- [ ] **Step 2: Write the failing test**

`components/services/ServicesSection.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServicesSection } from './ServicesSection'

describe('ServicesSection', () => {
  it('has id="services" as the nav anchor target', () => {
    const { container } = render(<ServicesSection />)
    expect(container.querySelector('#services')).not.toBeNull()
  })

  it('renders the section heading', () => {
    render(<ServicesSection />)
    expect(
      screen.getByRole('heading', { name: /what i do/i, level: 2 })
    ).toBeInTheDocument()
  })

  it('renders all seven service titles', () => {
    render(<ServicesSection />)
    const titles = [
      'Website Design',
      'Social Media Ads',
      'UGC Ads',
      'Short-Form Content',
      'Graphic Design',
      'Copywriting',
      'Agentic AI Systems',
    ]
    titles.forEach((title) => {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 3: Run the test to confirm it fails**

```bash
npx vitest run components/services/ServicesSection.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 4: Write `components/services/ServicesSection.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { ServiceCard } from './ServiceCard'

const SERVICES: Array<{
  accent: 'amber' | 'green'
  title: string
  description: string
  bullets: string[]
}> = [
  {
    accent: 'amber',
    title: 'Website Design',
    description:
      'Custom-built sites that load fast and turn visitors into calls or messages.',
    bullets: [
      'Mobile-responsive, fast load times',
      'Built to convert — clear CTAs, simple contact/booking flow',
      'Ongoing edits after launch, not a one-off handoff',
    ],
  },
  {
    accent: 'green',
    title: 'Social Media Ads',
    description:
      'Paid campaigns run and optimized for local reach, not just impressions.',
    bullets: [
      'Platform setup (Meta/Instagram/TikTok ads)',
      'Audience targeting for local customers',
      'Weekly performance check-ins',
    ],
  },
  {
    accent: 'amber',
    title: 'UGC Ads',
    description:
      "Authentic, creator-style ad content that doesn't look like an ad.",
    bullets: [
      'Scripted and directed for real engagement',
      'Multiple hooks/variations per concept',
      'Ready-to-run formats (9:16, captions included)',
    ],
  },
  {
    accent: 'green',
    title: 'Short-Form Content',
    description:
      'Reels and TikToks built around what actually gets watched, not just posted.',
    bullets: [
      'Hook-first scripting',
      'Edited for retention (pacing, captions, sound)',
      'Batched shooting for a consistent posting cadence',
    ],
  },
  {
    accent: 'amber',
    title: 'Graphic Design',
    description: 'Visuals that stay consistent across everything you post.',
    bullets: [
      'Social templates, menus, posters, basic brand assets',
      'Consistent colors/type across all materials',
      'Fast turnaround for one-off requests',
    ],
  },
  {
    accent: 'green',
    title: 'Copywriting',
    description: "Words that sound like a person, not a template.",
    bullets: [
      'Website copy, ad captions, product descriptions',
      'Matches your actual voice, not generic filler',
      "Edited for the platform it's going on",
    ],
  },
  {
    accent: 'amber',
    title: 'Agentic AI Systems',
    description:
      'Automation that handles the repetitive parts of running a business.',
    bullets: [
      'Chatbots for FAQs/bookings/lead capture',
      'Document/report generation automation',
      'Built around your actual workflow, not a generic template',
    ],
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function ServicesSection() {
  return (
    <section id="services" className="bg-slate-base px-6 py-16 md:px-16 md:py-24">
      <h2 className="font-display text-3xl uppercase tracking-tight text-text-hi md:text-4xl">
        What I Do
      </h2>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {SERVICES.map((service, index) => {
          const isLast = index === SERVICES.length - 1
          return (
            <motion.div
              key={service.title}
              variants={item}
              className={isLast ? 'md:col-span-2' : undefined}
            >
              <ServiceCard {...service} />
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 5: Run the test to confirm it passes**

```bash
npx vitest run components/services/ServicesSection.test.tsx
```
Expected: PASS — 3 tests passed.

- [ ] **Step 6: Commit**

```bash
git add components/services/ServicesSection.tsx components/services/ServicesSection.test.tsx vitest.setup.ts
git commit -m "feat: add ServicesSection with all 7 services and scroll-reveal"
```

---

### Task 3: Wire ServicesSection into the page, retarget the #services anchor

**Files:**
- Modify: `app/page.tsx`, `app/page.test.tsx`

**Interfaces:**
- Consumes: `ServicesSection` from `@/components/services/ServicesSection`.
- Produces: `Home()` unchanged signature. The hero's bento/floating-card column no longer carries `id="services"`; `ServicesSection`'s root `<section>` does instead.

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

  it('gives the Services nav link a real #services anchor target on the new services section', () => {
    const { container } = render(<Home />)
    expect(
      screen.getByRole('link', { name: /^services$/i })
    ).toHaveAttribute('href', '#services')
    const servicesEl = container.querySelector('#services')
    expect(servicesEl).not.toBeNull()
    expect(servicesEl).toHaveTextContent('What I Do')
  })

  it('renders the full services section with all seven services', () => {
    render(<Home />)
    expect(
      screen.getByRole('heading', { name: /what i do/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Agentic AI Systems' })
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run app/page.test.tsx
```
Expected: FAIL — `ServicesSection` not rendered yet; `#services` is still on the hero's bento column, not on an element containing "What I Do".

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
import { ServicesSection } from '@/components/services/ServicesSection'

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
          <motion.div variants={item} className="relative self-start pb-10">
            <BentoStack />
            <FloatingCard />
          </motion.div>
        </motion.div>
      </main>
      <ServicesSection />
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run app/page.test.tsx
```
Expected: PASS — 4 tests passed.

- [ ] **Step 5: Run the full suite**

```bash
npx vitest run
```
Expected: PASS — all tests across every prior task plus this one.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/page.test.tsx
git commit -m "feat: wire ServicesSection into the page, retarget #services anchor"
```

---

### Task 4: Manual browser verification

Automated tests confirm content and anchor wiring; they don't confirm real scroll-reveal behavior or that the odd 7th card looks right. Required before this pass counts as done.

Note: a prior manual-verification pass (nav+footer) found that this project's automated browser testing tool cannot reliably observe `behavior: 'smooth'`-driven scroll animations completing (confirmed via an independent code review to be a tool limitation, not an app defect — `scrollTo`/wheel scroll both work correctly in the same tool). The same limitation likely applies to observing the *animation* of `whileInView` scroll-reveal in that tool. Focus verification on what's actually checkable: content renders correctly, `#services` lands in the right place, the grid layout doesn't look broken, and — if the tool allows it — that cards end up at `opacity: 1` (their resting state) once scrolled into view, using `getComputedStyle` rather than relying on watching the transition itself.

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server and open the page**

```bash
npm run dev
```
Open `http://localhost:3000`.

- [ ] **Step 2: Check the services section renders correctly**

Scroll down (instant scroll is fine) past the hero. Confirm: "WHAT I DO" heading, 7 cards in a 2-column grid, alternating amber/green accents, the 7th card ("Agentic AI Systems") spans the full width on its own row and doesn't look like a layout mistake.

- [ ] **Step 3: Check the nav retarget**

Click "Services" in the nav (or, if click-triggered smooth-scroll isn't observable in the tool per the note above, verify programmatically: confirm `document.querySelector('#services')` is now inside the new section — check its `textContent` includes "What I Do" — rather than the old hero bento column).

- [ ] **Step 4: Check scroll-reveal resting state**

Scroll an card into view (instant scroll acceptable) and check via `getComputedStyle` that its opacity resolves to `1` (not stuck at `0`), confirming `whileInView` did fire even if the transition itself isn't visually confirmable in this tool.

- [ ] **Step 5: Check mobile viewport**

Resize to ~375px wide. Confirm the grid collapses to a single column, no horizontal overflow, bullet text wraps cleanly.

- [ ] **Step 6: Check the browser console**

Confirm no errors or React warnings, particularly none related to `IntersectionObserver` (the jsdom-only stub is test-only; the real browser has a native implementation, so this should be a non-issue, but confirm).

- [ ] **Step 7: Stop the dev server** once verification is complete.

---

## Self-Review Notes

- **Spec coverage:** all 7 services with description + bullets (Task 2, content verbatim from the approved draft), 2-column grid with the 7th card spanning full width (Task 2), no hover-tilt on `ServiceCard` (Task 1 — no `motion.div`/mouse handlers at all in that file), `whileInView` scroll-reveal with `once: true` (Task 2), nav retarget via moving the `id` rather than editing `Nav.tsx` (Task 3), manual verification acknowledging the known scroll-animation tooling limitation (Task 4). All covered.
- **No placeholders:** every step has complete code or an exact command with expected output.
- **Type consistency:** `ServiceCard`'s props (`accent: 'amber' | 'green'`, `title: string`, `description: string`, `bullets: string[]`) match exactly how `ServicesSection` spreads each `SERVICES` entry into it (`<ServiceCard {...service} />`), and match the `SERVICES` array's inline type annotation.
