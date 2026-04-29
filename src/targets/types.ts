import type { LoadedSkill } from "../skills/index.js";
import type { LoadedCommand } from "../commands/index.js";

export type RenderedFile = { path: string; contents: string };

export type RenderInput = {
  skills: LoadedSkill[];
  commands: LoadedCommand[];
};

export type TargetId = "codex" | "claude-code";

export interface TargetAdapter {
  id: TargetId;
  outDir: string;
  render(input: RenderInput): RenderedFile[];
}
