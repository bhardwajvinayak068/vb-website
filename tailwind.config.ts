import type { Config } from 'tailwindcss'
import { colors } from './lib/tokens'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'slate-base': colors.slateBase,
        concrete: colors.concrete,
        'concrete-deep': colors.concreteDeep,
        'steel-line': colors.steelLine,
        'safety-amber': colors.safetyAmber,
        'terminal-green': colors.terminalGreen,
        frost: colors.frost,
        'text-hi': colors.textHi,
        'text-mid': colors.textMid,
        'text-low': colors.textLow,
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}

export default config
