import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusPill } from './StatusPill'

describe('StatusPill', () => {
  it('renders the location and label', () => {
    render(<StatusPill location="KL, MY" label="AVAILABLE FOR NEW PROJECTS" />)
    expect(
      screen.getByText('KL, MY | AVAILABLE FOR NEW PROJECTS')
    ).toBeInTheDocument()
  })

  it('shows a green status dot', () => {
    const { container } = render(
      <StatusPill location="KL, MY" label="AVAILABLE FOR NEW PROJECTS" />
    )
    expect(container.querySelector('.bg-terminal-green')).not.toBeNull()
  })
})
