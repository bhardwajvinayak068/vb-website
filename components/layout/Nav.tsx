export function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-steel-line bg-slate-base px-6 py-5 md:px-16">
      <div>
        <span className="font-display text-lg uppercase tracking-wide text-text-hi">
          VB
        </span>
        <div className="mt-1 h-0.5 w-6 rounded-full bg-safety-amber" />
      </div>
      <div className="flex gap-6 font-mono text-xs uppercase tracking-wide text-text-mid">
        <a href="#services" className="transition-colors hover:text-text-hi">
          Services
        </a>
        <a href="#contact" className="transition-colors hover:text-text-hi">
          Contact
        </a>
      </div>
    </nav>
  )
}
