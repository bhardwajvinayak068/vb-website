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

  it('renders larger when featured', () => {
    render(
      <BentoCard accent="green" title="AI Systems" featured>
        body
      </BentoCard>
    )
    expect(screen.getByText('AI Systems')).toHaveClass('text-3xl')
    expect(screen.getByTestId('accent-underline')).toHaveClass('w-16')
  })

  it('defaults to the compact size when not featured', () => {
    render(
      <BentoCard accent="amber" title="Web Design">
        body
      </BentoCard>
    )
    expect(screen.getByText('Web Design')).toHaveClass('text-lg')
    expect(screen.getByTestId('accent-underline')).toHaveClass('w-10')
  })
})
