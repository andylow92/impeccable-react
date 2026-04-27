/**
 * designGuard: dev-time heuristics that flag generic-AI UI before it ships.
 *
 * It is intentionally simple. It will miss subtle issues, but it catches the
 * patterns that make AI-generated React UIs look like template kits:
 *   - low contrast text
 *   - uniform border-radius across every container
 *   - uniform shadow across every elevated surface
 *   - too many similar-sized "card" rectangles in the same viewport
 *   - inconsistent spacing tokens
 *
 * Run it from the browser devtools or wire it into a dev-only effect.
 *
 *   import { designGuard } from '@/lib/designGuard';
 *   designGuard(document.body);
 */

export type GuardSeverity = 'warn' | 'fail';

export type GuardFinding = {
  severity: GuardSeverity;
  rule: string;
  message: string;
  element?: Element;
};

export type GuardReport = {
  findings: GuardFinding[];
  passed: boolean;
};

type GuardOptions = {
  /** Maximum number of distinct radii allowed in a viewport. Defaults to 3. */
  maxDistinctRadii?: number;
  /** Maximum number of distinct shadow strings allowed. Defaults to 3. */
  maxDistinctShadows?: number;
  /** Required minimum contrast ratio for body text. Defaults to 4.5. */
  minBodyContrast?: number;
  /** Required minimum contrast ratio for UI surfaces (buttons, etc). Defaults to 3. */
  minUiContrast?: number;
  /** Number of similarly sized card-like rectangles before we flag template-feel. Defaults to 6. */
  maxSimilarCards?: number;
};

const DEFAULTS: Required<GuardOptions> = {
  maxDistinctRadii: 3,
  maxDistinctShadows: 3,
  minBodyContrast: 4.5,
  minUiContrast: 3,
  maxSimilarCards: 6,
};

/**
 * Run all heuristics against a root element and return a structured report.
 * Pure function: no console output, no DOM mutation.
 */
export function designGuard(root: Element, options: GuardOptions = {}): GuardReport {
  const opts = { ...DEFAULTS, ...options };
  const findings: GuardFinding[] = [
    ...checkRadii(root, opts.maxDistinctRadii),
    ...checkShadows(root, opts.maxDistinctShadows),
    ...checkContrast(root, opts.minBodyContrast),
    ...checkSimilarCards(root, opts.maxSimilarCards),
    ...checkSpacingRhythm(root),
  ];

  return {
    findings,
    passed: findings.every((f) => f.severity !== 'fail'),
  };
}

/**
 * Convenience wrapper: print the report to the console with grouping.
 * Returns the report so callers can still inspect it programmatically.
 */
export function reportToConsole(report: GuardReport): GuardReport {
  if (report.findings.length === 0) {
    // eslint-disable-next-line no-console
    console.info('[designGuard] no issues found');
    return report;
  }

  // eslint-disable-next-line no-console
  console.groupCollapsed(
    `[designGuard] ${report.findings.length} finding(s) — ${report.passed ? 'warnings only' : 'FAIL'}`,
  );
  for (const finding of report.findings) {
    const emit = finding.severity === 'fail' ? console.error : console.warn;
    // eslint-disable-next-line no-console
    emit(`[${finding.rule}] ${finding.message}`, finding.element ?? '');
  }
  // eslint-disable-next-line no-console
  console.groupEnd();
  return report;
}

// ---------------------------------------------------------------------------
// Heuristic: radius variety
// ---------------------------------------------------------------------------

function checkRadii(root: Element, max: number): GuardFinding[] {
  const radii = new Map<string, number>();
  for (const el of root.querySelectorAll<HTMLElement>('*')) {
    const r = getComputedStyle(el).borderRadius;
    if (!r || r === '0px') continue;
    radii.set(r, (radii.get(r) ?? 0) + 1);
  }

  const findings: GuardFinding[] = [];
  if (radii.size === 1 && (radii.values().next().value ?? 0) > 4) {
    findings.push({
      severity: 'fail',
      rule: 'radius/uniform',
      message:
        'Every rounded element shares the same border-radius. Hierarchy is collapsed. ' +
        'Use sharp radii for data surfaces and softer radii for grouping panels.',
    });
  } else if (radii.size > max) {
    findings.push({
      severity: 'warn',
      rule: 'radius/scattered',
      message: `Detected ${radii.size} distinct border-radius values. Consolidate to a token scale (≤ ${max}).`,
    });
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Heuristic: shadow variety
// ---------------------------------------------------------------------------

function checkShadows(root: Element, max: number): GuardFinding[] {
  const shadows = new Map<string, number>();
  for (const el of root.querySelectorAll<HTMLElement>('*')) {
    const s = getComputedStyle(el).boxShadow;
    if (!s || s === 'none') continue;
    shadows.set(s, (shadows.get(s) ?? 0) + 1);
  }

  const findings: GuardFinding[] = [];
  if (shadows.size === 1) {
    const count = shadows.values().next().value ?? 0;
    if (count >= 4) {
      findings.push({
        severity: 'warn',
        rule: 'shadow/uniform',
        message:
          `${count} elements share the same shadow. Depth no longer signals priority. ` +
          'Limit elevation to one or two surfaces per screen.',
      });
    }
  } else if (shadows.size > max) {
    findings.push({
      severity: 'warn',
      rule: 'shadow/scattered',
      message: `Detected ${shadows.size} distinct shadow values. Consolidate to ≤ ${max}.`,
    });
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Heuristic: contrast
// ---------------------------------------------------------------------------

function checkContrast(root: Element, minBody: number): GuardFinding[] {
  const findings: GuardFinding[] = [];
  const candidates = root.querySelectorAll<HTMLElement>(
    'p, span, h1, h2, h3, h4, h5, h6, li, a, button, label, dt, dd',
  );

  for (const el of candidates) {
    if (!el.textContent || el.textContent.trim().length < 2) continue;
    const fg = parseColor(getComputedStyle(el).color);
    const bg = resolveBackground(el);
    if (!fg || !bg) continue;
    const ratio = contrastRatio(fg, bg);
    if (ratio < minBody) {
      findings.push({
        severity: 'fail',
        rule: 'contrast/body',
        message: `Contrast ratio ${ratio.toFixed(2)} is below ${minBody}. Text becomes filler, not signal.`,
        element: el,
      });
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Heuristic: too many similar cards (template feel)
// ---------------------------------------------------------------------------

function checkSimilarCards(root: Element, max: number): GuardFinding[] {
  const buckets = new Map<string, number>();
  for (const el of root.querySelectorAll<HTMLElement>('section, article, div')) {
    const cs = getComputedStyle(el);
    if (cs.boxShadow === 'none' && cs.borderStyle === 'none') continue;
    if (cs.borderRadius === '0px' && cs.boxShadow === 'none') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 80 || rect.height < 60) continue;
    const key = [
      cs.borderRadius,
      cs.boxShadow,
      cs.backgroundColor,
      Math.round(rect.width / 40),
      Math.round(rect.height / 40),
    ].join('|');
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const findings: GuardFinding[] = [];
  for (const [, count] of buckets) {
    if (count >= max) {
      findings.push({
        severity: 'warn',
        rule: 'composition/template',
        message:
          `UI looks template-like: ${count} similar containers detected (same radius, shadow, size). ` +
          'Vary structure or remove redundant cards.',
      });
      break;
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Heuristic: spacing rhythm
// ---------------------------------------------------------------------------

function checkSpacingRhythm(root: Element): GuardFinding[] {
  const values = new Set<string>();
  for (const el of root.querySelectorAll<HTMLElement>('*')) {
    const cs = getComputedStyle(el);
    for (const prop of ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] as const) {
      const v = cs[prop];
      if (!v || v === '0px') continue;
      values.add(v);
    }
  }

  if (values.size > 12) {
    return [
      {
        severity: 'warn',
        rule: 'spacing/no-rhythm',
        message:
          `Detected ${values.size} distinct padding values. Spacing is hand-tuned, not tokenized. ` +
          'Consolidate to a rhythm scale (e.g. rhythm, gutter, gap-2, gap-4).',
      },
    ];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Color math (WCAG)
// ---------------------------------------------------------------------------

type RGB = readonly [number, number, number];

function parseColor(value: string): RGB | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m || !m[1]) return null;
  const parts = m[1].split(',').map((p) => parseFloat(p.trim()));
  if (parts.length < 3) return null;
  const [r, g, b, a] = parts;
  if (r === undefined || g === undefined || b === undefined) return null;
  if (a !== undefined && a < 0.05) return null;
  return [r, g, b] as const;
}

function resolveBackground(el: Element): RGB | null {
  let cur: Element | null = el;
  while (cur) {
    const bg = parseColor(getComputedStyle(cur as HTMLElement).backgroundColor);
    if (bg) return bg;
    cur = cur.parentElement;
  }
  return [255, 255, 255] as const;
}

function relativeLuminance([r, g, b]: RGB): number {
  const [R, G, B] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }) as [number, number, number];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
