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
