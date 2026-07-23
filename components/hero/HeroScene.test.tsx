import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/supportsWebGL', () => ({
  supportsWebGL: () => false,
}))

import { HeroScene } from './HeroScene'

describe('HeroScene', () => {
  it('renders the static fallback when WebGL is unavailable', () => {
    render(<HeroScene />)
    expect(screen.getByTestId('hero-scene-fallback')).toBeInTheDocument()
  })
})
