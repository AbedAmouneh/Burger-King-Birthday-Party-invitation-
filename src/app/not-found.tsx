import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-screen-sm flex-col items-center justify-center gap-5 px-5 text-center">
      <h1 className="font-display text-5xl text-flame uppercase">Wrong line</h1>
      <p className="font-pixel text-[10px] leading-relaxed text-brown">
        THIS COUNTER IS CLOSED. TRY THE OTHER ONE.
      </p>
      <Link
        href="/"
        className="rounded-full border-4 border-brown bg-yellow px-6 py-3 font-display text-xl text-brown uppercase"
      >
        Back to the palace
      </Link>
    </main>
  );
}
