import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('has id="contact" as the nav anchor target', () => {
    const { container } = render(<Footer />)
    expect(container.querySelector('#contact')).not.toBeNull()
  })

  it('links Email to the correct mailto address', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
      'href',
      'mailto:bhardwajvinayak068@gmail.com'
    )
  })

  it('links WhatsApp to the correct wa.me URL', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /whatsapp/i })).toHaveAttribute(
      'href',
      'https://wa.me/60182302045'
    )
  })

  it('links Instagram to the correct profile URL', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute(
      'href',
      'https://www.instagram.com/vinayak_ai_tech?igsh=bnJjNWo0dGFyaXN5'
    )
  })

  it('renders the closing line and copyright', () => {
    render(<Footer />)
    expect(screen.getByText('Based in Kuala Lumpur.')).toBeInTheDocument()
    expect(
      screen.getByText('© 2026 VB. All rights reserved.')
    ).toBeInTheDocument()
  })
})
