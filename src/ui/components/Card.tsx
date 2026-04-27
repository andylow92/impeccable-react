import type { ReactNode } from 'react';

/**
 * Card — anti-generic by construction.
 *
 * Avoided:
 *   - Single rounded rectangle with a centered title and a CTA at the bottom
 *     (the AI-default SaaS card). Reading hierarchy collapses.
 *   - Uniform radii on every nested element.
 *   - Decorative shadows applied without communicating elevation.
 *
 * Decisions made instead:
 *   - Left accent rail encodes priority/section identity. The card has a side,
 *     not just a top.
 *   - Distinct radius tokens: `rounded-panel` on the outer surface, sharp inner
 *     edges on data sub-blocks. Two intentional radii, not one.
 *   - Composition via slot subcomponents (Card.Eyebrow, Card.Title, Card.Body,
 *     Card.Side, Card.Footer). Callers compose; the component does not invent
 *     a 12-prop API.
 *   - Body and side panel use a 2-column grid so the action rail lives beside
 *     the content, not below it. The reading path is L→R, not top-down stack.
 */

type CardProps = {
  /**
   * Tone selects the accent rail color. It is required to force the caller
   * to make an intentional choice; there is no "default" tone.
   */
  tone: 'authority' | 'action' | 'risk';
  children: ReactNode;
};

const RAIL_TONE: Record<CardProps['tone'], string> = {
  authority: 'bg-ink',
  action: 'bg-cobalt',
  risk: 'bg-signal',
};

export function Card({ tone, children }: CardProps) {
  return (
    <section className="grid grid-cols-[6px_1fr] overflow-hidden rounded-panel bg-white shadow-edge ring-1 ring-ink/10">
      <div className={RAIL_TONE[tone]} aria-hidden />
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr]">
        {children}
      </div>
    </section>
  );
}

function CardEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cobalt">
      {children}
    </p>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="mt-1.5 text-2xl font-bold leading-tight text-ink">{children}</h2>;
}

function CardBody({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-ink/10 px-gutter py-gutter md:border-b-0 md:border-r">
      {children}
    </div>
  );
}

function CardSide({ children }: { children: ReactNode }) {
  return (
    <aside className="bg-paper px-gutter py-gutter">
      {children}
    </aside>
  );
}

function CardFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="col-span-full flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 bg-white px-gutter py-rhythm">
      {children}
    </footer>
  );
}

Card.Eyebrow = CardEyebrow;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Side = CardSide;
Card.Footer = CardFooter;
