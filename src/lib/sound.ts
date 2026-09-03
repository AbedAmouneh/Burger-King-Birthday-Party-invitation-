/**
 * Toy-box sound engine. Everything is synthesised with the Web Audio API, so
 * there are no audio files to download and nothing copyrighted.
 *
 * Mobile browsers refuse to start an AudioContext outside a user gesture, so
 * the context is created lazily on the first tap. That is also why sound is
 * "on by default after the first tap" rather than on at page load.
 */

export type Voice =
  | "squish"
  | "unsquish"
  | "crunch"
  | "squeak"
  | "tada"
  | "pop"
  | "sad";

const STORAGE_KEY = "double-crown:muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let muted = false;

/** Read the persisted mute preference. Safe in private mode and on the server. */
export function loadMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    muted = window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    muted = false;
  }
  return muted;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean): void {
  muted = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Private mode or blocked storage: honour the choice for this session only.
  }
  if (master && ctx) {
    master.gain.setTargetAtTime(next ? 0 : 0.9, ctx.currentTime, 0.01);
  }
}

/**
 * Create (or resume) the AudioContext. Must be called from inside a user
 * gesture the first time, otherwise the context starts suspended.
 */
export function unlockAudio(): void {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

/** One second of white noise, reused by every percussive voice. */
function getNoise(audio: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const buf = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}

type Envelope = { attack: number; decay: number; peak: number };

function envelope(
  audio: AudioContext,
  target: AudioNode,
  t0: number,
  { attack, decay, peak }: Envelope,
): GainNode {
  const g = audio.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
  g.connect(target);
  return g;
}

/**
 * Filtered noise burst with a sweeping resonant band. This is what gives the
 * squish and crunch their "air being pushed" character.
 */
function noiseSweep(
  audio: AudioContext,
  out: AudioNode,
  t0: number,
  opts: {
    from: number;
    to: number;
    q: number;
    type: BiquadFilterType;
    env: Envelope;
  },
): void {
  const src = audio.createBufferSource();
  src.buffer = getNoise(audio);
  const filter = audio.createBiquadFilter();
  filter.type = opts.type;
  filter.Q.value = opts.q;
  filter.frequency.setValueAtTime(opts.from, t0);
  filter.frequency.exponentialRampToValueAtTime(
    opts.to,
    t0 + opts.env.attack + opts.env.decay,
  );
  const g = envelope(audio, out, t0, opts.env);
  src.connect(filter).connect(g);
  src.start(t0);
  src.stop(t0 + opts.env.attack + opts.env.decay + 0.05);
}

function tone(
  audio: AudioContext,
  out: AudioNode,
  t0: number,
  opts: {
    from: number;
    to?: number;
    type: OscillatorType;
    env: Envelope;
  },
): void {
  const osc = audio.createOscillator();
  osc.type = opts.type;
  osc.frequency.setValueAtTime(opts.from, t0);
  if (opts.to !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(
      opts.to,
      t0 + opts.env.attack + opts.env.decay,
    );
  }
  const g = envelope(audio, out, t0, opts.env);
  osc.connect(g);
  osc.start(t0);
  osc.stop(t0 + opts.env.attack + opts.env.decay + 0.05);
}

export function play(voice: Voice): void {
  if (muted) return;
  unlockAudio();
  if (!ctx || !master) return;
  const audio = ctx;
  const out = master;
  const t = audio.currentTime;

  switch (voice) {
    // Squeezing the Whopper: air pushed out, pitch falling.
    case "squish":
      noiseSweep(audio, out, t, {
        from: 1400,
        to: 260,
        q: 7,
        type: "bandpass",
        env: { attack: 0.008, decay: 0.19, peak: 0.5 },
      });
      tone(audio, out, t, {
        from: 240,
        to: 95,
        type: "sine",
        env: { attack: 0.006, decay: 0.16, peak: 0.16 },
      });
      break;

    // Letting go: the same move in reverse.
    case "unsquish":
      noiseSweep(audio, out, t, {
        from: 320,
        to: 1600,
        q: 6,
        type: "bandpass",
        env: { attack: 0.01, decay: 0.13, peak: 0.32 },
      });
      tone(audio, out, t, {
        from: 120,
        to: 300,
        type: "sine",
        env: { attack: 0.008, decay: 0.12, peak: 0.12 },
      });
      break;

    // Buttons. Short, dry, snappy.
    case "crunch":
      noiseSweep(audio, out, t, {
        from: 2600,
        to: 900,
        q: 2.5,
        type: "bandpass",
        env: { attack: 0.003, decay: 0.055, peak: 0.42 },
      });
      break;

    // Stickers. Rubber-toy squeak.
    case "squeak":
      tone(audio, out, t, {
        from: 1500,
        to: 2700,
        type: "triangle",
        env: { attack: 0.01, decay: 0.09, peak: 0.14 },
      });
      tone(audio, out, t + 0.07, {
        from: 2500,
        to: 1300,
        type: "triangle",
        env: { attack: 0.01, decay: 0.09, peak: 0.11 },
      });
      break;

    // RSVP accepted. Little coronation fanfare.
    case "tada": {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, i) => {
        tone(audio, out, t + i * 0.085, {
          from: f,
          type: "triangle",
          env: { attack: 0.01, decay: 0.3, peak: 0.22 },
        });
        tone(audio, out, t + i * 0.085, {
          from: f * 2,
          type: "sine",
          env: { attack: 0.01, decay: 0.18, peak: 0.07 },
        });
      });
      break;
    }

    // A crown landing on the wall.
    case "pop":
      tone(audio, out, t, {
        from: 720,
        to: 180,
        type: "sine",
        env: { attack: 0.004, decay: 0.1, peak: 0.3 },
      });
      break;

    // "Can't make it" crown. Two notes down, minor.
    case "sad":
      tone(audio, out, t, {
        from: 392,
        type: "triangle",
        env: { attack: 0.01, decay: 0.18, peak: 0.18 },
      });
      tone(audio, out, t + 0.16, {
        from: 311.13,
        type: "triangle",
        env: { attack: 0.01, decay: 0.32, peak: 0.18 },
      });
      break;
  }
}
