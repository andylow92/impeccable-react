import { useEffect, useRef, useState } from 'react';
import {
  countByStatus,
  isAtRisk,
  type Project,
} from '@/domain/project';
import { fetchProjects } from '@/lib/api';
import { formatUsd } from '@/lib/format';
import { designGuard, reportToConsole } from '@/lib/designGuard';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { ProgressSignal } from '@/ui/components/ProgressSignal';

/**
 * DashboardScreen — the visual test page.
 *
 * Renders every component in a realistic context, not in isolation. If the UI
 * still looks like a template here (with three projects, multiple risk levels,
 * and the full action rail), the components are wrong.
 *
 * Also wires up `designGuard` in development mode to flag generic patterns
 * automatically.
 */
export function DashboardScreen() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    void fetchProjects().then(setProjects);
  }, []);

  useEffect(() => {
    if (!projects || !root.current) return;
    if (!import.meta.env.DEV) return;
    reportToConsole(designGuard(root.current));
  }, [projects]);

  if (!projects) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper text-base font-semibold text-ink">
        Loading dashboard…
      </main>
    );
  }

  const totals = projects.reduce(
    (acc, p) => {
      const c = countByStatus(p);
      return {
        active: acc.active + 1,
        blocked: acc.blocked + c.blocked,
        budget: acc.budget + p.budgetUsd,
        atRisk: acc.atRisk + (isAtRisk(p) ? 1 : 0),
      };
    },
    { active: 0, blocked: 0, budget: 0, atRisk: 0 },
  );

  return (
    <main ref={root} className="min-h-screen bg-paper px-6 py-10 text-ink">
      <div className="mx-auto grid max-w-6xl gap-10">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cobalt">
              Engagement Operations
            </p>
            <h1 className="mt-1 text-3xl font-bold leading-tight">This week's portfolio</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary">Export</Button>
            <Button variant="primary">New engagement</Button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-4">
          <Stat label="Active" value={String(totals.active)} />
          <Stat
            label="At Risk"
            value={String(totals.atRisk)}
            tone={totals.atRisk ? 'danger' : 'normal'}
          />
          <Stat label="Blocked Milestones" value={String(totals.blocked)} tone="accent" />
          <Stat label="Portfolio Budget" value={formatUsd(totals.budget)} />
        </section>

        <section className="grid gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      </div>
    </main>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const counts = countByStatus(project);
  const atRisk = isAtRisk(project);
  return (
    <Card tone={atRisk ? 'risk' : project.urgency === 'normal' ? 'authority' : 'action'}>
      <Card.Body>
        <Card.Eyebrow>{project.client}</Card.Eyebrow>
        <Card.Title>{project.title}</Card.Title>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Tile label="Budget" value={formatUsd(project.budgetUsd)} />
          <Tile
            label="Urgency"
            value={project.urgency.toUpperCase()}
            tone={project.urgency === 'normal' ? 'normal' : 'accent'}
          />
          <Tile
            label="Blocked"
            value={String(counts.blocked)}
            tone={counts.blocked ? 'danger' : 'normal'}
          />
          <Tile label="Done" value={`${counts.complete}/${project.milestones.length}`} />
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
          {atRisk
            ? 'Schedule slipping — escalate now.'
            : counts.blocked
              ? 'Blocker present, owners assigned.'
              : 'On track.'}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary">Snapshot</Button>
          <Button variant={atRisk ? 'critical' : 'primary'}>
            {atRisk ? 'Escalate' : 'Open'}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}

function Stat({
  label,
  value,
  tone = 'normal',
}: {
  label: string;
  value: string;
  tone?: 'normal' | 'accent' | 'danger';
}) {
  const toneClass =
    tone === 'accent' ? 'text-cobalt' : tone === 'danger' ? 'text-signal' : 'text-ink';
  return (
    <article className="rounded-sharp border border-ink/15 bg-white px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
    </article>
  );
}

function Tile({
  label,
  value,
  tone = 'normal',
}: {
  label: string;
  value: string;
  tone?: 'normal' | 'accent' | 'danger';
}) {
  const toneClass =
    tone === 'accent' ? 'text-cobalt' : tone === 'danger' ? 'text-signal' : 'text-ink';
  return (
    <article className="rounded-sharp border border-ink/10 bg-white px-3 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">{label}</p>
      <p className={`mt-1 text-lg font-bold ${toneClass}`}>{value}</p>
    </article>
  );
}
