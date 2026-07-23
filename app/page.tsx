'use client'

import { motion } from 'framer-motion'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { StatusPill } from '@/components/hero/StatusPill'
import { Headline } from '@/components/hero/Headline'
import { HeroScene } from '@/components/hero/HeroScene'
import { BentoStack } from '@/components/hero/BentoStack'
import { FloatingCard } from '@/components/hero/FloatingCard'
import { ServicesSection } from '@/components/services/ServicesSection'
import { WorkSection } from '@/components/work/WorkSection'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Home() {
  return (
    <>
      <Nav />
      <main className="bg-blueprint-grid relative min-h-screen overflow-hidden bg-slate-base px-6 py-16 md:px-16 md:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-16 md:grid-cols-[60fr_40fr]"
        >
          <div className="relative flex flex-col justify-center gap-8">
            <motion.div variants={item}>
              <StatusPill
                location="KL, MY"
                label="AVAILABLE FOR NEW PROJECTS"
              />
            </motion.div>
            <motion.div variants={item}>
              <Headline />
            </motion.div>
            <motion.div variants={item} className="h-80 md:h-[32rem]">
              <HeroScene />
            </motion.div>
          </div>
          <motion.div variants={item} className="relative self-start pb-10">
            <BentoStack />
            <FloatingCard />
          </motion.div>
        </motion.div>
      </main>
      <ServicesSection />
      <WorkSection />
      <Footer />
    </>
  )
}
