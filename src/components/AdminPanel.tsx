"use client";

import { useEffect, useState } from "react";
import { ChunkyButton } from "./ChunkyButton";
import { copy } from "@/lib/copy";
import { adminDelete, adminList } from "@/app/actions";
import { formatInBeirut } from "@/lib/event";
import type { Rsvp } from "@/lib/types";

function toCsv(rows: Rsvp[]): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = ["name", "coming", "message", "created_at"].join(",");
  const body = rows.map((r) =>
    [
      escape(r.name),
      r.coming ? "yes" : "no",
      escape(r.message ?? ""),
      escape(r.created_at),
    ].join(","),
  );
  return [header, ...body].join("\r\n");
}

/**
 * Hidden behind the #royal hash and a passphrase. The passphrase is checked in
 * a server action against ADMIN_PASSPHRASE, so it never ships to the browser.
 * This is friction, not security, and the passphrase lives only in the
 * ADMIN_PASSPHRASE environment variable, never in this repository.
 */
export function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<Rsvp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === "#royal");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  if (!open) return null;

  async function enter(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await adminList(passphrase);
    setBusy(false);
    if (!result.ok) {
      setError(copy.admin.wrong);
      return;
    }
    setAuthed(true);
    setRows(result.data);
  }

  async function remove(id: string) {
    if (!window.confirm(copy.admin.deleteConfirm)) return;
    setBusy(true);
    const result = await adminDelete(passphrase, id);
    setBusy(false);
    if (!result.ok) {
      setError(copy.admin.wrong);
      return;
    }
    setRows((current) => current.filter((r) => r.id !== id));
  }

  function exportCsv() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "double-crown-rsvps.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-brown/95 px-4 py-8">
      <div className="mx-auto w-full max-w-[30rem]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-yellow uppercase">
            {copy.admin.heading}
          </h2>
          <a
            href="#"
            className="font-pixel flex min-h-[44px] items-center px-2 text-[10px] text-cream/80 uppercase"
          >
            {copy.admin.close}
          </a>
        </div>

        {!authed ? (
          <form onSubmit={enter} className="mt-5 flex flex-col gap-3">
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder={copy.admin.passphrasePlaceholder}
              autoComplete="off"
              className="font-display w-full rounded-sm border-[3px] border-yellow bg-cream px-3 py-2.5 text-lg text-brown"
            />
            <ChunkyButton type="submit" tone="yellow" disabled={busy}>
              {copy.admin.enter}
            </ChunkyButton>
            {error ? (
              <p role="alert" className="font-pixel text-[10px] text-yellow">
                {error}
              </p>
            ) : null}
          </form>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ChunkyButton tone="yellow" onClick={exportCsv}>
                {copy.admin.exportCsv}
              </ChunkyButton>
              <span className="font-pixel text-[10px] text-cream/80 uppercase">
                {rows.filter((r) => r.coming).length} / {rows.length}
              </span>
            </div>

            {rows.length === 0 ? (
              <p className="font-pixel mt-6 text-[10px] text-cream/80">
                {copy.admin.empty}
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2">
                {rows.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-sm border-[3px] border-cream/30 bg-cream/10 px-3 py-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-lg break-words text-cream">
                          {r.name}{" "}
                          <span
                            className={
                              r.coming ? "text-yellow" : "text-cream/50"
                            }
                          >
                            {r.coming ? "· coming" : "· can't"}
                          </span>
                        </p>
                        {r.message ? (
                          <p className="font-pixel mt-1 text-[10px] leading-relaxed break-words text-cream/75">
                            {r.message}
                          </p>
                        ) : null}
                        <p className="font-pixel mt-1 text-[10px] text-cream/45">
                          {formatInBeirut(new Date(r.created_at), {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(r.id)}
                        disabled={busy}
                        aria-label={`Remove ${r.name}`}
                        className="font-pixel min-h-[44px] shrink-0 px-2 text-[10px] text-flame uppercase"
                      >
                        {copy.admin.remove}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
