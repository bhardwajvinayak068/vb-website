'use client'

import { motion } from 'framer-motion'
import { ServiceCard } from './ServiceCard'

const SERVICES: Array<{
  accent: 'amber' | 'green'
  title: string
  description: string
  bullets: string[]
}> = [
  {
    accent: 'amber',
    title: 'Website Design',
    description:
      'Custom-built sites that load fast and turn visitors into calls or messages.',
    bullets: [
      'Mobile-responsive, fast load times',
      'Built to convert — clear CTAs, simple contact/booking flow',
      'Ongoing edits after launch, not a one-off handoff',
    ],
  },
  {
    accent: 'green',
    title: 'Social Media Ads',
    description:
      'Paid campaigns run and optimized for local reach, not just impressions.',
    bullets: [
      'Platform setup (Meta/Instagram/TikTok ads)',
      'Audience targeting for local customers',
      'Weekly performance check-ins',
    ],
  },
  {
    accent: 'amber',
    title: 'UGC Ads',
    description:
      "Authentic, creator-style ad content that doesn't look like an ad.",
    bullets: [
      'Scripted and directed for real engagement',
      'Multiple hooks/variations per concept',
      'Ready-to-run formats (9:16, captions included)',
    ],
  },
  {
    accent: 'green',
    title: 'Short-Form Content',
    description:
      'Reels and TikToks built around what actually gets watched, not just posted.',
    bullets: [
      'Hook-first scripting',
      'Edited for retention (pacing, captions, sound)',
      'Batched shooting for a consistent posting cadence',
    ],
  },
  {
    accent: 'amber',
    title: 'Graphic Design',
    description: 'Visuals that stay consistent across everything you post.',
    bullets: [
      'Social templates, menus, posters, basic brand assets',
      'Consistent colors/type across all materials',
      'Fast turnaround for one-off requests',
    ],
  },
  {
    accent: 'green',
    title: 'Copywriting',
    description: "Words that sound like a person, not a template.",
    bullets: [
      'Website copy, ad captions, product descriptions',
      'Matches your actual voice, not generic filler',
      "Edited for the platform it's going on",
    ],
  },
  {
    accent: 'amber',
    title: 'Agentic AI Systems',
    description:
      'Automation that handles the repetitive parts of running a business.',
    bullets: [
      'Chatbots for FAQs/bookings/lead capture',
      'Document/report generation automation',
      'Built around your actual workflow, not a generic template',
    ],
  },
]

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

export function ServicesSection() {
  return (
    <section id="services" className="bg-slate-base px-6 py-16 md:px-16 md:py-24">
      <h2 className="font-display text-3xl uppercase tracking-tight text-text-hi md:text-4xl">
        What I Do
      </h2>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {SERVICES.map((service, index) => {
          const isLast = index === SERVICES.length - 1
          return (
            <motion.div
              key={service.title}
              variants={item}
              className={isLast ? 'md:col-span-2' : undefined}
            >
              <ServiceCard {...service} />
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
