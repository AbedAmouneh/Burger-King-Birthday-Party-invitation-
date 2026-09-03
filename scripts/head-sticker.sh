#!/bin/bash
# head-sticker.sh <matte.png> <faceX> <faceY> <faceW> <faceH> <out.webp> [roll]
#
# Cuts one die-cut head sticker out of a Vision subject matte, given a face
# rectangle from scripts/faces.swift. Exits non-zero if nothing usable is left.
set -euo pipefail
src=$1; fx=$2; fy=$3; fw=$4; fh=$5; out=$6; roll=${7:-0}
d=$(mktemp -d); trap 'rm -rf "$d"' EXIT

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
read -r ww wh <<<"$(magick identify -format "%w %h" "$d/win.png")"

# Feathered head-shaped stencil, rotated to match how the head is tilted.
# Vision reports roll in radians; an axis-aligned ellipse crops a leaning head
# at the wrong angle and the sticker comes out sideways.
deg=$(python3 -c "import math; print(round(math.degrees($roll), 2))")
magick -size "${ww}x${wh}" xc:none -fill white \
  -draw "translate $cx,$cy rotate $deg ellipse 0,0 $rx,$ry 0,360" \
  -blur "0x$blur" "$d/ell.png"
# DstIn keeps pixels only where the Vision matte AND the ellipse are opaque,
# so both the background and any neighbouring face drop away.
magick "$d/win.png" "$d/ell.png" -compose DstIn -composite "$d/cut.png"

# The ellipse can still clip a sliver of the person alongside. Keep only the
# largest connected blob: the head dwarfs any leftover fragment.
area=$(python3 -c "print(int($ww*$wh*0.06))")
magick "$d/cut.png" -alpha extract -threshold 50% \
  -define connected-components:area-threshold="$area" \
  -define connected-components:mean-color=true \
  -connected-components 8 -threshold 50% -blur 0x3 "$d/keep.png"
magick "$d/cut.png" "$d/keep.png" -compose DstIn -composite "$d/clean.png"

# Bail out if the matte had nothing here (a face Vision found but did not
# segment, e.g. a reflection or someone in the background).
opacity=$(magick "$d/clean.png" -alpha extract -format "%[fx:mean]" info:)
python3 -c "import sys; sys.exit(0 if $opacity > 0.06 else 1)" || {
  echo "    (matte empty for this face)" >&2; exit 1; }

# Die-cut white outline: dilate the alpha, paint it white, head back on top.
magick "$d/clean.png" -trim +repage -bordercolor none -border 34 "$d/pad.png"
magick "$d/pad.png" -alpha extract -morphology Dilate Disk:15 \
  -blur 0x1.5 -level 40%,60% "$d/outline-a.png"
# Keep the white layer in sRGB: a GrayAlpha first operand would drag the whole
# composite to greyscale and silently strip the photo's colour.
magick "$d/pad.png" -alpha off -fill white -colorize 100 \
  -colorspace sRGB "$d/whitefill.png"
magick "$d/whitefill.png" "$d/outline-a.png" \
  -compose CopyOpacity -composite -colorspace sRGB "$d/outline.png"
magick "$d/outline.png" -colorspace sRGB "$d/pad.png" -compose Over -composite \
  -colorspace sRGB -trim +repage "$d/composited.png"

# Stand the face up. Cropping at the head's angle is not enough: someone
# leaning on a shoulder still yields a sideways sticker. Counter-rotating by
# the roll makes every head upright, and the React component adds its own
# decorative tilt on top.
magick "$d/composited.png" -background none -rotate "$(python3 -c "print(-1 * $deg)")" \
  -trim +repage -resize "420x420>" "$d/final.png"

cwebp -quiet -q 82 -alpha_q 90 "$d/final.png" -o "$out"
