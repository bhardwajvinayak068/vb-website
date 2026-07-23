interface WorkCardProps {
  title: string
}

export function WorkCard({ title }: WorkCardProps) {
  return (
    <div className="rounded-2xl border border-dashed border-steel-line p-6">
      <h3 className="font-display text-lg uppercase text-text-low">
        {title}
      </h3>
      <p className="mt-3 text-sm text-text-low">Case study coming soon.</p>
    </div>
  )
}
