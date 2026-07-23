import { describe, it, expect, afterEach, vi } from 'vitest'
import { supportsWebGL } from './supportsWebGL'

describe('supportsWebGL', () => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext
    // @ts-expect-error test cleanup
    delete window.WebGLRenderingContext
  })

  it('returns false when the browser has no WebGLRenderingContext', () => {
    // @ts-expect-error simulating an old/unsupported browser
    delete window.WebGLRenderingContext
    expect(supportsWebGL()).toBe(false)
  })

  it('returns true when a webgl context is available', () => {
    // @ts-expect-error stubbing for test
    window.WebGLRenderingContext = function () {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({})) as any
    expect(supportsWebGL()).toBe(true)
  })
})
