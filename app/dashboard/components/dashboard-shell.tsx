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
  subtitle = "Agent execution observability",
  status,
  actions,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                TD
              </span>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">
                  Trajectory Drift
                </h1>
                <p className="text-[11px] text-zinc-500">{subtitle}</p>
              </div>
            </Link>
            <span className="hidden h-4 w-px bg-[var(--border)] sm:block" />
            <span className="hidden text-xs text-zinc-500 sm:block">
              Live observability
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {status}
            {actions}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
