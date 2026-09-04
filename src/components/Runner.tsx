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
type Weapon = "slipper" | "pistol";

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
          weapon === "slipper"
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

export function Runner({
  head,
  shirt,
  legs,
  weapon,
}: {
  head: StaticImageData;
  shirt: string;
  legs: string;
  weapon?: Weapon;
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
