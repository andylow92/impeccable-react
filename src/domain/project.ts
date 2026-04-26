import { z } from 'zod';

export const milestoneSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(3),
  owner: z.string().min(2),
  status: z.enum(['complete', 'in_progress', 'blocked'])
});

export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  client: z.string().min(2),
  budgetUsd: z.number().positive(),
  urgency: z.enum(['normal', 'high', 'critical']),
  milestones: z.array(milestoneSchema).min(1)
});

export type Milestone = z.infer<typeof milestoneSchema>;
export type Project = z.infer<typeof projectSchema>;
