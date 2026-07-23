'use client'

import { BentoCard } from './BentoCard'
import { useCyclingText } from '@/lib/useCyclingText'

const AI_PROCESS_LINES = [
  'GENERATING CHATBOT FLOW...',
  'BUILDING DOC AUTOMATION...',
  'DEPLOYING AGENT TASK...',
]

function AiSystemsBody() {
  const line = useCyclingText(AI_PROCESS_LINES, 2500)
  return <p className="font-mono text-terminal-green">{line}</p>
}

export function BentoStack() {
  return (
    <div className="flex flex-col gap-5">
      <BentoCard accent="green" title="AI Systems" featured>
        <AiSystemsBody />
      </BentoCard>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <BentoCard accent="amber" title="Web Design">
          <p>Sites that turn visitors into calls and DMs.</p>
          <p className="mt-2 font-mono text-safety-amber">VIEW APPROACH →</p>
        </BentoCard>
        <BentoCard accent="amber" title="Social & UGC Ads">
          <p>
            Short-form content and UGC ads built for how people actually
            scroll.
          </p>
        </BentoCard>
        <BentoCard accent="green" title="Graphic Design & Copy">
          <p>Visuals and words that share one brand voice.</p>
        </BentoCard>
      </div>
    </div>
  )
}
