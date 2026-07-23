import { useEffect, useState } from 'react'

export function useCyclingText(lines: string[], intervalMs = 2500): string {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (lines.length <= 1) return
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % lines.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [lines, intervalMs])

  return lines[index]
}
