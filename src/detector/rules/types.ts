export type Severity = "info" | "warn" | "fail";

export type SourceLoc = {
  file: string;
  line: number;
  column: number;
};

export type DetectorNode = {
  /** "root" | "element" | "attribute" | "text" | "ts-call" */
  kind: string;
  name?: string;
  value?: string;
  attrs?: Record<string, string>;
  children?: DetectorNode[];
  loc: SourceLoc;
};

export type Document = {
  uri: string;
  language: "tsx" | "jsx" | "ts" | "js" | "html" | "css";
  root: DetectorNode;
  raw: string;
};

export type Finding = {
  rule: string;
  severity: Severity;
  message: string;
  loc: SourceLoc;
  fix?: { description: string; patch?: string };
  antiPattern?: string;
};

export type EmittedFinding = Omit<Finding, "rule">;

export type RuleContext = {
  doc: Document;
  emit: (f: EmittedFinding) => void;
  options: Record<string, unknown>;
};

export interface Rule {
  id: string;
  description: string;
  defaultSeverity: Severity;
  appliesTo: ReadonlyArray<Document["language"]>;
  run(ctx: RuleContext): void;
}

export function walkNodes(node: DetectorNode, fn: (n: DetectorNode) => void): void {
  fn(node);
  for (const child of node.children ?? []) walkNodes(child, fn);
}
