import { useEffect, useState } from 'react';
import {
  countByStatus,
  isAtRisk,
  type Project,
} from '@/domain/project';
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
    return (
      <main className="grid min-h-screen place-items-center bg-paper text-base font-semibold text-ink">
        Loading project…
      </main>
    );
  }

  const counts = countByStatus(project);
  const atRisk = isAtRisk(project);
  const tone = atRisk ? 'risk' : 'authority';

  return (
    <main className="min-h-screen bg-paper px-6 py-12 text-ink">
      <div className="mx-auto grid max-w-4xl gap-8">
        <Card tone={tone}>
          <Card.Body>
            <Card.Eyebrow>Active Engagement</Card.Eyebrow>
            <Card.Title>{project.title}</Card.Title>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Metric label="Client" value={project.client} />
              <Metric label="Budget" value={formatUsd(project.budgetUsd)} />
              <Metric
                label="Urgency"
                value={project.urgency.toUpperCase()}
                tone={project.urgency === 'normal' ? 'normal' : 'accent'}
              />
              <Metric
                label="Blocking Risks"
                value={String(counts.blocked)}
                tone={counts.blocked ? 'danger' : 'normal'}
              />
            </div>
          </Card.Body>
          <Card.Side>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate">
              Execution Sequence
            </p>
            <ProgressSignal project={project} />
          </Card.Side>
          <Card.Footer>
            <p className="text-xs font-medium text-slate">
              {atRisk ? 'Schedule slipping — escalate now.' : 'On track.'}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary">Share Snapshot</Button>
              <Button variant={atRisk ? 'critical' : 'primary'}>
                {atRisk ? 'Escalate' : 'Review Scope'}
              </Button>
            </div>
          </Card.Footer>
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
  // Sharp radius on data surfaces (intentional contrast with the Card's softer
  // panel radius). Avoided: matching the parent's radius, which collapses
  // hierarchy.
  const toneClass =
    tone === 'accent' ? 'text-cobalt' : tone === 'danger' ? 'text-signal' : 'text-ink';

  return (
    <article className="rounded-sharp border border-ink/10 bg-white px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">{label}</p>
      <p className={`mt-1 text-lg font-bold ${toneClass}`}>{value}</p>
    </article>
  );
}
