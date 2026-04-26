import type { ReactNode } from 'react';

type CardProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function Card({ eyebrow, title, children }: CardProps) {
  return (
    <section className="rounded-panel border border-ink/10 bg-white shadow-edge">
      <header className="border-b border-ink/10 px-gutter py-rhythm">
        {/* Intentional hierarchy: compressed uppercase label + large title.
           Avoided: centered headings and uniform text weights found in generic SaaS cards. */}
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cobalt">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold text-ink">{title}</h2>
      </header>
      <div className="px-gutter py-gutter">{children}</div>
    </section>
  );
}
