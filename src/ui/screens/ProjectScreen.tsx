import { useEffect, useMemo, useState } from 'react';
import type { DesignWarning } from '../../../lib/designGuard';
import { runDesignGuard } from '../../../lib/designGuard';
import type { Project } from '@/domain/project';
import { fetchProjectCard } from '@/lib/api';
import { formatUsd } from '@/lib/format';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { ProgressSignal } from '@/ui/components/ProgressSignal';
import { GenericVsImpeccable } from '@/ui/screens/GenericVsImpeccable';
import { VisualTestPage } from '@/ui/screens/VisualTestPage';

export function ProjectScreen() {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    void fetchProjectCard().then(setProject);
  }, []);

  const warnings = useMemo<DesignWarning[]>(() => {
    return runDesignGuard({
      textOnSurfacePairs: [
        { text: '#0A1020', surface: '#FFFFFF', usage: 'primary' },
        { text: '#1D2A44', surface: '#F6F8FC', usage: 'secondary' },
        { text: '#2051F7', surface: '#FFFFFF', usage: 'tertiary' }
      ],
      spacingScalePx: [8, 12, 16, 24, 32],
      containers: [
        { id: 'screen', radiusPx: 14, shadowStrength: 'medium' },
        { id: 'metrics', radiusPx: 4, shadowStrength: 'none' },
        { id: 'timeline', radiusPx: 4, shadowStrength: 'none' },
        { id: 'actions', radiusPx: 4, shadowStrength: 'none' }
      ]
    });
  }, []);

  if (!project) {
    return <main className="grid min-h-screen place-items-center text-base font-semibold text-ink">Loading project…</main>;
  }

  const blockedCount = project.milestones.filter((item) => item.status === 'blocked').length;

  return (
    <main className="min-h-screen bg-paper px-6 py-12 text-ink">
      <div className="mx-auto grid max-w-5xl gap-8">
        <DesignGuardPanel warnings={warnings} />

        <VisualTestPage />

        <GenericVsImpeccable />

        <Card
          eyebrow="Active Engagement"
          title={project.title}
          summary="A deliberate project card: context first, decisive metrics second, execution accountability on the right."
          aside={<Badge label="Risk" value={blockedCount ? 'Escalated' : 'Stable'} tone={blockedCount ? 'danger' : 'normal'} />}
        >
          <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
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
      <p className={`mt-1 text-xl font-black ${toneClass}`}>{value}</p>
    </article>
  );
}

type BadgeProps = {
  label: string;
  value: string;
  tone: 'normal' | 'danger';
};

function Badge({ label, value, tone }: BadgeProps) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate">{label}</p>
      <p className={`mt-1 text-sm font-black ${tone === 'danger' ? 'text-signal' : 'text-emerald-600'}`}>{value}</p>
    </div>
  );
}

function DesignGuardPanel({ warnings }: { warnings: DesignWarning[] }) {
  if (!warnings.length) {
    return (
      <section className="rounded-sharp border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
        Design Guard: all heuristic checks passed.
      </section>
    );
  }

  return (
    <section className="rounded-sharp border border-signal/40 bg-orange-50 px-4 py-3">
      <p className="text-sm font-black uppercase tracking-[0.12em] text-signal">Design Guard Warnings</p>
      <ul className="mt-2 list-disc pl-5 text-sm font-semibold text-ink">
        {warnings.map((warning) => (
          <li key={`${warning.rule}-${warning.message}`}>{warning.message}</li>
        ))}
      </ul>
    </section>
  );
}
