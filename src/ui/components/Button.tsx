import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Button — non-anonymous by design.
 *
 * Avoided:
 *   - Pill radius + ghost border: the AI-default "two-button stack" that
 *     communicates nothing about which action is primary.
 *   - Soft shadow on a CTA. Shadows belong to surfaces, not to actions.
 *   - Identical contrast for primary and secondary.
 *
 * Decisions made instead:
 *   - Sharp radius (`rounded-sharp`) signals utility intent, not decoration.
 *   - Three explicit variants. There is no "default" — callers choose.
 *   - Primary uses ink-on-paper inverse, the highest available contrast on
 *     the page. Secondary recedes deliberately (border-only).
 *   - Critical uses the signal accent for actions that change state
 *     irreversibly (delete, escalate, override).
 */

type ButtonProps = {
  children: ReactNode;
  variant: 'primary' | 'secondary' | 'critical';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

const VARIANT: Record<ButtonProps['variant'], string> = {
  primary:
    'bg-ink text-paper hover:bg-slate focus-visible:outline-ink',
  secondary:
    'border border-ink/25 bg-white text-ink hover:border-ink focus-visible:outline-slate',
  critical:
    'bg-signal text-paper hover:brightness-110 focus-visible:outline-signal',
};

export function Button({ children, variant, className, ...rest }: ButtonProps) {
  const base =
    'rounded-sharp px-5 py-2.5 text-sm font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  return (
    <button {...rest} className={`${base} ${VARIANT[variant]} ${className ?? ''}`}>
      {children}
    </button>
  );
}
