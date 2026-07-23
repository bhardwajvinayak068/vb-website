import { WorkCard } from './WorkCard'

const PENDING_CASE_STUDIES = ['Website Design', 'Graphic Design', 'Copywriting']

export function WorkSection() {
  return (
    <section id="work" className="bg-slate-base px-6 py-16 md:px-16 md:py-24">
      <h2 className="font-display text-3xl uppercase tracking-tight text-text-hi md:text-4xl">
        Recent Work
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PENDING_CASE_STUDIES.map((title) => (
          <WorkCard key={title} title={title} />
        ))}
      </div>
    </section>
  )
}
