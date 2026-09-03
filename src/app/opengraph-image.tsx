import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  EVENT_DATE_LONG,
  EVENT_TIME,
  EVENT_WEEKDAY,
  FEE,
  SITE_NAME,
  VENUE,
} from "@/lib/event";

export const alt = "Double Crown: Abed & Lynn";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * WhatsApp link preview. Rendered by Satori, which cannot read WOFF2, so the
 * two brand faces are bundled as TTFs in ./_og-fonts.
 *
 * Satori supports only a subset of CSS: flexbox, no CSS variables, no
 * shorthand `border`, and every element with more than one child needs an
 * explicit `display: flex`.
 */
export default async function OpengraphImage() {
  const fontDir = join(process.cwd(), "src/app/_og-fonts");
  const [display, pixel] = await Promise.all([
    readFile(join(fontDir, "LilitaOne-Regular.ttf")),
    readFile(join(fontDir, "PressStart2P-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5ebdc",
          fontFamily: "Lilita One",
          padding: 56,
          position: "relative",
        }}
      >
        {/* flame bands, top and bottom, like a printed tray liner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 22,
            backgroundColor: "#d62300",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 22,
            backgroundColor: "#d62300",
            display: "flex",
          }}
        />

        <div
          style={{
            fontFamily: "Press Start 2P",
            fontSize: 20,
            color: "#1e3a8a",
            letterSpacing: 2,
            marginBottom: 26,
            display: "flex",
          }}
        >
          BY ORDER OF THE KING &amp; QUEEN
        </div>

        <div
          style={{
            fontSize: 132,
            lineHeight: 0.9,
            color: "#d62300",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            fontSize: 40,
            color: "#502314",
            marginTop: 18,
            display: "flex",
          }}
        >
          Abed &amp; Lynn
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 34,
            backgroundColor: "#ffc72c",
            borderRadius: 20,
            borderWidth: 6,
            borderStyle: "solid",
            borderColor: "#502314",
            paddingTop: 18,
            paddingBottom: 18,
            paddingLeft: 34,
            paddingRight: 34,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 40, color: "#502314", display: "flex" }}>
            {EVENT_WEEKDAY} {EVENT_DATE_LONG} · {EVENT_TIME}
          </div>
          {/* Lilita One, not the pixel face: Press Start 2P has no uppercase
              É, so "RAOUCHÉ" falls back to a lowercase glyph there. */}
          <div
            style={{
              fontSize: 30,
              color: "#502314",
              marginTop: 8,
              letterSpacing: 1,
              display: "flex",
            }}
          >
            {VENUE.name.toUpperCase()}, {VENUE.area.toUpperCase()}
          </div>
        </div>

        <div
          style={{
            fontSize: 30,
            color: "#502314",
            marginTop: 28,
            display: "flex",
          }}
        >
          Light colors · {FEE.amount} {FEE.per} · Yalla
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Lilita One", data: display, style: "normal", weight: 400 },
        { name: "Press Start 2P", data: pixel, style: "normal", weight: 400 },
      ],
    },
  );
}
