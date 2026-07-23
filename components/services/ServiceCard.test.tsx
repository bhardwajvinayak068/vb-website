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
