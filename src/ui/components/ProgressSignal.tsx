import type { Milestone, MilestoneStatus, Project } from '@/domain/project';
import { countByStatus, firstBlocked } from '@/domain/project';

/**
 * ProgressSignal — replaces the generic % progress bar.
 *
 * Avoided:
 *   - A horizontal gradient bar showing "67%". A bar communicates motion, not
 *     accountability. It hides who is blocked, what is blocked, and why.
 *   - A row of identical pill-tags (the AI-default "stepper").
 *
 * Decisions made instead:
 *   - A vertical execution column with a connector line that *visually breaks*
 *     at blocked milestones. Flow disruption is rendered, not merely labeled.
 *   - A plain-language summary at the top: "2 of 5 done · blocked at Contract
 *     rollout (Priya)". The user reads accountability before reading the chart.
 *   - Status nodes vary in shape per status: filled disc (complete), ring
 *     (in progress), bracketed square (blocked). Color is reinforcement, not
 *     the only signal — works at low contrast and for color-blind users.
 *   - Owner names are first-class, not metadata captions.
 */

type ProgressSignalProps = {
  project: Project;
};

export function ProgressSignal({ project }: ProgressSignalProps) {
  const counts = countByStatus(project);
  const blocked = firstBlocked(project);
  const total = project.milestones.length;

  return (
    <div className="grid gap-4">
      <ExecutionSummary
        completeCount={counts.complete}
        total={total}
        blocked={blocked}
      />
      <ol className="relative grid gap-0">
        {project.milestones.map((milestone, index) => (
          <ExecutionRow
            key={milestone.id}
            milestone={milestone}
            index={index}
            isLast={index === project.milestones.length - 1}
            nextStatus={project.milestones[index + 1]?.status}
          />
        ))}
      </ol>
    </div>
  );
}

function ExecutionSummary({
  completeCount,
  total,
  blocked,
}: {
  completeCount: number;
  total: number;
  blocked: Milestone | undefined;
}) {
  return (
    <div className="grid gap-1 border-l-2 border-ink pl-3">
      <p className="text-sm font-semibold text-ink">
        {completeCount} of {total} milestones complete
      </p>
      <p className="text-xs font-medium text-slate">
        {blocked
          ? `Blocked at "${blocked.label}" — owner ${blocked.owner}`
          : 'No active blockers'}
      </p>
    </div>
  );
}

function ExecutionRow({
  milestone,
  index,
  isLast,
  nextStatus,
}: {
  milestone: Milestone;
  index: number;
  isLast: boolean;
  nextStatus: MilestoneStatus | undefined;
}) {
  // The connector line breaks (becomes dashed) when flow is interrupted by a
  // blocked milestone — disruption is visualized, not just labeled.
  const connectorClass =
    milestone.status === 'blocked' || nextStatus === 'blocked'
      ? 'border-l border-dashed border-signal'
      : 'border-l border-solid border-ink/25';

  return (
    <li className="grid grid-cols-[28px_1fr_auto] items-start gap-3 pb-4 last:pb-0">
      <div className="relative flex justify-center">
        <StatusGlyph status={milestone.status} />
        {!isLast && (
          <span
            className={`absolute left-1/2 top-6 h-full -translate-x-1/2 ${connectorClass}`}
            aria-hidden
          />
        )}
      </div>
      <div className="grid gap-0.5">
        <p className="text-sm font-semibold text-ink">{milestone.label}</p>
        <p className="text-xs font-medium text-slate">
          <span className="text-ink/70">{milestone.owner}</span>
          <span className="px-1.5 text-ink/30">·</span>
          {STATUS_COPY[milestone.status]}
        </p>
      </div>
      <span className="font-mono text-xs font-bold text-ink/60">
        {String(index + 1).padStart(2, '0')}
      </span>
    </li>
  );
}

const STATUS_COPY: Record<MilestoneStatus, string> = {
  complete: 'Done',
  in_progress: 'In flight',
  blocked: 'Blocked',
};

function StatusGlyph({ status }: { status: MilestoneStatus }) {
  // Shape encodes status in addition to color, so the rail still reads at
  // grayscale and for color-blind users.
  if (status === 'complete') {
    return <span className="mt-0.5 block h-3 w-3 rounded-full bg-ink" aria-hidden />;
  }
  if (status === 'in_progress') {
    return (
      <span
        className="mt-0.5 block h-3 w-3 rounded-full border-2 border-cobalt bg-white"
        aria-hidden
      />
    );
  }
  return (
    <span
      className="mt-0.5 block h-3 w-3 rotate-45 border-2 border-signal bg-white"
      aria-hidden
    />
  );
}
