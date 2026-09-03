#!/bin/bash
# Turn assets/photos/*.jpg into the web assets in public/photos/.
#
# Requires: ImageMagick (magick), cwebp, and Swift (macOS). The two Swift
# helpers use Vision's VNGenerateForegroundInstanceMaskRequest, the same model
# behind Photos' "lift subject", to matte the people out of the background.
#
#   ./scripts/process-photos.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="$PWD/assets/photos"
OUT="$PWD/public/photos"
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
mkdir -p "$OUT"

echo "==> building Vision helpers"
swiftc -O scripts/lift.swift  -o "$T/lift"
swiftc -O scripts/faces.swift -o "$T/faces"

# Face rectangles, captured from `scripts/faces.swift` run on these exact
# originals. Re-run `"$T/faces" <photo>` if the source photos ever change.
#            x     y     w     h
CF_LYNN=" 236  1117   877   877"
CF_ABED="1096   634  1006  1006"
BK_ABED=" 345   701   832   832"
BK_LYNN="1120  1011   822   822"

echo "==> matting subjects"
"$T/lift" "$SRC/campfire.jpg" "$T/campfire-matte.png" >/dev/null
"$T/lift" "$SRC/bk-crown.jpg" "$T/bk-crown-matte.png" >/dev/null

# --------------------------------------------------------------------------
# Head stickers: transparent WebP. Crowns are drawn in React on top, so each
# instance can pick a different crown style.
# --------------------------------------------------------------------------
head_sticker() { # <matte> <fx> <fy> <fw> <fh> <out> [lift]
  local src=$1 fx=$2 fy=$3 fw=$4 fh=$5 out=$6 lift=${7:-0}
  local d; d=$(mktemp -d)

  local cx cy rx ry x y w h blur
  read -r cx cy rx ry x y w h blur <<<"$(python3 -c "
fx,fy,fw,fh = $fx,$fy,$fw,$fh
cx = fx + fw/2
cy = fy + fh/2 - 0.16*fh        # nudge up: face + hair, not just face
rx, ry = 0.72*fw, 0.98*fh       # a head is taller than it is wide
x = max(0, int(cx - rx*1.3)); y = max(0, int(cy - ry*1.3))
w, h = int(rx*2.6), int(ry*2.6)
print(int(cx-x), int(cy-y), int(rx), int(ry), x, y, w, h, max(4,int(rx*0.03)))
")"

  magick "$src" -colorspace sRGB -crop "${w}x${h}+${x}+${y}" +repage "$d/win.png"
  local ww wh
  read -r ww wh <<<"$(magick identify -format "%w %h" "$d/win.png")"

  # Feathered head-shaped stencil.
  magick -size "${ww}x${wh}" xc:none -fill white \
    -draw "ellipse $cx,$cy $rx,$ry 0,360" -blur "0x$blur" "$d/ell.png"
  # DstIn keeps pixels only where the Vision matte AND the ellipse are opaque,
  # so both the background and the neighbouring face drop away.
  magick "$d/win.png" "$d/ell.png" -compose DstIn -composite "$d/cut.png"

  # The ellipse can still clip a sliver of the person alongside. Keep only the
  # largest connected blob: the head dwarfs any leftover fragment.
  local area; area=$(python3 -c "print(int($ww*$wh*0.06))")
  magick "$d/cut.png" -alpha extract -threshold 50% \
    -define connected-components:area-threshold="$area" \
    -define connected-components:mean-color=true \
    -connected-components 8 -threshold 50% -blur 0x3 "$d/keep.png"
  magick "$d/cut.png" "$d/keep.png" -compose DstIn -composite "$d/clean.png"

  if [ "$lift" = "1" ]; then
    # The campfire shot is dark with a heavy warm cast; open it up so the face
    # still reads at ~100px on screen.
    magick "$d/clean.png" -channel RGB \
      -brightness-contrast 8x10 -modulate 104,94,100 +channel "$d/clean.png"
  fi

  # Die-cut white sticker outline: dilate the alpha, paint that white, then put
  # the head back on top of it.
  magick "$d/clean.png" -trim +repage -bordercolor none -border 34 "$d/pad.png"
  magick "$d/pad.png" -alpha extract -morphology Dilate Disk:15 \
    -blur 0x1.5 -level 40%,60% "$d/outline-a.png"
  # Keep the white layer in sRGB. A GrayAlpha first operand would drag the
  # whole composite to greyscale and silently strip the photo's colour.
  magick "$d/pad.png" -alpha off -fill white -colorize 100 \
    -colorspace sRGB "$d/whitefill.png"
  magick "$d/whitefill.png" "$d/outline-a.png" \
    -compose CopyOpacity -composite -colorspace sRGB "$d/outline.png"
  magick "$d/outline.png" -colorspace sRGB "$d/pad.png" -compose Over -composite \
    -colorspace sRGB -trim +repage -resize "420x420>" "$d/final.png"

  cwebp -quiet -q 82 -alpha_q 90 "$d/final.png" -o "$out"
  rm -rf "$d"
}

echo "==> head stickers"
# shellcheck disable=SC2086
head_sticker "$T/campfire-matte.png" $CF_ABED "$OUT/head-abed-campfire.webp" 1
# shellcheck disable=SC2086
head_sticker "$T/campfire-matte.png" $CF_LYNN "$OUT/head-lynn-campfire.webp" 1
# shellcheck disable=SC2086
head_sticker "$T/bk-crown-matte.png" $BK_ABED "$OUT/head-abed-bk.webp"
# shellcheck disable=SC2086
head_sticker "$T/bk-crown-matte.png" $BK_LYNN "$OUT/head-lynn-bk.webp"

# --------------------------------------------------------------------------
# Hero reveal photo. A parked car's licence plate is legible in the original
# and must not ship (CLAUDE.md hard rule 5), so it gets pixelated first.
# --------------------------------------------------------------------------
echo "==> hero"
magick "$SRC/mirror-selfie.jpg" -auto-orient "$T/ms.png"
magick "$T/ms.png" \
  \( -clone 0 -crop 484x300+2540+3555 +repage -scale 5% -scale 2000% \) \
  -geometry +2540+3555 -compose Over -composite "$T/ms-clean.png"
magick "$T/ms-clean.png" -crop 2674x3565+350+440 +repage \
  -resize 1000x -strip "$T/hero.png"
cwebp -quiet -q 80 "$T/hero.png" -o "$OUT/hero-mirror.webp"

# Tiny blurred copy, inlined as the next/image blurDataURL placeholder.
magick "$T/hero.png" -resize 16x -blur 0x1 -strip "$T/hero-tiny.png"
cwebp -quiet -q 40 "$T/hero-tiny.png" -o "$T/hero-tiny.webp"
printf 'data:image/webp;base64,%s\n' "$(base64 < "$T/hero-tiny.webp" | tr -d '\n')" \
  > "$OUT/hero-mirror.blur.txt"

# --------------------------------------------------------------------------
# Polaroid photos (square; frame, tape and rotation are CSS).
# --------------------------------------------------------------------------
echo "==> polaroids"
magick "$SRC/campfire.jpg" -auto-orient -crop 2316x2316+0+380 +repage \
  -brightness-contrast 10x12 -modulate 106,90,100 -resize 640x -strip "$T/pola-cf.png"
cwebp -quiet -q 80 "$T/pola-cf.png" -o "$OUT/polaroid-campfire.webp"

magick "$SRC/bk-crown.jpg" -auto-orient -crop 2316x2316+0+400 +repage \
  -resize 640x -strip "$T/pola-bk.png"
cwebp -quiet -q 80 "$T/pola-bk.png" -o "$OUT/polaroid-bk-crown.webp"

echo
printf '%-30s %8s  %s\n' FILE BYTES DIMS
for f in "$OUT"/*.webp; do
  printf '%-30s %8s  %s\n' "$(basename "$f")" "$(stat -f%z "$f")" \
    "$(magick identify -format '%wx%h' "$f")"
done
total=$(find "$OUT" -name '*.webp' -exec stat -f%z {} + | awk '{s+=$1} END {print s}')
echo "TOTAL: $total bytes ($((total/1024)) KB)"
