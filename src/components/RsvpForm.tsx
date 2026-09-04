"use client";

import { useEffect, useState } from "react";
import { ChunkyButton } from "./ChunkyButton";
import { copy } from "@/lib/copy";
import { RSVP_DEADLINE } from "@/lib/event";
import { getSupabase } from "@/lib/supabase";
import { crownConfetti } from "@/lib/confetti";
import { useSound } from "@/lib/use-sound";
import {
  hashToken,
  loadMyRsvp,
  newToken,
  saveMyRsvp,
  type MyRsvp,
} from "@/lib/rsvp-token";
import { updateRsvp } from "@/app/actions";

/** Postgres unique_violation. The duplicate rule is enforced by the index. */
const UNIQUE_VIOLATION = "23505";

type Status = "idle" | "saving" | "done";

export function RsvpForm() {
  const { play } = useSound();

  const [mine, setMine] = useState<MyRsvp | null>(null);

  const [name, setName] = useState("");
  const [coming, setComing] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [closed, setClosed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cosmetic only: the database is what actually refuses a late insert.
    const tick = () => setClosed(Date.now() >= RSVP_DEADLINE.getTime());
    tick();
    const id = window.setInterval(tick, 30_000);
    const existing = loadMyRsvp();
    if (existing) {
      setMine(existing);
      setName(existing.name);
    }
    return () => window.clearInterval(id);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError(copy.rsvp.nameRequired);
      return;
    }
    if (coming === null) {
      setError(copy.rsvp.comingRequired);
      return;
    }

    setStatus("saving");
    const cleanMessage = message.trim() ? message.trim().slice(0, 180) : null;

    // Editing an existing crown goes through the server action, which checks
    // the token; creating a new one is a plain insert under RLS.
    if (mine) {
      const result = await updateRsvp({
        id: mine.id,
        token: mine.token,
        coming,
        message: cleanMessage,
      });
      if (!result.ok) {
        setStatus("idle");
        setError(copy.rsvp.errorGeneric);
        return;
      }
    } else {
      const token = newToken();
      const edit_token_hash = await hashToken(token);
      const { data, error: insertError } = await getSupabase()
        .from("rsvps")
        .insert({
          name: trimmed,
          coming,
          message: cleanMessage,
          edit_token_hash,
        })
        .select("id, name, coming, message, side_quest, created_at")
        .single();

      if (insertError) {
        setStatus("idle");
        setError(
          insertError.code === UNIQUE_VIOLATION
            ? copy.rsvp.duplicate
            : copy.rsvp.errorGeneric,
        );
        play("sad");
        return;
      }
      const saved = { id: data.id, token, name: data.name };
      saveMyRsvp(saved);
      setMine(saved);
    }

    setStatus("done");
    play(coming ? "tada" : "sad");
    if (coming) void crownConfetti();
  }

  if (closed) {
    return (
      <div className="w-full max-w-[23rem] rounded-md border-[5px] border-brown bg-brown px-5 py-6 text-center">
        <h3 className="font-display text-2xl leading-tight text-yellow uppercase">
          {copy.rsvp.closedHeading}
        </h3>
        <p className="font-pixel mt-3 text-[10px] leading-relaxed text-cream/85">
          {copy.rsvp.closedBody}
        </p>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="paper hard-shadow w-full max-w-[23rem] rounded-md border-[5px] border-brown bg-cream px-5 py-6 text-center">
        <p className="font-display text-2xl leading-tight text-flame">
          {coming ? copy.rsvp.success : copy.rsvp.successNotComing}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-pixel mt-3 min-h-[44px] text-[10px] text-royal underline underline-offset-4"
        >
          {copy.rsvp.changeAnswer}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="paper hard-shadow w-full max-w-[23rem] rounded-md border-[5px] border-brown bg-cream px-5 py-5"
      noValidate
    >
      <label className="block">
        <span className="font-pixel text-[10px] tracking-[0.14em] text-flame uppercase">
          {copy.rsvp.nameLabel}
        </span>
        <input
          type="text"
          value={name}
          maxLength={40}
          required
          disabled={!!mine}
          onChange={(e) => setName(e.target.value)}
          placeholder={copy.rsvp.namePlaceholder}
          className="font-display mt-1.5 w-full rounded-sm border-[3px] border-brown bg-white px-3 py-2.5 text-lg text-brown disabled:opacity-60"
        />
      </label>
      {mine ? (
        <p className="font-pixel mt-1.5 text-[10px] leading-relaxed text-brown/70">
          {copy.rsvp.editingHint}
        </p>
      ) : null}

      <fieldset className="mt-4">
        <legend className="font-pixel text-[10px] tracking-[0.14em] text-flame uppercase">
          {copy.rsvp.comingLabel}
        </legend>
        <div className="mt-2 flex gap-3">
          {[
            { value: true, label: copy.rsvp.comingYes },
            { value: false, label: copy.rsvp.comingNo },
          ].map((option) => (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={coming === option.value}
              onClick={() => {
                setComing(option.value);
                play("crunch");
              }}
              className={`font-display min-h-[44px] flex-1 rounded-md border-[3px] border-brown px-3 py-2 text-lg uppercase transition-colors ${
                coming === option.value
                  ? option.value
                    ? "bg-yellow text-brown"
                    : "bg-ash text-cream"
                  : "bg-white text-brown/70"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 block">
        <span className="font-pixel text-[10px] tracking-[0.14em] text-flame uppercase">
          {copy.rsvp.messageLabel}
        </span>
        <textarea
          value={message}
          maxLength={180}
          rows={2}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={copy.rsvp.messagePlaceholder}
          className="font-display mt-1.5 w-full resize-none rounded-sm border-[3px] border-brown bg-white px-3 py-2.5 text-base text-brown"
        />
      </label>

      {error ? (
        <p
          role="alert"
          className="font-pixel mt-3 rounded-sm border-[3px] border-flame bg-flame/10 px-3 py-2 text-[10px] leading-relaxed text-flame"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex justify-center">
        <ChunkyButton type="submit" disabled={status === "saving"}>
          {status === "saving"
            ? copy.rsvp.submitting
            : mine
              ? copy.rsvp.submitEdit
              : copy.rsvp.submit}
        </ChunkyButton>
      </div>
    </form>
  );
}
