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
    expect(card).not.toHaveClass('bg-concrete')
  })

  it('has no accent-color underline (not real, populated content)', () => {
    const { container } = render(<WorkCard title="Website Design" />)
    expect(
      container.querySelector('[data-testid="accent-underline"]')
    ).toBeNull()
  })
})
