interface ServiceCardProps {
  accent: 'amber' | 'green'
  title: string
  description: string
  bullets: string[]
}

export function ServiceCard({
  accent,
  title,
  description,
  bullets,
}: ServiceCardProps) {
  const accentClass = accent === 'amber' ? 'bg-safety-amber' : 'bg-terminal-green'

  return (
    <div className="h-full rounded-2xl bg-concrete p-6">
      <div
        data-testid="accent-underline"
        className={`mb-4 h-1 w-10 rounded-full ${accentClass}`}
      />
      <h3 className="font-display text-xl uppercase text-text-hi">{title}</h3>
      <p className="mt-3 text-sm text-text-mid">{description}</p>
      <ul className="mt-4 space-y-2">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-sm text-text-mid">
            <span className="text-text-low">—</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
