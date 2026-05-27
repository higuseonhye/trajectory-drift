import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    title: "When rhythm fades",
    description:
      "Notice coordination losing warmth — handoffs, memory, presence — before collapse.",
  },
  {
    title: "Human continuity",
    description:
      "Bridge from Return: personal rhythm meeting collective systems.",
  },
  {
    title: "Quiet recovery",
    description:
      "Not alerts. Not optimization. Gentle return to coherence.",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--border-subtle)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-sm font-medium text-[var(--foreground)]">
            Drift
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            Enter the room →
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
        <p className="label-caps">Drift & Return</p>
        <h1 className="mt-4 text-3xl font-medium leading-snug tracking-tight text-[var(--foreground)] sm:text-4xl">
          When collectives lose rhythm
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted)]">
          Teams and systems can look operational while warmth, meaning, and
          continuity quietly leave. Drift is a quiet room for noticing — and
          returning.
        </p>
        <p className="mt-4 text-sm italic text-[var(--muted-soft)]">
          Not observability. Not productivity. Human rhythm at scale.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/dashboard"
            className="border-b border-[var(--accent-soft)] pb-0.5 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]"
          >
            Open the room
          </Link>
        </div>

        <ul className="mt-16 space-y-8 border-t border-[var(--border-subtle)] pt-12">
          {FEATURES.map((f) => (
            <li key={f.title}>
              <p className="label-caps">{f.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {f.description}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-16 text-xs text-[var(--muted-soft)]">
          Pairs with{" "}
          <a
            href="https://github.com/higuseonhye/trajectory-native"
            className="underline underline-offset-2 hover:text-[var(--muted)]"
          >
            Return
          </a>{" "}
          — personal rhythm.
        </p>
      </main>
    </div>
  );
}
