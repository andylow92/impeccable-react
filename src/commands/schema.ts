import { z } from "zod";

const idSlug = z.string().regex(/^[a-z][a-z0-9-]*$/, "must be kebab-case (lowercase letters, digits, hyphens)");

/**
 * The user-facing command slug. Portable across tools, so we restrict it to
 * `/<word>` or `/<word> <subword>...` where each token is kebab-case.
 *
 * Valid: `/impeccable critique`, `/impeccable pre-ship-gate`, `/audit`.
 * Invalid: `impeccable critique` (no leading slash), `/Impeccable` (uppercase),
 *          `/impeccable  critique` (double space), `/impeccable critique!` (punctuation).
 */
const COMMAND_SLUG = /^\/[a-z][a-z0-9-]*(?: [a-z][a-z0-9-]*)*$/;

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
  id: idSlug,
  title: z.string().min(1),
  slug: z.string().regex(
    COMMAND_SLUG,
    'slug must look like "/word" or "/word subword" (lowercase kebab tokens, single spaces)',
  ),
  inputs: z.array(commandInput).default([]),
  outputs: z.array(commandOutput).default([]),
  uses_skills: z.array(idSlug).default([]),
  uses_references: z.array(idSlug).default([]),
  severity_threshold: z.enum(["warn", "fail"]).default("warn"),
});
export type CommandFrontmatter = z.infer<typeof commandFrontmatter>;
