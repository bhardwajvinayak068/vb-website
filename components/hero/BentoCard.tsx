'use client'

import { motion } from 'framer-motion'
import { useState, type ReactNode, type MouseEvent } from 'react'

interface BentoCardProps {
  accent: 'amber' | 'green'
  title: string
  children: ReactNode
  featured?: boolean
}

export function BentoCard({
  accent,
  title,
  children,
  featured = false,
}: BentoCardProps) {
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
      className={`rounded-2xl bg-concrete ${featured ? 'p-8' : 'p-5'}`}
    >
      <div
        data-testid="accent-underline"
        className={`mb-3 h-1 rounded-full ${featured ? 'w-16' : 'w-10'} ${accentClass}`}
      />
      <h2
        className={`font-display uppercase text-text-hi ${featured ? 'text-3xl' : 'text-lg'}`}
      >
        {title}
      </h2>
      <div className={`mt-2 text-text-mid ${featured ? 'text-sm' : 'text-xs'}`}>
        {children}
      </div>
    </motion.div>
  )
}
