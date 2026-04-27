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
    { id: 'm3', label: 'Contract rollout', owner: 'Priya', status: 'blocked' },
  ],
} as const;

const dashboardResponse = [
  simulatedResponse,
  {
    id: 'prj_23',
    title: 'Helios Billing API',
    client: 'Brightline Energy',
    budgetUsd: 188000,
    urgency: 'normal',
    milestones: [
      { id: 'm1', label: 'Contracts signed', owner: 'Sara', status: 'complete' },
      { id: 'm2', label: 'Schema migration', owner: 'Tomas', status: 'complete' },
      { id: 'm3', label: 'Cutover plan', owner: 'Hank', status: 'in_progress' },
      { id: 'm4', label: 'Legacy retire', owner: 'Hank', status: 'in_progress' },
    ],
  },
  {
    id: 'prj_24',
    title: 'Kestrel Onboarding',
    client: 'Vega Labs',
    budgetUsd: 96000,
    urgency: 'critical',
    milestones: [
      { id: 'm1', label: 'Discovery', owner: 'Lin', status: 'complete' },
      { id: 'm2', label: 'Design system', owner: 'Lin', status: 'blocked' },
      { id: 'm3', label: 'Beta release', owner: 'Marc', status: 'blocked' },
    ],
  },
] as const;

// External data is validated at the boundary so domain/UI never consume
// untrusted shapes.
export async function fetchProjectCard(): Promise<Project> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return projectSchema.parse(simulatedResponse);
}

export async function fetchProjects(): Promise<Project[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return dashboardResponse.map((row) => projectSchema.parse(row));
}
