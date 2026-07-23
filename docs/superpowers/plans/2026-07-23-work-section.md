# Recent Work (Placeholder) Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a structural placeholder section for case studies (Website Design, Graphic Design, Copywriting) with zero fabricated project content — visibly a "pending" state, not content that could be mistaken for a real client project.

**Architecture:** Two new small components (`WorkCard` — static placeholder card, dashed border, no accent underline; `WorkSection` — heading + 3-column grid of 3 `WorkCard`s with the same `whileInView` scroll-reveal pattern as the services section) rendered between `ServicesSection` and `Footer` in `app/page.tsx`. No nav changes this pass.

**Tech Stack:** Same as prior passes — Next.js 14, TypeScript, Tailwind, Framer Motion, Vitest + React Testing Library. No new dependencies. The `IntersectionObserver` stub already added to `vitest.setup.ts` (services-section plan) covers this task's `whileInView` usage too — no further test-setup changes needed.

## Global Constraints

- Zero fabricated content: no invented client names, project details, results, or images anywhere in this section. The only copy allowed is the service name and the literal string "Case study coming soon."
- Visual treatment must read as pending/empty, not as real content: dashed border (`border-dashed`), muted text only (`text-text-low`/`text-text-mid`), no accent-color underline (accents mark real, populated content elsewhere on the site).
- No new interaction: no hover-tilt, no click targets. Same scroll-reveal motion language as the services section, nothing new.
- No `Nav.tsx` changes — this section is deliberately not linked from nav yet (see spec section 6). Do not add a "Work" link.
- Git: local-only, one commit per task, never add a remote, never push.

---

## File Structure

```
components/
  work/
    WorkCard.tsx
    WorkCard.test.tsx
    WorkSection.tsx
    WorkSection.test.tsx
app/
  page.tsx            (modified: render WorkSection between ServicesSection and Footer)
  page.test.tsx        (modified: assert WorkSection renders, #work exists)
```

---

### Task 1: WorkCard

**Files:**
- Create: `components/work/WorkCard.tsx`, `components/work/WorkCard.test.tsx`

**Interfaces:**
- Consumes: nothing outside this task.
- Produces: `WorkCard({ title: string })`.

- [ ] **Step 1: Write the failing test**

`components/work/WorkCard.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkCard } from './WorkCard'

describe('WorkCard', () => {
  it('renders the title and the pending status line', () => {
    render(<WorkCard title="Website Design" />)
    expect(
      screen.getByRole('heading', { name: 'Website Design' })
    ).toBeInTheDocument()
    expect(screen.getByText('Case study coming soon.')).toBeInTheDocument()
  })

  it('uses a dashed border, not the solid card treatment used for real content', () => {
    const { container } = render(<WorkCard title="Website Design" />)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('border-dashed')
  })

  it('has no accent-color underline (not real, populated content)', () => {
    const { container } = render(<WorkCard title="Website Design" />)
    expect(
      container.querySelector('[data-testid="accent-underline"]')
    ).toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/work/WorkCard.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/work/WorkCard.tsx`**

```tsx
interface WorkCardProps {
  title: string
}

export function WorkCard({ title }: WorkCardProps) {
  return (
    <div className="rounded-2xl border border-dashed border-steel-line p-6">
      <h3 className="font-display text-lg uppercase text-text-low">
        {title}
      </h3>
      <p className="mt-3 text-sm text-text-low">Case study coming soon.</p>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/work/WorkCard.test.tsx
```
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add components/work/WorkCard.tsx components/work/WorkCard.test.tsx
git commit -m "feat: add WorkCard placeholder component"
```

---

### Task 2: WorkSection

**Files:**
- Create: `components/work/WorkSection.tsx`, `components/work/WorkSection.test.tsx`

**Interfaces:**
- Consumes: `WorkCard` from `./WorkCard`.
- Produces: `WorkSection()` — no props. Renders a `<section id="work">`.

- [ ] **Step 1: Write the failing test**

`components/work/WorkSection.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkSection } from './WorkSection'

describe('WorkSection', () => {
  it('has id="work"', () => {
    const { container } = render(<WorkSection />)
    expect(container.querySelector('#work')).not.toBeNull()
  })

  it('renders the section heading', () => {
    render(<WorkSection />)
    expect(
      screen.getByRole('heading', { name: /recent work/i, level: 2 })
    ).toBeInTheDocument()
  })

  it('renders one placeholder card per pending case study', () => {
    render(<WorkSection />)
    ;['Website Design', 'Graphic Design', 'Copywriting'].forEach((title) => {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    })
    expect(screen.getAllByText('Case study coming soon.')).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/work/WorkSection.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/work/WorkSection.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { WorkCard } from './WorkCard'

const PENDING_CASE_STUDIES = ['Website Design', 'Graphic Design', 'Copywriting']

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

export function WorkSection() {
  return (
    <section id="work" className="bg-slate-base px-6 py-16 md:px-16 md:py-24">
      <h2 className="font-display text-3xl uppercase tracking-tight text-text-hi md:text-4xl">
        Recent Work
      </h2>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {PENDING_CASE_STUDIES.map((title) => (
          <motion.div key={title} variants={item}>
            <WorkCard title={title} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/work/WorkSection.test.tsx
```
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add components/work/WorkSection.tsx components/work/WorkSection.test.tsx
git commit -m "feat: add WorkSection with 3 pending case-study placeholders"
```

---

### Task 3: Wire WorkSection into the page

**Files:**
- Modify: `app/page.tsx`, `app/page.test.tsx`

**Interfaces:**
- Consumes: `WorkSection` from `@/components/work/WorkSection`.
- Produces: `Home()` unchanged signature. Rendered tree now includes `WorkSection` between `ServicesSection` and `Footer`.

- [ ] **Step 1: Update the test**

Add these two test cases to the existing `describe('Home', ...)` block in `app/page.test.tsx` (append after the existing tests, before the closing `})`):

```tsx
  it('renders the placeholder work section between services and footer', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('#work')).not.toBeNull()
    expect(
      screen.getByRole('heading', { name: /recent work/i })
    ).toBeInTheDocument()
  })

  it('has no fabricated project content in the work section — only pending placeholders', () => {
    render(<Home />)
    expect(screen.getAllByText('Case study coming soon.')).toHaveLength(3)
  })
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run app/page.test.tsx
```
Expected: FAIL — `WorkSection` not rendered yet.

- [ ] **Step 3: Update `app/page.tsx`**

Add the import:
```tsx
import { WorkSection } from '@/components/work/WorkSection'
```

Add `<WorkSection />` between `<ServicesSection />` and `<Footer />`, so the end of the file reads:

```tsx
      </main>
      <ServicesSection />
      <WorkSection />
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run app/page.test.tsx
```
Expected: PASS — 6 tests passed (4 existing + 2 new).

- [ ] **Step 5: Run the full suite**

```bash
npx vitest run
```
Expected: PASS — all tests across every prior task plus this one.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/page.test.tsx
git commit -m "feat: wire WorkSection into the page"
```

---

### Task 4: Manual browser verification

Automated tests confirm content and structure; they don't confirm the placeholder visually reads as "pending" rather than as real content. Required before this pass counts as done.

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server and open the page**

```bash
npm run dev
```
Scroll to the new section (instant `scrollTo` is fine — per prior passes' findings, this tool's smooth-scroll/whileInView *animation* may not visibly complete, which is a known tool limitation, not something to re-investigate here; verify layout via `getBoundingClientRect()` if the animated state is unreadable).

- [ ] **Step 2: Check the placeholder reads as pending, not as real content**

Confirm: dashed borders (visually distinct from the solid `bg-concrete` cards used in the hero bento and services grid), muted text throughout, no accent-color underline anywhere in this section, and the section only shows the three service names plus "Case study coming soon." — nothing else.

- [ ] **Step 3: Check nav is unchanged**

Confirm the nav still shows only "Services" and "Contact" — no "Work" link was added.

- [ ] **Step 4: Check mobile viewport**

Resize to ~375px wide. Confirm the 3-column grid collapses to a single column, no horizontal overflow.

- [ ] **Step 5: Check the browser console**

Confirm no errors or React warnings.

- [ ] **Step 6: Stop the dev server** once verification is complete.

---

## Self-Review Notes

- **Spec coverage:** three placeholder cards for the three services awaiting case studies (Task 1-2), dashed-border/muted/no-accent visual treatment so it can't be mistaken for real content (Task 1), same scroll-reveal motion as services section (Task 2), no nav link added (Task 3 explicitly doesn't touch `Nav.tsx`), manual visual confirmation it reads as pending (Task 4). All covered.
- **No placeholders in the plan itself:** every step has complete code or an exact command with expected output — the *content* itself is intentionally a placeholder (that's the feature), which is different from an unfinished plan step.
- **Type consistency:** `WorkCard({ title: string })` matches how `WorkSection` maps `PENDING_CASE_STUDIES` into it (`<WorkCard title={title} />`).
