'use client'

import { motion } from 'framer-motion'
import { WorkCard } from './WorkCard'

const PENDING_CASE_STUDIES = ['Website Design', 'Graphic Design', 'Copywriting']

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function WorkSection() {
  return (
    <section id="work" className="bg-slate-base px-6 py-16 md:px-16 md:py-24">
      <h2 className="font-display text-3xl uppercase tracking-tight text-text-hi md:text-4xl">
        Recent Work
      </h2>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {PENDING_CASE_STUDIES.map((title) => (
          <motion.div key={title} variants={item}>
            <WorkCard title={title} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
