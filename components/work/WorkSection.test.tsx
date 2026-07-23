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
