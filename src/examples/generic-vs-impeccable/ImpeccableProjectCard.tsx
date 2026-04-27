/**
 * ImpeccableProjectCard — the rewrite of GenericProjectCard.tsx.
 *
 * What changed, and why:
 *
 *   1. Removed the centered hero gradient. Gradients should encode state, not
 *      decorate the top of every card.
 *   2. Replaced the single rounded rectangle with a structured layout: an
 *      accent rail on the left (encodes priority/risk) plus a 2-column
 *      body+side composition. The card has a side, not just a top.
 *   3. Two intentional radii: `rounded-panel` outside, `rounded-sharp` on data
 *      tiles. Hierarchy is visible at a glance.
 *   4. One elevated surface (the card itself). Inner tiles use borders, not
 *      shadows. Depth means something again.
 *   5. Stat tiles use ink-bold values, slate micro-labels — three text tiers
 *      visible without thinking.
 *   6. The progress bar is gone. In its place: a status-rail that names the
 *      blocked milestone and its owner. Accountability is rendered.
 *   7. CTA hierarchy: secondary "Share Snapshot" vs primary "Review Scope".
 *      Sharp radius, no pill, no shadow.
 *   8. When the project is at risk, the primary CTA flips to `critical`
 *      ("Escalate") and the rail tone shifts to `risk`. Color reinforces
 *      decision pressure.
 */

import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { ProgressSignal } from '@/ui/components/ProgressSignal';
import {
  countByStatus,
  isAtRisk,
  type Project,
} from '@/domain/project';
import { formatUsd } from '@/lib/format';

const sample: Project = {
  id: 'prj_22',
  title: 'Atlas Replatform',
  client: 'Northstar Bio',
  budgetUsd: 342000,
  urgency: 'high',
  milestones: [
    { id: 'm1', label: 'Discovery complete', owner: 'Elena', status: 'complete' },
    { id: 'm2', label: 'UI architecture', owner: 'Miguel', status: 'in_progress' },
    { id: 'm3', label: 'Contract rollout', owner: 'Priya', status: 'blocked' },
  ],
};

export function ImpeccableProjectCard() {
  const counts = countByStatus(sample);
  const atRisk = isAtRisk(sample);

  return (
    <Card tone={atRisk ? 'risk' : 'authority'}>
      <Card.Body>
        <Card.Eyebrow>Active Engagement</Card.Eyebrow>
        <Card.Title>{sample.title}</Card.Title>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Tile label="Client" value={sample.client} />
          <Tile label="Budget" value={formatUsd(sample.budgetUsd)} />
          <Tile label="Urgency" value={sample.urgency.toUpperCase()} tone="accent" />
          <Tile
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
        <ProgressSignal project={sample} />
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
