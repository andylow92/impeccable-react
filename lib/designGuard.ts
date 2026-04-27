export type HexColor = `#${string}`;

export type ContainerShape = {
  id: string;
  radiusPx: number;
  shadowStrength: 'none' | 'soft' | 'medium' | 'hard';
};

export type DesignSnapshot = {
  textOnSurfacePairs: Array<{ text: HexColor; surface: HexColor; usage: 'primary' | 'secondary' | 'tertiary' }>;
  spacingScalePx: number[];
  containers: ContainerShape[];
};

export type DesignWarning = {
  rule: string;
  message: string;
  severity: 'warning' | 'error';
};

function hexToRgb(hex: HexColor): { r: number; g: number; b: number } {
  const raw = hex.replace('#', '');
  const normalized = raw.length === 3 ? raw.split('').map((c) => `${c}${c}`).join('') : raw;
  const int = Number.parseInt(normalized, 16);

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255
  };
}

function luminance(hex: HexColor): number {
  const { r, g, b } = hexToRgb(hex);
  const channels = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(text: HexColor, surface: HexColor): number {
  const l1 = luminance(text);
  const l2 = luminance(surface);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

export function spacingConsistencyScore(spacingScalePx: number[]): number {
  if (spacingScalePx.length < 3) return 0;

  const sorted = [...spacingScalePx].sort((a, b) => a - b);
  const steps = sorted.slice(1).map((value, index) => value - sorted[index]);
  const uniqueSteps = new Set(steps);

  return Number((1 - uniqueSteps.size / Math.max(steps.length, 1)).toFixed(2));
}

export function radiusOveruseScore(containers: ContainerShape[]): number {
  if (!containers.length) return 0;

  const buckets = new Map<number, number>();
  containers.forEach((container) => {
    buckets.set(container.radiusPx, (buckets.get(container.radiusPx) ?? 0) + 1);
  });

  const mostCommon = Math.max(...buckets.values());
  return Number((mostCommon / containers.length).toFixed(2));
}

export function templateLikeContainerScore(containers: ContainerShape[]): number {
  if (containers.length < 3) return 0;

  let repeated = 0;
  for (let index = 1; index < containers.length; index += 1) {
    const prev = containers[index - 1];
    const current = containers[index];
    if (prev.radiusPx === current.radiusPx && prev.shadowStrength === current.shadowStrength) {
      repeated += 1;
    }
  }

  return Number((repeated / (containers.length - 1)).toFixed(2));
}

export function runDesignGuard(snapshot: DesignSnapshot): DesignWarning[] {
  const warnings: DesignWarning[] = [];

  snapshot.textOnSurfacePairs.forEach((pair) => {
    const ratio = contrastRatio(pair.text, pair.surface);
    const threshold = pair.usage === 'primary' ? 7 : pair.usage === 'secondary' ? 4.5 : 3;

    if (ratio < threshold) {
      warnings.push({
        rule: 'contrast',
        severity: 'error',
        message: `Low contrast (${ratio.toFixed(2)}:1) for ${pair.usage} text. Minimum expected is ${threshold}:1.`
      });
    }
  });

  const spacingScore = spacingConsistencyScore(snapshot.spacingScalePx);
  if (spacingScore < 0.35) {
    warnings.push({
      rule: 'spacing-consistency',
      severity: 'warning',
      message: 'Spacing scale is inconsistent. Use repeatable rhythm tokens instead of one-off values.'
    });
  }

  const radiusScore = radiusOveruseScore(snapshot.containers);
  if (radiusScore > 0.75) {
    warnings.push({
      rule: 'radius-overuse',
      severity: 'error',
      message: 'Uniform radius overuse detected. Vary edge treatment by component role.'
    });
  }

  const templateScore = templateLikeContainerScore(snapshot.containers);
  if (templateScore > 0.6) {
    warnings.push({
      rule: 'template-like-layout',
      severity: 'warning',
      message: 'UI looks template-like: too many similar containers.'
    });
  }

  return warnings;
}
