export function GenericVsImpeccable(): JSX.Element {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-400">Generic (bad)</p>
        <h4 className="mt-2 text-lg font-semibold text-slate-500">Project Overview</h4>
        <p className="mt-2 text-sm text-slate-400">All cards share the same style, so nothing feels important.</p>
        <div className="mt-3 h-2 rounded-full bg-slate-200">
          <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-slate-300 to-slate-400" />
        </div>
      </article>

      <article className="rounded-sharp border border-ink/15 bg-white p-4 shadow-edge">
        <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-cobalt">Impeccable (good)</p>
        <h4 className="mt-2 text-2xl font-black text-ink">Delivery Readiness</h4>
        <p className="mt-2 text-sm font-medium text-slate">
          Risk and urgency are explicit. Layout favors decision-making over decoration.
        </p>
        <div className="mt-4 grid gap-2">
          <div className="rounded-sharp border border-ink/10 px-3 py-2 text-sm font-semibold text-ink">Owner: Priya · Blocked</div>
          <div className="rounded-sharp border border-ink/10 px-3 py-2 text-sm font-semibold text-ink">Owner: Elena · Complete</div>
        </div>
      </article>
    </section>
  );
}
