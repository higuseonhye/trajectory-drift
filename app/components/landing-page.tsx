import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "Coordination coherence",
    description:
      "Track how agents, handoffs, and delegated context hold together — or quietly diverge.",
  },
  {
    title: "Context continuity",
    description:
      "Stale memory, weak grounding, propagation gaps — measured as coherence, not alerts.",
  },
  {
    title: "Adaptive calibration",
    description:
      "Observe drift, recover continuity, learn from adaptation. A journal for resilient systems.",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--border-subtle)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-sm font-medium text-zinc-300">
            Trajectory Drift
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            Open workspace →
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <p className="label-caps">Coherence infrastructure</p>
        <h1 className="mt-4 text-3xl font-medium leading-snug tracking-tight text-zinc-100 sm:text-4xl">
          Coherent adaptation under unstable contexts
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-500">
          A calm coordination and calibration environment for adaptive systems —
          single agents, multi-agent workflows, and everything that propagates between them.
        </p>
        <p className="mt-4 text-sm italic text-zinc-600">
          The agents agreed confidently. Grounding remained unresolved.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/dashboard"
            className="border-b border-zinc-500 pb-0.5 text-sm text-zinc-300 transition hover:border-zinc-300"
          >
            View live workspace
          </Link>
        </div>

        <div className="mt-16 overflow-hidden rounded-md border border-[var(--border-subtle)]">
          <Image
            src="/assets/screenshots/dashboard-overview.png"
            alt="Trajectory Drift workspace"
            width={900}
            height={506}
            className="w-full"
            priority
          />
        </div>

        <section id="product" className="mt-20 space-y-10 border-t border-[var(--border-subtle)] pt-16">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <h2 className="text-sm font-medium text-zinc-300">{f.title}</h2>
              <p className="mt-2 prose-calm max-w-lg">{f.description}</p>
            </div>
          ))}
        </section>

        <section id="screenshots" className="mt-20 border-t border-[var(--border-subtle)] pt-16">
          <p className="label-caps">Screenshots</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Image
              src="/assets/screenshots/multi-lane-graph.png"
              alt="Multi-agent swimlane graph (v0.6)"
              width={400}
              height={280}
              className="rounded-md border border-[var(--border-subtle)]"
            />
            <Image
              src="/assets/screenshots/propagation-diff.png"
              alt="Field-level propagation diffs across handoffs"
              width={400}
              height={280}
              className="rounded-md border border-[var(--border-subtle)]"
            />
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-[var(--border-subtle)] px-6 py-8 text-center text-xs text-zinc-600">
        Observe · stabilize · learn · recover · adapt
      </footer>
    </div>
  );
}
