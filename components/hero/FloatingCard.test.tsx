import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FloatingCard } from './FloatingCard'

describe('FloatingCard', () => {
  it('renders the multilingual and turnaround lines with no numeric stats', () => {
    render(<FloatingCard />)
    expect(
      screen.getByText('EN / MY / ZH / TA — MULTILINGUAL ON SITE')
    ).toBeInTheDocument()
    expect(
      screen.getByText('FAST TURNAROUND, DIRECT COMMUNICATION')
    ).toBeInTheDocument()
  })
})
