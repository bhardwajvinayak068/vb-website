'use client'

import { motion } from 'framer-motion'
import { useState, type ReactNode, type MouseEvent } from 'react'

interface BentoCardProps {
  accent: 'amber' | 'green'
  title: string
  children: ReactNode
}

export function BentoCard({ accent, title, children }: BentoCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const bounds = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - bounds.left) / bounds.width
    const py = (e.clientY - bounds.top) / bounds.height
    setRotate({ x: (py - 0.5) * -8, y: (px - 0.5) * 8 })
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 })
  }

  const accentClass = accent === 'amber' ? 'bg-safety-amber' : 'bg-terminal-green'

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      style={{ transformPerspective: 800 }}
      className="rounded-2xl bg-concrete p-5"
    >
      <div
        data-testid="accent-underline"
        className={`mb-3 h-1 w-10 rounded-full ${accentClass}`}
      />
      <h3 className="font-display text-lg uppercase text-text-hi">{title}</h3>
      <div className="mt-2 font-mono text-xs text-text-mid">{children}</div>
    </motion.div>
  )
}
