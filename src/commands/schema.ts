import { z } from "zod";

const slug = z.string().regex(/^[a-z][a-z0-9-]*$/, "slug must be kebab-case");

export const commandInput = z.object({
  name: z.string().min(1),
  kind: z.enum(["path", "selection", "url", "string", "number"]),
  required: z.boolean().default(false),
  description: z.string().min(1),
});

export const commandOutput = z.object({
  kind: z.enum(["report", "patch", "text", "diff"]),
  schema: z.string().optional(),
});

export const commandFrontmatter = z.object({
  id: slug,
  title: z.string().min(1),
  slug: z.string().min(1),
  inputs: z.array(commandInput).default([]),
  outputs: z.array(commandOutput).default([]),
  uses_skills: z.array(slug).default([]),
  uses_references: z.array(slug).default([]),
  severity_threshold: z.enum(["warn", "fail"]).default("warn"),
});
export type CommandFrontmatter = z.infer<typeof commandFrontmatter>;
