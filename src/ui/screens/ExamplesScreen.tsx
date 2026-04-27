import { GenericProjectCard } from '@/examples/generic-vs-impeccable/GenericProjectCard';
import { ImpeccableProjectCard } from '@/examples/generic-vs-impeccable/ImpeccableProjectCard';

/**
 * ExamplesScreen — side-by-side comparison page.
 *
 * Same data, two design postures. The point is not "the right one is prettier".
 * The point is "the right one tells you what to do next without reading the
 * labels". Look at both for 3 seconds. Notice which one you can act on.
 */
export function ExamplesScreen() {
  return (
    <main className="min-h-screen bg-paper px-6 py-10 text-ink">
      <div className="mx-auto grid max-w-6xl gap-10">
        <header className="border-b border-ink/15 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cobalt">
            Comparison
          </p>
          <h1 className="mt-1 text-3xl font-bold leading-tight">
            Generic vs. Impeccable
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate">
            Same data, opposite postures. Read each card for three seconds. The
            one that tells you what to do next is the one that wins.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <Column
            heading="Generic"
            subheading="The AI default. Reject this output."
            tone="warn"
          >
            <GenericProjectCard />
          </Column>
          <Column
            heading="Impeccable"
            subheading="Hierarchy, accountability, intent."
            tone="ok"
          >
            <ImpeccableProjectCard />
          </Column>
        </section>
      </div>
    </main>
  );
}

function Column({
  heading,
  subheading,
  tone,
  children,
}: {
  heading: string;
  subheading: string;
  tone: 'ok' | 'warn';
  children: React.ReactNode;
}) {
  const accent = tone === 'ok' ? 'border-cobalt' : 'border-signal';
  return (
    <div className="grid gap-4">
      <div className={`border-l-4 pl-3 ${accent}`}>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate">
          {heading}
        </p>
        <p className="text-sm font-semibold text-ink">{subheading}</p>
      </div>
      {children}
    </div>
  );
}
