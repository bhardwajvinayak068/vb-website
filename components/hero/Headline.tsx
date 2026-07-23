import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Headline() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display text-6xl uppercase leading-[0.95] tracking-tight text-text-hi md:text-7xl">
        Websites and AI systems built for local business growth
      </h1>
      <p className="mt-6 max-w-md text-sm text-text-mid">
        Sites, social ads, short-form content, and automation — built and run
        for local businesses that want more calls, more DMs, and less manual
        work.
      </p>
      <a
        href="mailto:bhardwajvinayak068@gmail.com"
        className={cn('mt-8', buttonVariants({ variant: 'primary' }))}
      >
        Start a project
      </a>
      <p className="mt-10 font-mono text-[11px] uppercase tracking-wide text-text-low">
        10+ years on high-rise safety-critical sites
      </p>
    </div>
  )
}
