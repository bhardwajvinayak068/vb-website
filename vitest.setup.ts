import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jsdom doesn't implement IntersectionObserver; framer-motion's whileInView
// needs one present on the global object to avoid throwing under test.
// @ts-expect-error minimal test stub, not a full IntersectionObserver
global.IntersectionObserver = IntersectionObserverStub
