import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

export function Button({ children, variant = 'primary' }: ButtonProps) {
  const base =
    'rounded-sharp px-5 py-2.5 text-sm font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  // Intentionally avoided: pill radius + ghosty borders that flatten hierarchy.
  const styles =
    variant === 'primary'
      ? 'bg-ink text-paper hover:bg-slate focus-visible:outline-ink'
      : 'border border-ink/20 bg-white text-ink hover:border-ink focus-visible:outline-slate';

  return <button className={`${base} ${styles}`}>{children}</button>;
}
