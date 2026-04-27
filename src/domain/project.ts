import { z } from 'zod';

export const milestoneSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(3),
  owner: z.string().min(2),
  status: z.enum(['complete', 'in_progress', 'blocked']),
});

export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  client: z.string().min(2),
  budgetUsd: z.number().positive(),
  urgency: z.enum(['normal', 'high', 'critical']),
  milestones: z.array(milestoneSchema).min(1),
});

export type Milestone = z.infer<typeof milestoneSchema>;
export type MilestoneStatus = Milestone['status'];
export type Project = z.infer<typeof projectSchema>;

// Pure domain rules. No React, no DOM, no I/O.
// Components import these instead of computing thresholds inline.

export function countByStatus(project: Project): Record<MilestoneStatus, number> {
  const acc: Record<MilestoneStatus, number> = { complete: 0, in_progress: 0, blocked: 0 };
  for (const m of project.milestones) acc[m.status] += 1;
  return acc;
}

export function completionRatio(project: Project): number {
  const total = project.milestones.length;
  if (total === 0) return 0;
  const complete = project.milestones.filter((m) => m.status === 'complete').length;
  return complete / total;
}

export function isAtRisk(project: Project): boolean {
  const blocked = countByStatus(project).blocked;
  return blocked > 0 && project.urgency !== 'normal';
}

export function firstBlocked(project: Project): Milestone | undefined {
  return project.milestones.find((m) => m.status === 'blocked');
}
