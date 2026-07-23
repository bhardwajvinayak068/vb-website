export function FloatingCard() {
  return (
    <div
      className="absolute -bottom-8 left-6 right-6 rounded-2xl border border-steel-line bg-frost p-4 backdrop-blur-md"
      style={{ transform: 'rotate(-3deg)' }}
    >
      <p className="font-mono text-xs uppercase tracking-wide text-text-hi">
        EN / MY / ZH / TA — MULTILINGUAL ON SITE
      </p>
      <p className="mt-1 font-mono text-xs uppercase tracking-wide text-terminal-green">
        FAST TURNAROUND, DIRECT COMMUNICATION
      </p>
    </div>
  )
}
