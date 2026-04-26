import { useEffect, useState } from 'react';
import type { Project } from '@/domain/project';
import { fetchProjectCard } from '@/lib/api';
import { formatUsd } from '@/lib/format';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { ProgressSignal } from '@/ui/components/ProgressSignal';

export function ProjectScreen() {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    void fetchProjectCard().then(setProject);
  }, []);

  if (!project) {
    return <main className="grid min-h-screen place-items-center text-base font-semibold text-ink">Loading project…</main>;
  }

  const blockedCount = project.milestones.filter((item) => item.status === 'blocked').length;

  return (
    <main className="min-h-screen bg-paper px-6 py-12 text-ink">
      <div className="mx-auto grid max-w-4xl gap-8">
        <Card eyebrow="Active Engagement" title={project.title}>
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <section className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Metric label="Client" value={project.client} />
                <Metric label="Budget" value={formatUsd(project.budgetUsd)} />
                <Metric label="Urgency" value={project.urgency.toUpperCase()} tone="accent" />
                <Metric label="Blocking Risks" value={String(blockedCount)} tone={blockedCount ? 'danger' : 'normal'} />
              </div>
              <div className="flex gap-3">
                <Button>Review Scope</Button>
                <Button variant="secondary">Share Snapshot</Button>
              </div>
            </section>
            <section className="rounded-sharp border border-ink/10 bg-paper p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-slate">Execution Sequence</p>
              <ProgressSignal milestones={project.milestones} />
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}

type MetricProps = {
  label: string;
  value: string;
  tone?: 'normal' | 'accent' | 'danger';
};

function Metric({ label, value, tone = 'normal' }: MetricProps) {
  const toneClass =
    tone === 'accent' ? 'text-cobalt' : tone === 'danger' ? 'text-signal' : 'text-ink';

  return (
    <article className="rounded-sharp border border-ink/10 bg-white px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">{label}</p>
      <p className={`mt-1 text-lg font-bold ${toneClass}`}>{value}</p>
    </article>
  );
}
