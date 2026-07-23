import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders the VB wordmark', () => {
    render(<Nav />)
    expect(screen.getByText('VB')).toBeInTheDocument()
  })

  it('links Services to the #services anchor', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /^services$/i })).toHaveAttribute(
      'href',
      '#services'
    )
  })

  it('links Contact to the #contact anchor', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /^contact$/i })).toHaveAttribute(
      'href',
      '#contact'
    )
  })
})
