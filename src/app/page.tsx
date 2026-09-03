import {
  EVENT_DATE_LONG,
  EVENT_TIME,
  EVENT_WEEKDAY,
  SITE_NAME,
  VENUE,
} from "@/lib/event";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-screen-sm flex-col items-center justify-center gap-6 px-5 py-16 text-center">
      <p className="font-pixel text-[10px] tracking-widest text-royal">
        BY ORDER OF THE KING &amp; QUEEN
      </p>
      <h1 className="font-display text-6xl leading-none text-flame uppercase">
        {SITE_NAME}
      </h1>
      <div className="rounded-2xl border-4 border-brown bg-yellow px-5 py-4">
        <p className="font-display text-2xl text-brown uppercase">
          {EVENT_WEEKDAY} {EVENT_DATE_LONG}
        </p>
        <p className="font-pixel mt-2 text-[10px] text-brown">
          {EVENT_TIME} · {VENUE.name}, {VENUE.area}
        </p>
      </div>
      <p className="font-pixel text-[10px] leading-relaxed text-orange">
        SCAFFOLD OK: YALLA, THE REST IS COMING
      </p>
    </main>
  );
}
