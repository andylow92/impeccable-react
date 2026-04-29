// Intentionally bad. Exercises every shape of `any` that the parser
// must surface for ts-no-any. Each occurrence below should produce a
// finding.

type AliasAny = any;
type DictOfAny = Record<string, any>;
type PromiseAny = Promise<any>;
type ListOfAny = Array<any>;

function takesAny(input: any): any {
  return input;
}

function asAny(x: unknown): string {
  return (x as any).foo;
}

const arr: any[] = [];
const tup: [any, number] = [null, 1];
const cb: (v: any) => void = () => {};

export function AnyComponent({ payload }: { payload: any }): JSX.Element {
  const items: Array<any> = payload?.items ?? [];
  const generic: Map<string, any> = new Map();
  return (
    <div>
      {items.length} {generic.size} {takesAny(arr)} {tup[0]} {String(cb)}
      {/* string and comment occurrences must NOT be flagged: "any" "any" any */}
      <span data-tag="any-name">any</span>
    </div>
  );
}

const aliased: AliasAny = "still bad through the alias";
const dict: DictOfAny = {};
const list: ListOfAny = [];
const p: PromiseAny = Promise.resolve();

export const exported = { aliased, dict, list, p };
