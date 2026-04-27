import type { Milestone } from '@/domain/project';

type ProgressSignalProps = {
  milestones: Milestone[];
};

const statusTone: Record<Milestone['status'], { dot: string; label: string }> = {
  complete: { dot: 'bg-emerald-500', label: 'Complete' },
  in_progress: { dot: 'bg-cobalt', label: 'In Progress' },
  blocked: { dot: 'bg-signal', label: 'Blocked' }
};

export function ProgressSignal({ milestones }: ProgressSignalProps) {
  return (
    <ol className="grid gap-3">
      {/* Avoided generic pattern: anonymous horizontal progress bars with % only.
          Design decision: timeline rows expose owner + state so teams can act, not just observe. */}
      {milestones.map((item, index) => {
        const tone = statusTone[item.status];
        return (
          <li key={item.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-sharp border border-ink/10 bg-white px-3 py-3">
            <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} aria-hidden />
            <div>
              <p className="text-sm font-bold text-ink">{item.label}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate">{item.owner}</p>
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/70">
              {String(index + 1).padStart(2, '0')} · {tone.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
