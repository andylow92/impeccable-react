import { projectSchema, type Project } from '@/domain/project';

const simulatedResponse = {
  id: 'prj_22',
  title: 'Atlas Replatform',
  client: 'Northstar Bio',
  budgetUsd: 342000,
  urgency: 'high',
  milestones: [
    { id: 'm1', label: 'Discovery complete', owner: 'Elena', status: 'complete' },
    { id: 'm2', label: 'UI architecture', owner: 'Miguel', status: 'in_progress' },
    { id: 'm3', label: 'Contract rollout', owner: 'Priya', status: 'blocked' }
  ]
} as const;

// External data is validated at the boundary so domain/UI never consume untrusted shapes.
export async function fetchProjectCard(): Promise<Project> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return projectSchema.parse(simulatedResponse);
}
