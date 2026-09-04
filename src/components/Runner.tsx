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
 * A toy water pistol. Bright, blocky and unmistakably a toy: the register here
 * is slapstick, the same as the slipper, and the site's whole theme is a kids
 * meal with a toy in it.
 */
function Pistol() {
  return (
    <svg viewBox="0 0 140 86" className="h-full w-full" aria-hidden="true">
      <g stroke={O} strokeWidth="4" strokeLinejoin="round">
        <rect
          x="26"
          y="46"
          width="24"
          height="34"
          rx="9"
          transform="rotate(14 38 63)"
          fill="#f5821f"
        />
        <rect x="20" y="26" width="76" height="24" rx="10" fill="#f5821f" />
        <rect x="40" y="6" width="40" height="22" rx="10" fill="#ffc72c" />
        <rect x="92" y="30" width="16" height="16" rx="6" fill="#d62300" />
      </g>
      {/* water */}
      <g fill="#1e3a8a" stroke={O} strokeWidth="3">
        <ellipse cx="116" cy="32" rx="5.5" ry="6.5" />
        <ellipse cx="128" cy="42" rx="4.5" ry="5.5" />
        <ellipse cx="118" cy="52" rx="3.5" ry="4.5" />
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
        <div className="run-pistol absolute top-[5px] left-[58px] h-[30px] w-[48px]">
          <Pistol />
        </div>
      ) : null}
    </div>
  );
}
