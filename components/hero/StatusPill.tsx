interface StatusPillProps {
  location: string
  label: string
}

export function StatusPill({ location, label }: StatusPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-steel-line bg-frost px-3 py-1 font-mono text-xs uppercase tracking-wide text-text-mid">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-green opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-terminal-green" />
      </span>
      <span>
        {location} | {label}
      </span>
    </div>
  )
}
