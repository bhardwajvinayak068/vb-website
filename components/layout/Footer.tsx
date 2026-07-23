export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-steel-line bg-slate-base px-6 py-10 md:px-16"
    >
      <div className="flex flex-col gap-4 font-mono text-xs uppercase tracking-wide text-text-mid md:flex-row md:gap-8">
        <a
          href="mailto:bhardwajvinayak068@gmail.com"
          className="transition-colors hover:text-text-hi"
        >
          Email
        </a>
        <a
          href="https://wa.me/60182302045"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-text-hi"
        >
          WhatsApp
        </a>
        <a
          href="https://www.instagram.com/vinayak_ai_tech?igsh=bnJjNWo0dGFyaXN5"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-text-hi"
        >
          Instagram
        </a>
      </div>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-wide text-text-low">
        Based in Kuala Lumpur.
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-text-low">
        © 2026 VB. All rights reserved.
      </p>
    </footer>
  )
}
