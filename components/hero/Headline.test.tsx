import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Headline } from './Headline'

describe('Headline', () => {
  it('renders the headline, sub-line, and a brief safety footnote', () => {
    render(<Headline />)
    expect(
      screen.getByRole('heading', {
        name: /websites and ai systems built for local business growth/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/short-form content/i)).toBeInTheDocument()
    expect(
      screen.getByText(/10\+ years on high-rise safety-critical sites/i)
    ).toBeInTheDocument()
  })

  it('CTA links to a real mailto address', () => {
    render(<Headline />)
    expect(
      screen.getByRole('link', { name: /start a project/i })
    ).toHaveAttribute('href', 'mailto:bhardwajvinayak068@gmail.com')
  })
})
