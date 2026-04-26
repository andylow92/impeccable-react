import type { Milestone } from '@/domain/project';

type ProgressSignalProps = {
  milestones: Milestone[];
};

const statusTone: Record<Milestone['status'], string> = {
  complete: 'bg-emerald-500',
  in_progress: 'bg-cobalt',
  blocked: 'bg-signal'
};

export function ProgressSignal({ milestones }: ProgressSignalProps) {
  return (
    <ol className="grid gap-3">
      {/* Reimagined progress: status rail list, not a decorative percentage bar.
          Avoided: generic gradient bars that hide accountability details. */}
      {milestones.map((item, index) => (
        <li key={item.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-sharp border border-ink/10 px-3 py-2">
          <span className={`h-2.5 w-2.5 rounded-full ${statusTone[item.status]}`} aria-hidden />
          <div>
            <p className="text-sm font-semibold text-ink">{item.label}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate">Owner: {item.owner}</p>
          </div>
          <span className="text-xs font-bold text-ink/70">{String(index + 1).padStart(2, '0')}</span>
        </li>
      ))}
    </ol>
  );
}
