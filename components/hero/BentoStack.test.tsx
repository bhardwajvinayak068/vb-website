import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BentoStack } from './BentoStack'

describe('BentoStack', () => {
  it('renders all four service cards', () => {
    render(<BentoStack />)
    expect(screen.getByText('Web Design')).toBeInTheDocument()
    expect(screen.getByText('AI Systems')).toBeInTheDocument()
    expect(screen.getByText('Social & UGC Ads')).toBeInTheDocument()
    expect(screen.getByText('Graphic Design & Copy')).toBeInTheDocument()
  })
})
