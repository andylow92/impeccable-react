// Negative fixture. Container looks card-like at a glance (rounded-2xl,
// shadow-md) but uses segmented layout (border-b, divide-x) and varied
// inner radii — i.e. it is NOT a generic SaaS card. The detector must
// not flag this.

type Project = { title: string; client: string; budgetUsd: number };

export function CompositionalCard({ project }: { project: Project }): JSX.Element {
  return (
    <article className="mx-auto max-w-3xl rounded-2xl bg-white shadow-md">
      <header className="flex items-baseline justify-between border-b border-ink/10 px-6 py-4">
        <span className="rounded-sharp bg-cobalt-soft px-2 py-1 text-xs uppercase tracking-wide text-ink">
          Active
        </span>
        <h2 className="text-2xl font-bold text-ink">{project.title}</h2>
      </header>
      <dl className="grid grid-cols-2 divide-x divide-ink/10">
        <div className="px-6 py-4">
          <dt className="text-xs uppercase tracking-wide text-ink-soft">Client</dt>
          <dd className="text-base font-semibold text-ink">{project.client}</dd>
        </div>
        <div className="px-6 py-4">
          <dt className="text-xs uppercase tracking-wide text-ink-soft">Budget</dt>
          <dd className="text-base font-semibold text-ink">
            ${project.budgetUsd.toLocaleString()}
          </dd>
        </div>
      </dl>
      <footer className="border-t border-ink/10 px-6 py-4">
        <button className="rounded-sharp bg-cobalt px-4 py-2 text-sm font-medium text-white">
          Review
        </button>
      </footer>
    </article>
  );
}
