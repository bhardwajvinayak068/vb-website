import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Start a project</Button>)
    expect(screen.getByText('Start a project')).toBeInTheDocument()
  })

  it('defaults to the primary amber variant', () => {
    render(<Button>Start a project</Button>)
    expect(screen.getByText('Start a project')).toHaveClass('bg-safety-amber')
  })

  it('supports the outline variant', () => {
    render(<Button variant="outline">Learn more</Button>)
    expect(screen.getByText('Learn more')).toHaveClass('border-steel-line')
  })
})
