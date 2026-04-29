// Intentionally good. Used as a negative test fixture for the detector.
// No `any`, varied radii, no centered title + pill button SaaS-card pattern.

type Project = { title: string; client: string; budgetUsd: number };

export function ImpeccableCard({ project }: { project: Project }): JSX.Element {
  return (
    <article className="mx-auto max-w-3xl rounded-panel bg-white">
      <header className="flex items-baseline justify-between border-b border-ink/10 px-6 py-4">
        <span className="text-xs uppercase tracking-wide text-ink-soft">Active</span>
        <h2 className="text-2xl font-bold text-ink">{project.title}</h2>
      </header>
      <dl className="grid grid-cols-2 divide-x divide-ink/10">
        <div className="px-6 py-4">
          <dt className="text-xs uppercase tracking-wide text-ink-soft">Client</dt>
          <dd className="text-base font-semibold text-ink">{project.client}</dd>
        </div>
        <div className="px-6 py-4">
          <dt className="text-xs uppercase tracking-wide text-ink-soft">Budget</dt>
          <dd className="text-base font-semibold text-ink">${project.budgetUsd.toLocaleString()}</dd>
        </div>
      </dl>
      <footer className="px-6 py-4">
        <button className="rounded-sharp bg-cobalt px-4 py-2 text-sm font-medium text-white">
          Review
        </button>
      </footer>
    </article>
  );
}
