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
