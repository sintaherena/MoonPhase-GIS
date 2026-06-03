import type { ReactNode } from 'react';

export interface PanelShellProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function PanelShell({ title, children, className }: PanelShellProps) {
  return (
    <aside
      className={
        className ??
        'flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-space-surface/95 p-6 shadow-xl backdrop-blur-md'
      }
      aria-label={title}
    >
      <header>
        <h2 className="font-sans text-lg font-semibold tracking-tight text-moonlight">
          {title}
        </h2>
      </header>
      <div className="flex-1 overflow-y-auto text-sm text-moonlight-muted">
        {children}
      </div>
    </aside>
  );
}
