import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "Trajectory graphs",
    description:
      "Visualize agent steps as a directed graph — thoughts, tool calls, observations, and responses.",
  },
  {
    title: "Drift detection",
    description:
      "Compare live runs to golden trajectories. Surface missing steps, hallucinations, and semantic deviation.",
  },
  {
    title: "Actionable reports",
    description:
      "Every finding includes location, severity, likely cause, and a suggested fix.",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              TD
            </span>
            <span className="font-semibold tracking-tight">Trajectory Drift</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#product" className="text-zinc-400 transition hover:text-white">
              Product
            </a>
            <a href="#screenshots" className="text-zinc-400 transition hover:text-white">
              Screenshots
            </a>
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500"
            >
              Open dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-[var(--border)] px-6 py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-glow),_transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-400">
              AI agent observability
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Catch agent drift before it hits production
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              Trajectory Drift ingests agent execution logs, builds trajectory graphs,
              and flags missing retrieval, hallucinations, and step-level deviation —
              with severity scores and remediation guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                View live demo
              </Link>
              <a
                href="#screenshots"
                className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                See screenshots
              </a>
            </div>
          </div>
          <div className="relative mx-auto mt-14 max-w-6xl glow-accent">
            <Image
              src="/assets/screenshots/dashboard-overview.png"
              alt="Trajectory Drift dashboard overview"
              width={1200}
              height={675}
              className="rounded-xl border border-[var(--border)] shadow-2xl"
              priority
            />
          </div>
        </section>

        <section id="product" className="border-b border-[var(--border)] px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Built for agent ops teams
            </h2>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Drop in JSON execution logs. Get graphs, drift scores, and reports — no
              manual triage required.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="panel p-5">
                  <h3 className="font-medium">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="screenshots" className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold tracking-tight">Product visuals</h2>
            <p className="mt-2 text-zinc-400">
              Graph visualization, drift reports, and execution replay — one surface.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <figure className="panel overflow-hidden p-1">
                <Image
                  src="/assets/screenshots/graph-closeup.png"
                  alt="Trajectory graph with drift highlights"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
                <figcaption className="px-4 py-3 text-xs text-zinc-500">
                  Trajectory graph — drift nodes highlighted in red
                </figcaption>
              </figure>
              <figure className="panel overflow-hidden p-1">
                <Image
                  src="/assets/screenshots/drift-report.png"
                  alt="Drift detection report sidebar"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
                <figcaption className="px-4 py-3 text-xs text-zinc-500">
                  Drift report — severity, cause, and suggested fix
                </figcaption>
              </figure>
              <figure className="panel overflow-hidden p-1 md:col-span-2">
                <Image
                  src="/assets/screenshots/timeline-replay.png"
                  alt="Execution timeline replay"
                  width={1200}
                  height={400}
                  className="rounded-lg"
                />
                <figcaption className="px-4 py-3 text-xs text-zinc-500">
                  Timeline replay — step through agent execution
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-[var(--border)] px-6 py-8 text-center text-xs text-zinc-500">
        Trajectory Drift · AI agent observability MVP
      </footer>
    </div>
  );
}
