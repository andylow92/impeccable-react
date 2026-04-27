import { Button } from '@/ui/components/Button';

export function VisualTestPage(): JSX.Element {
  return (
    <section className="grid gap-4 rounded-panel border border-ink/10 bg-white p-6 shadow-edge">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-cobalt">Visual Test Context</p>
        <h3 className="mt-1 text-2xl font-black text-ink">Operations Snapshot</h3>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-sharp border border-ink/10 bg-paper p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate">Active Streams</p>
          <p className="mt-1 text-2xl font-black text-ink">12</p>
        </article>
        <article className="rounded-sharp border border-ink/10 bg-paper p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate">Escalations</p>
          <p className="mt-1 text-2xl font-black text-signal">3</p>
        </article>
        <article className="rounded-sharp border border-ink/10 bg-paper p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate">Resolution SLA</p>
          <p className="mt-1 text-2xl font-black text-cobalt">94%</p>
        </article>
      </div>

      <div className="flex gap-3">
        <Button>Open triage board</Button>
        <Button variant="secondary">Export briefing</Button>
      </div>
    </section>
  );
}
