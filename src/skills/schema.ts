import { z } from "zod";

const slug = z.string().regex(/^[a-z][a-z0-9-]*$/, "slug must be kebab-case");

export const skillFrontmatter = z.object({
  id: slug,
  name: z.string().min(1),
  version: z.string().min(1),
  summary: z.string().min(1),
  voice: z.enum(["directive", "advisory", "reference"]).default("directive"),
  applies_to: z.array(z.string()).default([]),
  references: z.array(slug).default([]),
  anti_patterns: z.array(slug).default([]),
  commands: z.array(slug).default([]),
});
export type SkillFrontmatter = z.infer<typeof skillFrontmatter>;

export const referenceFrontmatter = z.object({
  id: slug,
  parent: slug,
  summary: z.string().min(1),
});
export type ReferenceFrontmatter = z.infer<typeof referenceFrontmatter>;

export const antiPatternFrontmatter = z.object({
  id: slug,
  parent: slug,
  severity: z.enum(["info", "warn", "fail"]),
  detector_rule: slug.optional(),
  summary: z.string().min(1),
});
export type AntiPatternFrontmatter = z.infer<typeof antiPatternFrontmatter>;
