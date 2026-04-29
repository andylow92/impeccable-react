import ts from "typescript";
import type { DetectorNode, Document, SourceLoc } from "../rules/types.js";

export function parseTsx(uri: string, source: string): Document {
  const sf = ts.createSourceFile(uri, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const root: DetectorNode = { kind: "root", children: [], loc: locOf(sf, sf) };
  walk(sf, sf, root);
  return { uri, language: "tsx", root, raw: source };
}

export function parseTs(uri: string, source: string): Document {
  const sf = ts.createSourceFile(uri, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const root: DetectorNode = { kind: "root", children: [], loc: locOf(sf, sf) };
  walk(sf, sf, root);
  return { uri, language: "ts", root, raw: source };
}

function walk(sf: ts.SourceFile, node: ts.Node, parent: DetectorNode): void {
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
    const opening = ts.isJsxElement(node) ? node.openingElement : node;
    const tag = opening.tagName.getText(sf);
    const attrs: Record<string, string> = {};
    for (const a of opening.attributes.properties) {
      if (!ts.isJsxAttribute(a) || !a.name) continue;
      const name = a.name.getText(sf);
      const init = a.initializer;
      if (init === undefined) {
        attrs[name] = "true";
      } else if (ts.isStringLiteral(init)) {
        attrs[name] = init.text;
      } else if (ts.isJsxExpression(init) && init.expression) {
        attrs[name] = stripQuotes(init.expression.getText(sf));
      }
    }
    const me: DetectorNode = {
      kind: "element",
      name: tag,
      attrs,
      children: [],
      loc: locOf(sf, node),
    };
    parent.children!.push(me);
    if (ts.isJsxElement(node)) for (const c of node.children) walk(sf, c, me);
    return;
  }

  // capture `: any`, `as any`, `<any>`
  if (
    (ts.isTypeReferenceNode(node) && node.typeName.getText(sf) === "any") ||
    node.kind === ts.SyntaxKind.AnyKeyword
  ) {
    parent.children!.push({
      kind: "ts-any",
      value: node.getText(sf),
      loc: locOf(sf, node),
    });
  }

  if (ts.isCallExpression(node)) {
    parent.children!.push({
      kind: "ts-call",
      name: node.expression.getText(sf),
      value: node.getText(sf),
      loc: locOf(sf, node),
    });
  }

  ts.forEachChild(node, (c) => walk(sf, c, parent));
}

function stripQuotes(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")) || (t.startsWith("`") && t.endsWith("`"))) {
    return t.slice(1, -1);
  }
  return t;
}

function locOf(sf: ts.SourceFile, node: ts.Node): SourceLoc {
  const pos = node.getStart === undefined ? 0 : node.getStart(sf);
  const { line, character } = sf.getLineAndCharacterOfPosition(pos);
  return { file: sf.fileName, line: line + 1, column: character + 1 };
}
