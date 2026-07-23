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
