"use client";

import Image, { type StaticImageData } from "next/image";

const O = "#3d1b0e";

/**
 * A running body for a real cut-out head to sit on. Blunt on purpose: at this
 * size limbs read as shapes, so detail would only turn to mud.
 *
 * The slipper is drawn INSIDE the raised-arm group rather than positioned
 * over the top, so it swings with the arm and survives the scaleX(-1) that
 * turns the pair around for a right-to-left run.
 */
type Weapon = "slipper" | "pistol" | "hand" | "shout";

function Body({
  shirt,
  legs,
  weapon,
}: {
  shirt: string;
  legs: string;
  weapon?: Weapon;
}) {
  return (
    <svg viewBox="0 0 64 84" className="h-full w-full" aria-hidden="true">
      <g className="run-leg-back">
        <rect
          x="25"
          y="44"
          width="14"
          height="34"
          rx="7"
          fill={legs}
          stroke={O}
          strokeWidth="5"
        />
      </g>
      <g className="run-leg-front">
        <rect
          x="25"
          y="44"
          width="14"
          height="34"
          rx="7"
          fill={legs}
          stroke={O}
          strokeWidth="5"
        />
      </g>

      <rect
        x="17"
        y="12"
        width="30"
        height="40"
        rx="13"
        fill={shirt}
        stroke={O}
        strokeWidth="5"
      />

      <g
        className={
          weapon === "slipper" || weapon === "hand"
            ? "run-arm-raised"
            : weapon === "pistol"
              ? "run-arm-aim"
              : "run-arm-back"
        }
      >
        <rect
          x="37"
          y="14"
          width="11"
          height={weapon ? 46 : 28}
          rx="5"
          fill={shirt}
          stroke={O}
          strokeWidth="5"
        />
      </g>

      <g className="run-arm-front">
        <rect
          x="16"
          y="14"
          width="11"
          height="28"
          rx="5"
          fill={shirt}
          stroke={O}
          strokeWidth="5"
        />
      </g>
    </svg>
  );
}

/**
 * The weapon of choice in every Lebanese household: a slide sandal from above,
 * narrow at the heel and wide at the toe, with a visible sole edge under it.
 *
 * Drawn in a 122-unit box rather than the ~50 I first used. Stroke widths are
 * absolute, so in a small viewBox the 4-unit outline ate the whole shape; here
 * it is ~3% of the width and reads as an outline. A single strap beats a
 * V-thong at the 44px this actually renders at.
 */
function Slipper() {
  const sole =
    "M20 38 C20 31 27 27 36 26 C46 25 54 28 66 25 " +
    "C86 21 106 25 106 38 C106 51 86 55 66 51 " +
    "C54 48 46 51 36 50 C27 49 20 45 20 38 Z";

  return (
    <svg viewBox="0 0 122 76" className="h-full w-full" aria-hidden="true">
      {/* sole edge, offset down so it reads as a solid object */}
      <path
        d={sole}
        transform="translate(0 8)"
        fill="#14286b"
        stroke={O}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* footbed */}
      <path
        d={sole}
        fill="#1e3a8a"
        stroke={O}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M30 33 C36 29 44 27 52 27"
        fill="none"
        stroke="#4763b8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* strap */}
      <rect
        x="70"
        y="19"
        width="18"
        height="40"
        rx="9"
        transform="rotate(-10 79 38)"
        fill="#ffc72c"
        stroke={O}
        strokeWidth="4"
      />
    </svg>
  );
}

/**
 * A Desert Eagle, drawn in the same heavy-outline style as everything else:
 * long squared slide, barrel rib, blocky muzzle and a steeply raked grip. The
 * viewBox runs well past the muzzle to leave room for the flash.
 */
function Pistol() {
  return (
    <svg viewBox="0 0 210 100" className="h-full w-full" aria-hidden="true">
      <g stroke="#241611" strokeWidth="4" strokeLinejoin="round">
        {/* grip */}
        <path d="M40 56 L64 56 L54 96 L22 96 Z" fill="#2e2725" />
        {/* frame and trigger guard */}
        <path
          d="M34 44 L96 44 L96 62 L74 62 C70 74 56 74 52 62 L34 62 Z"
          fill="#4f4a47"
        />
        {/* slide */}
        <path d="M30 20 L146 20 L146 40 L138 46 L30 46 Z" fill="#6e6764" />
        <rect x="46" y="14" width="92" height="8" rx="2" fill="#837b77" />
        {/* muzzle */}
        <rect x="140" y="24" width="10" height="18" rx="3" fill="#241611" />
        {/* rear sight and hammer */}
        <rect x="32" y="10" width="10" height="10" rx="2" fill="#4f4a47" />
        <path d="M24 26 L32 26 L32 40 L24 36 Z" fill="#4f4a47" />
      </g>
      <g stroke="#3d3733" strokeWidth="3" strokeLinecap="round">
        <path d="M40 26 L40 40" />
        <path d="M47 26 L47 40" />
        <path d="M54 26 L54 40" />
      </g>
      <g stroke="#4a423e" strokeWidth="2.5" strokeLinecap="round">
        <path d="M36 66 L56 66" />
        <path d="M34 74 L54 74" />
        <path d="M32 82 L51 82" />
      </g>

      {/* muzzle flash, on its own group so it can blink independently */}
      <g className="muzzle-flash">
        <path
          d="M148 33 L176 16 L169 29 L204 22 L180 33 L204 44 L169 37 L176 50 Z"
          fill="#f5821f"
          stroke="#241611"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M150 33 L172 24 L167 32 L188 28 L173 33 L188 38 L167 34 L172 42 Z"
          fill="#ffc72c"
        />
        <ellipse cx="156" cy="33" rx="7" ry="6" fill="#fff6e0" />
      </g>
    </svg>
  );
}

/**
 * An open palm mid-swing. The kaff: no prop required, and the most Lebanese
 * option of the three.
 */
function Hand() {
  return (
    <svg viewBox="0 0 96 116" className="h-full w-full" aria-hidden="true">
      <g
        fill="#f0b58c"
        stroke={O}
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <rect x="26" y="10" width="15" height="46" rx="7.5" />
        <rect x="42" y="4" width="15" height="52" rx="7.5" />
        <rect x="58" y="10" width="15" height="46" rx="7.5" />
        <rect x="72" y="20" width="14" height="38" rx="7" />
        {/* thumb */}
        <path d="M24 48 C10 44 4 54 12 62 L28 72 Z" />
        {/* palm */}
        <path d="M22 46 L86 46 C90 62 84 86 62 96 C42 104 24 94 20 76 Z" />
      </g>
      <g stroke="#d69a72" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M34 66 C46 72 60 72 72 66" />
        <path d="M32 78 C44 84 58 84 68 78" />
      </g>
    </svg>
  );
}

/**
 * A shout, not a weapon. The bubble is deliberately large for its runner: the
 * line has to be readable in the four seconds it takes to cross the screen, so
 * the text sits at the same 10px floor as the rest of the pixel type.
 */
function Shout({ text }: { text: string }) {
  return (
    <div className="relative h-[86px] w-[140px]">
      <svg
        viewBox="0 0 200 124"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* Tail is part of the outline rather than a separate triangle, so no
            stroke runs through the middle of the bubble. */}
        <path
          d="M10 44 L34 30 L30 10 L58 22 L70 4 L92 18 L112 4 L126 22 L152 12
             L154 34 L182 32 L172 52 L194 64 L170 78 L184 98 L156 98 L152 118
             L128 104 L108 120 L92 104 L64 116 L60 96 L52 122 L30 92 L8 88
             L26 66 Z"
          fill="#f5ebdc"
          stroke={O}
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-pixel absolute inset-0 flex items-center justify-center px-[17%] pb-[8%] text-center text-[10px] leading-[1.5] text-flame">
        {text}
      </span>
    </div>
  );
}

export function Runner({
  head,
  shirt,
  legs,
  weapon,
  shout,
}: {
  head: StaticImageData;
  shirt: string;
  legs: string;
  weapon?: Weapon;
  /** The line, for weapon: "shout". */
  shout?: string;
}) {
  return (
    <div className="run-gait relative h-[84px] w-[64px]">
      <Body shirt={shirt} legs={legs} weapon={weapon} />
      {/* Head oversized against the body: it is the only part anyone will
          actually recognise at this scale. */}
      <div className="absolute -top-[30px] left-1/2 h-[48px] w-[48px] -translate-x-1/2">
        <Image
          src={head}
          alt=""
          sizes="60px"
          className="h-full w-full object-contain drop-shadow-[0_2px_0_rgba(80,35,20,0.3)]"
        />
      </div>
      {/* Held clear above the head rather than drawn into the arm: inside the
          SVG the swing puts it straight behind the face. As a sibling it still
          mirrors correctly when the pair turns around. */}
      {weapon === "slipper" ? (
        <div className="run-slipper absolute -top-[9px] -left-[26px] h-[28px] w-[44px]">
          <Slipper />
        </div>
      ) : null}
      {weapon === "hand" ? (
        <div className="run-slipper absolute -top-[16px] -left-[20px] h-[38px] w-[32px]">
          <Hand />
        </div>
      ) : null}
      {weapon === "shout" && shout ? (
        <div className="run-shout absolute -top-[74px] left-[34px]">
          <Shout text={shout} />
        </div>
      ) : null}
      {/* Aimed forward at whoever is running away, so it sits off the leading
          edge of the body rather than up behind the head. */}
      {weapon === "pistol" ? (
        <div className="run-pistol absolute top-[2px] left-[54px] h-[32px] w-[68px]">
          <Pistol />
        </div>
      ) : null}
    </div>
  );
}
