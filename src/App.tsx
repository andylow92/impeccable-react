import { useEffect, useState } from 'react';
import { DashboardScreen } from '@/ui/screens/DashboardScreen';
import { ExamplesScreen } from '@/ui/screens/ExamplesScreen';
import { ProjectScreen } from '@/ui/screens/ProjectScreen';

type Route = 'dashboard' | 'project' | 'examples';

function readRoute(): Route {
  const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
  if (hash === 'project' || hash === 'examples') return hash;
  return 'dashboard';
}

export function App() {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <>
      <Nav active={route} />
      {route === 'dashboard' && <DashboardScreen />}
      {route === 'project' && <ProjectScreen />}
      {route === 'examples' && <ExamplesScreen />}
    </>
  );
}

function Nav({ active }: { active: Route }) {
  const items: { id: Route; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'project', label: 'Project' },
    { id: 'examples', label: 'Generic vs. Impeccable' },
  ];
  return (
    <nav className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-6 py-3">
        <span className="mr-4 text-[11px] font-bold uppercase tracking-[0.22em] text-cobalt">
          Impeccable React
        </span>
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={
                'rounded-sharp px-3 py-1.5 text-xs font-semibold transition ' +
                (isActive
                  ? 'bg-ink text-paper'
                  : 'text-ink/70 hover:bg-ink/5 hover:text-ink')
              }
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
