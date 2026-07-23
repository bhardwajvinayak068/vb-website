import { describe, it, expect } from 'vitest'
import { colors } from './tokens'
import tailwindConfig from '../tailwind.config'

describe('design tokens', () => {
  it('exposes the exact spec palette', () => {
    expect(colors.slateBase).toBe('#0B1220')
    expect(colors.safetyAmber).toBe('#F5A623')
    expect(colors.terminalGreen).toBe('#2ECC8F')
  })

  it('wires every token into the tailwind theme', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const themeColors = (tailwindConfig.theme as any).extend.colors
    expect(themeColors['slate-base']).toBe(colors.slateBase)
    expect(themeColors['safety-amber']).toBe(colors.safetyAmber)
    expect(themeColors['terminal-green']).toBe(colors.terminalGreen)
    expect(themeColors['text-hi']).toBe(colors.textHi)
  })
})
