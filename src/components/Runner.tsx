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
function Body({
  shirt,
  legs,
  slipper,
}: {
  shirt: string;
  legs: string;
  slipper?: boolean;
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

      <g className={slipper ? "run-arm-raised" : "run-arm-back"}>
        <rect
          x="37"
          y="14"
          width="11"
          height={slipper ? 46 : 28}
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

/** The weapon of choice in every Lebanese household. */
function Slipper() {
  return (
    <svg viewBox="0 0 40 26" className="h-full w-full" aria-hidden="true">
      <ellipse
        cx="20"
        cy="13"
        rx="17"
        ry="10"
        fill="#1e3a8a"
        stroke={O}
        strokeWidth="4"
      />
      <path
        d="M12 13 C16 7 24 7 28 13"
        fill="none"
        stroke="#ffc72c"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Runner({
  head,
  shirt,
  legs,
  slipper,
}: {
  head: StaticImageData;
  shirt: string;
  legs: string;
  slipper?: boolean;
}) {
  return (
    <div className="run-gait relative h-[84px] w-[64px]">
      <Body shirt={shirt} legs={legs} slipper={slipper} />
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
      {slipper ? (
        <div className="run-slipper absolute -top-[7px] -left-[21px] h-[26px] w-[38px]">
          <Slipper />
        </div>
      ) : null}
    </div>
  );
}
