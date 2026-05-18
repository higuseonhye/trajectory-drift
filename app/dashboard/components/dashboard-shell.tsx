"use client";

import Link from "next/link";

interface DashboardShellProps {
  children: React.ReactNode;
  subtitle?: string;
  status?: React.ReactNode;
  actions?: React.ReactNode;
}

export function DashboardShell({
  children,
  subtitle = "Coherent adaptation under uncertainty",
  status,
  actions,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border-subtle)] bg-[var(--background)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded border border-zinc-700 text-[10px] font-medium text-zinc-400">
              TD
            </span>
            <div>
              <p className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100">
                Trajectory Drift
              </p>
              <p className="text-xs text-zinc-600">{subtitle}</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {status}
            {actions}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
