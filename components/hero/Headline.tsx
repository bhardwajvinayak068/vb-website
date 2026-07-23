import { Button } from '@/components/ui/button'

export function Headline() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-5xl uppercase leading-[1.05] tracking-tight text-text-hi md:text-6xl">
        Websites and AI systems built for local business growth
      </h1>
      <p className="mt-5 text-base text-text-mid">
        Sites, social ads, short-form content, and automation — built and run
        for local businesses that want more calls, more DMs, and less manual
        work.
      </p>
      <Button className="mt-8">Start a project</Button>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-wide text-text-low">
        10+ years on high-rise safety-critical sites
      </p>
    </div>
  )
}
