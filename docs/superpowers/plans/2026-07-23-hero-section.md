# Hero Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the hero section of the portfolio site — asymmetric layout (headline/copy left, 2x2 bento service grid right), an R3F 3D centerpiece, and Framer Motion micro-interactions — as a real, browser-verified Next.js page.

**Architecture:** Next.js 14 App Router page composed of small, independently-testable components (status pill, headline, 3D scene, bento cards, floating card). Design tokens live in one file and drive both Tailwind config and component classes, so palette/type rules can't drift between components.

**Tech Stack:** Next.js 14 (App Router, TypeScript), Tailwind CSS, React Three Fiber + drei, Framer Motion, Vitest + React Testing Library.

## Global Constraints

- Palette is fixed, exact hex values only: slate base `#0B1220`, concrete `#1A2333`, concrete deep `#141C29`, steel line `rgba(255,255,255,0.06)`, safety amber `#F5A623`, terminal green `#2ECC8F`, frost `rgba(255,255,255,0.08)`, text hi `#E9EEF5`, text mid `#8B98AC`, text low `#4C5A70`.
- Two accent colors only (amber, green) — never introduce a third accent.
- Display font: Space Grotesk 700, caps. Body font: Inter. Mono/data font: JetBrains Mono, reserved strictly for status pill / terminal card / captions — never for body copy.
- No fabricated stats or numbers anywhere (confirmed: this is a new venture, no case-study numbers exist yet). Floating card and safety line are qualitative only.
- Safety/construction background gets one short line, low visual weight — never a headline, never a stat card.
- **Git: local-only, per-task commits allowed.** `git init` once at the start of Task 1, then one commit per task (needed for subagent-driven review diffing). Never add a remote, never push, never publish anywhere. History may be squashed/cleaned up by the user at the very end once the hero is finished and reviewed — that finalization step is the user's call, not part of any task here.
- This build covers the hero section only — no sections below the fold, no nav bar, no footer, no photoreal hard-hat/scroll 3D assets (those need external 3D tooling, out of scope here).

---

## File Structure

```
tailwind.config.ts
app/
  layout.tsx
  page.tsx
  globals.css
components/
  ui/
    button.tsx
    button.test.tsx
  hero/
    StatusPill.tsx
    StatusPill.test.tsx
    Headline.tsx
    Headline.test.tsx
    HeroScene.tsx
    HeroScene.test.tsx
    BentoCard.tsx
    BentoCard.test.tsx
    BentoStack.tsx
    BentoStack.test.tsx
    FloatingCard.tsx
    FloatingCard.test.tsx
lib/
  tokens.ts
  tokens.test.ts
  utils.ts
  useCyclingText.ts
  useCyclingText.test.ts
  supportsWebGL.ts
  supportsWebGL.test.ts
vitest.config.mts
vitest.setup.ts
```

---

### Task 1: Project scaffold, design tokens, fonts, test runner

**Files:**
- Create: `tailwind.config.ts`, `lib/tokens.ts`, `lib/tokens.test.ts`, `vitest.config.mts`, `vitest.setup.ts`
- Modify: `app/layout.tsx`, `app/globals.css`, `package.json`

**Interfaces:**
- Produces: `colors` object from `lib/tokens.ts` — keys `slateBase, concrete, concreteDeep, steelLine, safetyAmber, terminalGreen, frost, textHi, textMid, textLow`, all `string` hex/rgba values. Tailwind classes produced: `bg-slate-base`, `bg-concrete`, `bg-concrete-deep`, `border-steel-line`/`bg-steel-line`, `bg-safety-amber`/`text-safety-amber`, `bg-terminal-green`/`text-terminal-green`, `bg-frost`, `text-text-hi`, `text-text-mid`, `text-text-low`. Font classes: `font-display`, `font-body`, `font-mono`.

- [ ] **Step 1: Scaffold the Next.js project**

Run in the project root (`/Volumes/work disk/my stuff/Claude/portfolio website`):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

The directory already contains a `docs/` folder — if the CLI warns the directory isn't empty, continue anyway. If it asks about Turbopack or other new-CLI prompts, accept the default. If `create-next-app` initializes its own `.git` and initial commit, that's fine — leave it as the base commit for this task.

- [ ] **Step 1b: Confirm git is initialized, commit Task 1's work**

```bash
git status
```
If no repository exists yet, run `git init` first. Then stage and commit everything from this task (tokens, tailwind config, layout, globals.css, vitest config) once Step 10 below passes — local commit only, no remote, no push.

- [ ] **Step 2: Install remaining dependencies**

```bash
npm install three @react-three/fiber@^8 @react-three/drei@^9 framer-motion class-variance-authority clsx tailwind-merge
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Write the design tokens file**

`lib/tokens.ts`:
```ts
export const colors = {
  slateBase: '#0B1220',
  concrete: '#1A2333',
  concreteDeep: '#141C29',
  steelLine: 'rgba(255,255,255,0.06)',
  safetyAmber: '#F5A623',
  terminalGreen: '#2ECC8F',
  frost: 'rgba(255,255,255,0.08)',
  textHi: '#E9EEF5',
  textMid: '#8B98AC',
  textLow: '#4C5A70',
} as const
```

- [ ] **Step 4: Write the failing test for tokens + Tailwind wiring**

`lib/tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { colors } from './tokens'
import tailwindConfig from '../tailwind.config'

describe('design tokens', () => {
  it('exposes the exact spec palette', () => {
    expect(colors.slateBase).toBe('#0B1220')
    expect(colors.safetyAmber).toBe('#F5A623')
    expect(colors.terminalGreen).toBe('#2ECC8F')
  })

  it('wires every token into the tailwind theme', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const themeColors = (tailwindConfig.theme as any).extend.colors
    expect(themeColors['slate-base']).toBe(colors.slateBase)
    expect(themeColors['safety-amber']).toBe(colors.safetyAmber)
    expect(themeColors['terminal-green']).toBe(colors.terminalGreen)
    expect(themeColors['text-hi']).toBe(colors.textHi)
  })
})
```

- [ ] **Step 5: Run the test to confirm it fails**

```bash
npx vitest run lib/tokens.test.ts
```
Expected: FAIL — `tailwind.config.ts` doesn't exist yet / colors not wired.

- [ ] **Step 6: Write `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'
import { colors } from './lib/tokens'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'slate-base': colors.slateBase,
        concrete: colors.concrete,
        'concrete-deep': colors.concreteDeep,
        'steel-line': colors.steelLine,
        'safety-amber': colors.safetyAmber,
        'terminal-green': colors.terminalGreen,
        frost: colors.frost,
        'text-hi': colors.textHi,
        'text-mid': colors.textMid,
        'text-low': colors.textLow,
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 7: Wire fonts in `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Websites, social media & AI systems for local businesses',
  description:
    'Websites, social media content, and AI automation built for local businesses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-slate-base font-body text-text-hi">{children}</body>
    </html>
  )
}
```

- [ ] **Step 8: Trim `app/globals.css` to just the Tailwind directives**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 9: Add the test script and Vitest config**

Add to `package.json` `"scripts"`:
```json
"test": "vitest run"
```

`vitest.config.mts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 10: Run the test to confirm it passes**

```bash
npx vitest run lib/tokens.test.ts
```
Expected: PASS — 2 tests passed.

---

### Task 2: Button primitive

Hand-authored in shadcn's own pattern (cva + forwardRef + `cn`) rather than via the `shadcn` CLI — the CLI's default init overwrites `tailwind.config.ts`/`globals.css` with its own HSL CSS-variable theme, which would fight the fixed hex tokens from Task 1. Same result, no config collision.

**Files:**
- Create: `lib/utils.ts`, `components/ui/button.tsx`, `components/ui/button.test.tsx`

**Interfaces:**
- Consumes: nothing outside this task.
- Produces: `cn(...inputs: ClassValue[]): string` from `lib/utils.ts`. `Button` (forwardRef component) and `buttonVariants` from `components/ui/button.tsx`. `ButtonProps` extends `React.ButtonHTMLAttributes<HTMLButtonElement>` with `variant?: 'primary' | 'outline'` and `size?: 'default' | 'sm'`.

- [ ] **Step 1: Write `lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Write the failing test**

`components/ui/button.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Start a project</Button>)
    expect(screen.getByText('Start a project')).toBeInTheDocument()
  })

  it('defaults to the primary amber variant', () => {
    render(<Button>Start a project</Button>)
    expect(screen.getByText('Start a project')).toHaveClass('bg-safety-amber')
  })

  it('supports the outline variant', () => {
    render(<Button variant="outline">Learn more</Button>)
    expect(screen.getByText('Learn more')).toHaveClass('border-steel-line')
  })
})
```

- [ ] **Step 3: Run the test to confirm it fails**

```bash
npx vitest run components/ui/button.test.tsx
```
Expected: FAIL — `./button` module not found.

- [ ] **Step 4: Write `components/ui/button.tsx`**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-mono text-sm uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-safety-amber text-slate-base hover:bg-safety-amber/90',
        outline: 'border border-steel-line text-text-hi hover:bg-frost',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 5: Run the test to confirm it passes**

```bash
npx vitest run components/ui/button.test.tsx
```
Expected: PASS — 3 tests passed.

---

### Task 3: StatusPill

**Files:**
- Create: `components/hero/StatusPill.tsx`, `components/hero/StatusPill.test.tsx`

**Interfaces:**
- Consumes: nothing outside this task.
- Produces: `StatusPill({ location: string, label: string })`.

- [ ] **Step 1: Write the failing test**

`components/hero/StatusPill.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusPill } from './StatusPill'

describe('StatusPill', () => {
  it('renders the location and label', () => {
    render(<StatusPill location="KL, MY" label="AVAILABLE FOR NEW PROJECTS" />)
    expect(
      screen.getByText('KL, MY | AVAILABLE FOR NEW PROJECTS')
    ).toBeInTheDocument()
  })

  it('shows a green status dot', () => {
    const { container } = render(
      <StatusPill location="KL, MY" label="AVAILABLE FOR NEW PROJECTS" />
    )
    expect(container.querySelector('.bg-terminal-green')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/hero/StatusPill.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/hero/StatusPill.tsx`**

```tsx
interface StatusPillProps {
  location: string
  label: string
}

export function StatusPill({ location, label }: StatusPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-steel-line bg-frost px-3 py-1 font-mono text-xs uppercase tracking-wide text-text-mid">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-green opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-terminal-green" />
      </span>
      <span>
        {location} | {label}
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/hero/StatusPill.test.tsx
```
Expected: PASS — 2 tests passed.

---

### Task 4: useCyclingText hook

**Files:**
- Create: `lib/useCyclingText.ts`, `lib/useCyclingText.test.ts`

**Interfaces:**
- Consumes: nothing outside this task.
- Produces: `useCyclingText(lines: string[], intervalMs?: number): string`.

- [ ] **Step 1: Write the failing test**

`lib/useCyclingText.test.ts`:
```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCyclingText } from './useCyclingText'

describe('useCyclingText', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts on the first line', () => {
    const { result } = renderHook(() =>
      useCyclingText(['ONE', 'TWO', 'THREE'], 1000)
    )
    expect(result.current).toBe('ONE')
  })

  it('advances to the next line after the interval, and wraps around', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() =>
      useCyclingText(['ONE', 'TWO', 'THREE'], 1000)
    )

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe('TWO')

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current).toBe('ONE')
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run lib/useCyclingText.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `lib/useCyclingText.ts`**

```ts
import { useEffect, useState } from 'react'

export function useCyclingText(lines: string[], intervalMs = 2500): string {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (lines.length <= 1) return
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % lines.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [lines, intervalMs])

  return lines[index]
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run lib/useCyclingText.test.ts
```
Expected: PASS — 2 tests passed.

---

### Task 5: BentoCard (shared card + hover tilt)

**Files:**
- Create: `components/hero/BentoCard.tsx`, `components/hero/BentoCard.test.tsx`

**Interfaces:**
- Consumes: nothing outside this task (uses `framer-motion` directly).
- Produces: `BentoCard({ accent: 'amber' | 'green', title: string, children: React.ReactNode })`.

- [ ] **Step 1: Write the failing test**

`components/hero/BentoCard.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BentoCard } from './BentoCard'

describe('BentoCard', () => {
  it('renders the title and body', () => {
    render(
      <BentoCard accent="amber" title="Web Design">
        <p>Sites that convert.</p>
      </BentoCard>
    )
    expect(screen.getByText('Web Design')).toBeInTheDocument()
    expect(screen.getByText('Sites that convert.')).toBeInTheDocument()
  })

  it('uses the amber accent underline', () => {
    render(
      <BentoCard accent="amber" title="Web Design">
        body
      </BentoCard>
    )
    expect(screen.getByTestId('accent-underline')).toHaveClass('bg-safety-amber')
  })

  it('uses the green accent underline', () => {
    render(
      <BentoCard accent="green" title="AI Systems">
        body
      </BentoCard>
    )
    expect(screen.getByTestId('accent-underline')).toHaveClass('bg-terminal-green')
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/hero/BentoCard.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/hero/BentoCard.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { useState, type ReactNode, type MouseEvent } from 'react'

interface BentoCardProps {
  accent: 'amber' | 'green'
  title: string
  children: ReactNode
}

export function BentoCard({ accent, title, children }: BentoCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const bounds = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - bounds.left) / bounds.width
    const py = (e.clientY - bounds.top) / bounds.height
    setRotate({ x: (py - 0.5) * -8, y: (px - 0.5) * 8 })
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 })
  }

  const accentClass = accent === 'amber' ? 'bg-safety-amber' : 'bg-terminal-green'

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      style={{ transformPerspective: 800 }}
      className="rounded-2xl bg-concrete p-5"
    >
      <div
        data-testid="accent-underline"
        className={`mb-3 h-1 w-10 rounded-full ${accentClass}`}
      />
      <h3 className="font-display text-lg uppercase text-text-hi">{title}</h3>
      <div className="mt-2 font-mono text-xs text-text-mid">{children}</div>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/hero/BentoCard.test.tsx
```
Expected: PASS — 3 tests passed.

---

### Task 6: BentoStack (the 4 real service cards)

**Files:**
- Create: `components/hero/BentoStack.tsx`, `components/hero/BentoStack.test.tsx`

**Interfaces:**
- Consumes: `BentoCard` from `./BentoCard`, `useCyclingText` from `@/lib/useCyclingText`.
- Produces: `BentoStack()` — no props.

- [ ] **Step 1: Write the failing test**

`components/hero/BentoStack.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BentoStack } from './BentoStack'

describe('BentoStack', () => {
  it('renders all four service cards', () => {
    render(<BentoStack />)
    expect(screen.getByText('Web Design')).toBeInTheDocument()
    expect(screen.getByText('AI Systems')).toBeInTheDocument()
    expect(screen.getByText('Social & UGC Ads')).toBeInTheDocument()
    expect(screen.getByText('Graphic Design & Copy')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/hero/BentoStack.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/hero/BentoStack.tsx`**

```tsx
'use client'

import { BentoCard } from './BentoCard'
import { useCyclingText } from '@/lib/useCyclingText'

const AI_PROCESS_LINES = [
  'GENERATING CHATBOT FLOW...',
  'BUILDING DOC AUTOMATION...',
  'DEPLOYING AGENT TASK...',
]

function AiSystemsBody() {
  const line = useCyclingText(AI_PROCESS_LINES, 2500)
  return <p className="text-terminal-green">{line}</p>
}

export function BentoStack() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <BentoCard accent="amber" title="Web Design">
        <p>Sites that turn visitors into calls and DMs.</p>
        <p className="mt-2 text-safety-amber">VIEW APPROACH →</p>
      </BentoCard>
      <BentoCard accent="green" title="AI Systems">
        <AiSystemsBody />
      </BentoCard>
      <BentoCard accent="amber" title="Social & UGC Ads">
        <p>Short-form content and UGC ads built for how people actually scroll.</p>
      </BentoCard>
      <BentoCard accent="green" title="Graphic Design & Copy">
        <p>Visuals and words that share one brand voice.</p>
      </BentoCard>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/hero/BentoStack.test.tsx
```
Expected: PASS — 1 test passed.

---

### Task 7: FloatingCard

**Files:**
- Create: `components/hero/FloatingCard.tsx`, `components/hero/FloatingCard.test.tsx`

**Interfaces:**
- Consumes: nothing outside this task.
- Produces: `FloatingCard()` — no props.

- [ ] **Step 1: Write the failing test**

`components/hero/FloatingCard.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FloatingCard } from './FloatingCard'

describe('FloatingCard', () => {
  it('renders the multilingual and turnaround lines with no numeric stats', () => {
    render(<FloatingCard />)
    expect(
      screen.getByText('EN / MY / ZH / TA — MULTILINGUAL ON SITE')
    ).toBeInTheDocument()
    expect(
      screen.getByText('FAST TURNAROUND, DIRECT COMMUNICATION')
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/hero/FloatingCard.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/hero/FloatingCard.tsx`**

```tsx
export function FloatingCard() {
  return (
    <div
      className="absolute -bottom-8 left-6 right-6 rounded-2xl border border-steel-line bg-frost p-4 backdrop-blur-md"
      style={{ transform: 'rotate(-3deg)' }}
    >
      <p className="font-mono text-xs uppercase tracking-wide text-text-hi">
        EN / MY / ZH / TA — MULTILINGUAL ON SITE
      </p>
      <p className="mt-1 font-mono text-xs uppercase tracking-wide text-terminal-green">
        FAST TURNAROUND, DIRECT COMMUNICATION
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/hero/FloatingCard.test.tsx
```
Expected: PASS — 1 test passed.

---

### Task 8: supportsWebGL utility

**Files:**
- Create: `lib/supportsWebGL.ts`, `lib/supportsWebGL.test.ts`

**Interfaces:**
- Consumes: nothing outside this task.
- Produces: `supportsWebGL(): boolean`.

- [ ] **Step 1: Write the failing test**

`lib/supportsWebGL.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { supportsWebGL } from './supportsWebGL'

describe('supportsWebGL', () => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext
    // @ts-expect-error test cleanup
    delete window.WebGLRenderingContext
  })

  it('returns false when the browser has no WebGLRenderingContext', () => {
    // @ts-expect-error simulating an old/unsupported browser
    delete window.WebGLRenderingContext
    expect(supportsWebGL()).toBe(false)
  })

  it('returns true when a webgl context is available', () => {
    // @ts-expect-error stubbing for test
    window.WebGLRenderingContext = function () {}
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({})) as any
    expect(supportsWebGL()).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run lib/supportsWebGL.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `lib/supportsWebGL.ts`**

```ts
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run lib/supportsWebGL.test.ts
```
Expected: PASS — 2 tests passed.

---

### Task 9: HeroScene (R3F centerpiece)

3D rendering itself is not meaningfully unit-testable under jsdom (no real WebGL). This task tests the one piece of real logic — the fallback branch — and defers the actual visual/motion correctness to the manual browser pass in Task 12.

**Files:**
- Create: `components/hero/HeroScene.tsx`, `components/hero/HeroScene.test.tsx`

**Interfaces:**
- Consumes: `supportsWebGL` from `@/lib/supportsWebGL`.
- Produces: `HeroScene()` — no props.

- [ ] **Step 1: Write the failing test**

`components/hero/HeroScene.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/supportsWebGL', () => ({
  supportsWebGL: () => false,
}))

import { HeroScene } from './HeroScene'

describe('HeroScene', () => {
  it('renders the static fallback when WebGL is unavailable', () => {
    render(<HeroScene />)
    expect(screen.getByTestId('hero-scene-fallback')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/hero/HeroScene.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/hero/HeroScene.tsx`**

```tsx
'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Html, RoundedBox } from '@react-three/drei'
import type * as THREE from 'three'
import { supportsWebGL } from '@/lib/supportsWebGL'

function Centerpiece() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.003
    ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15
  })

  return (
    <group>
      <RoundedBox ref={ref} args={[2, 1.2, 0.2]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#8B98AC" metalness={0.7} roughness={0.25} />
      </RoundedBox>
      <Html position={[1.4, 0.6, 0]} distanceFactor={8} occlude>
        <div className="whitespace-nowrap border-l border-text-low pl-2 font-mono text-[10px] uppercase text-text-mid">
          FIELD ENGINE — CORE MODULE
        </div>
      </Html>
    </group>
  )
}

function LoosePrimitives() {
  const positions: Array<[number, number, number]> = [
    [-2.2, 0.8, -1],
    [2.4, -0.6, -0.5],
    [-1.6, -1.2, 0.5],
    [1.8, 1.4, -1.2],
    [0.4, -1.6, -0.8],
  ]

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[i, i, 0]}>
          {i % 2 === 0 ? (
            <boxGeometry args={[0.25, 0.25, 0.25]} />
          ) : (
            <icosahedronGeometry args={[0.2, 0]} />
          )}
          <meshStandardMaterial color="#141C29" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
    </>
  )
}

export function HeroScene() {
  if (!supportsWebGL()) {
    return (
      <div
        data-testid="hero-scene-fallback"
        className="h-full w-full rounded-2xl bg-gradient-to-br from-concrete to-concrete-deep"
      />
    )
  }

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} />
      <directionalLight position={[-3, -1, -2]} intensity={0.3} color="#2ECC8F" />
      <Suspense fallback={null}>
        <Centerpiece />
        <LoosePrimitives />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run components/hero/HeroScene.test.tsx
```
Expected: PASS — 1 test passed.

---

### Task 10: Headline (copy, CTA, safety footnote)

**Files:**
- Create: `components/hero/Headline.tsx`, `components/hero/Headline.test.tsx`

**Interfaces:**
- Consumes: `Button` from `@/components/ui/button`.
- Produces: `Headline()` — no props.

- [ ] **Step 1: Write the failing test**

`components/hero/Headline.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Headline } from './Headline'

describe('Headline', () => {
  it('renders the headline, sub-line, CTA, and a brief safety footnote', () => {
    render(<Headline />)
    expect(
      screen.getByRole('heading', {
        name: /websites and ai systems built for local business growth/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/short-form content/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /start a project/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/10\+ years on high-rise safety-critical sites/i)
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run components/hero/Headline.test.tsx
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/hero/Headline.tsx`**

```tsx
import { Button } from '@/components/ui/button'

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
      <Button className="mt-8">Start a project</Button>
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
Expected: PASS — 1 test passed.

---

### Task 11: Assemble the hero page

**Files:**
- Modify: `app/page.tsx`
- Create: `app/page.test.tsx`

**Interfaces:**
- Consumes: `StatusPill` (`@/components/hero/StatusPill`), `Headline` (`@/components/hero/Headline`), `HeroScene` (`@/components/hero/HeroScene`), `BentoStack` (`@/components/hero/BentoStack`), `FloatingCard` (`@/components/hero/FloatingCard`).
- Produces: default export `Home()`.

- [ ] **Step 1: Write the failing test**

`app/page.test.tsx`:
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
})
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
npx vitest run app/page.test.tsx
```
Expected: FAIL — `app/page.tsx` still has the create-next-app placeholder content.

- [ ] **Step 3: Write `app/page.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
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
    <main className="relative min-h-screen overflow-hidden bg-slate-base px-6 py-16 md:px-16 md:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-16 md:grid-cols-[60fr_40fr]"
      >
        <div className="relative flex flex-col justify-center gap-8">
          <motion.div variants={item}>
            <StatusPill location="KL, MY" label="AVAILABLE FOR NEW PROJECTS" />
          </motion.div>
          <motion.div variants={item}>
            <Headline />
          </motion.div>
          <motion.div variants={item} className="h-72 md:h-96">
            <HeroScene />
          </motion.div>
        </div>
        <motion.div variants={item} className="relative pb-10">
          <BentoStack />
          <FloatingCard />
        </motion.div>
      </motion.div>
    </main>
  )
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
npx vitest run app/page.test.tsx
```
Expected: PASS — 1 test passed.

- [ ] **Step 5: Run the full test suite**

```bash
npx vitest run
```
Expected: PASS — all tests across every task pass (tokens, button, status pill, cycling hook, bento card, bento stack, floating card, supportsWebGL, hero scene, headline, page).

---

### Task 12: Manual browser verification

Automated tests confirm each piece renders correct content; they do not confirm the page looks and behaves right. Per the spec's verification plan, this task is required before the hero counts as done.

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```
Expected: `Ready` log, server on `http://localhost:3000`.

- [ ] **Step 2: Open the page in a browser and check the desktop layout**

Open `http://localhost:3000` at a desktop viewport (~1440px wide). Confirm:
- Left column (~60%): status pill → headline → 3D scene, stacked, staggered fade/rise-in on load.
- Right column (~40%): 2×2 bento grid with all four cards (Web Design, AI Systems, Social & UGC Ads, Graphic Design & Copy), alternating amber/green accent underlines.
- Floating qualitative card overlaps the bottom edge of the bento grid, rotated slightly, no numeric stats in it.
- Only two accent colors visible anywhere (amber, green) — no third color has crept in.

- [ ] **Step 3: Check the 3D scene**

Confirm the centerpiece panel is idly rotating/floating (not static, not spinning fast), the small dark primitives are visible at different depths, and the one leader-line annotation label is legible and points at the centerpiece.

- [ ] **Step 4: Check interactions**

Hover over each bento card — confirm a subtle perspective tilt follows the mouse and resets on mouse-leave. Watch the AI Systems card for ~8 seconds — confirm the mono-green line cycles through the three process strings.

- [ ] **Step 5: Check the mobile viewport**

Resize to ~375px wide (or use device emulation). Confirm the layout stacks to a single column, text stays legible, and nothing overflows horizontally.

- [ ] **Step 6: Check the WebGL fallback path**

Temporarily change the `supportsWebGL` import in `components/hero/HeroScene.tsx` to force `false` (e.g. `if (!supportsWebGL() || true)`), reload, confirm the flat gradient fallback panel renders in place of the 3D scene with no layout break, then revert the temporary change.

- [ ] **Step 7: Check the browser console**

Confirm no errors or React warnings are logged during load or interaction.

- [ ] **Step 8: Stop the dev server**

Stop the `npm run dev` process once verification is complete.

---

## Self-Review Notes

- **Spec coverage:** stack (Task 1), palette/type tokens (Task 1), asymmetric layout + 2x2 bento (Task 11), status pill (Task 3), headline/sub-line/CTA (Task 10), safety footnote — brief, not a card (Task 10), 3D centerpiece + primitives + annotation + fallback (Task 9), bento cards with real service copy (Task 6), AI terminal cycling text (Task 4 + 6), floating qualitative card, no fake stats (Task 7), hover tilt + staggered entrance motion (Task 5, 11), manual visual verification (Task 12). All covered.
- **No placeholders:** every step has real, complete code or an exact command with expected output; no TBD/TODO remain.
- **Type consistency checked:** `BentoCard`'s `accent: 'amber' | 'green'` prop matches its two call sites in `BentoStack`. `supportsWebGL(): boolean` signature matches both its own test and the mock used in `HeroScene.test.tsx`/`page.test.tsx`. `Button`'s `variant`/`size` props match its test assertions.
