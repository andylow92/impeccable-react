import type { ReactNode } from 'react';

type CardProps = {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
  aside?: ReactNode;
};

export function Card({ eyebrow, title, summary, children, aside }: CardProps) {
  return (
    <section className="overflow-hidden rounded-panel border border-ink/15 bg-white shadow-edge">
      {/* Avoided generic pattern: a single undifferentiated card body with equal text weight.
          Design decision: split into context header + decision body + optional aside rail for fast scanning. */}
      <header className="grid gap-4 border-b border-ink/10 bg-gradient-to-r from-white to-paper px-gutter py-gutter md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cobalt">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-ink">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate">{summary}</p>
        </div>
        {aside ? <div className="rounded-sharp border border-ink/15 bg-white px-4 py-3">{aside}</div> : null}
      </header>
      <div className="px-gutter py-gutter">{children}</div>
    </section>
  );
}
