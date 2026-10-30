# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""Draws the kiosk pages' app icons into public/images/kiosk/.

Each page gets its own Carbon glyph in white on a tile in its own Carbon
colour, so kiosk apps are told apart on a home screen. The outputs are
committed, so nothing at deploy time needs Inkscape - this only has to be run
when an icon or colour changes:

    python tools/build_kiosk_icons.py

Per page it writes, under <key> (the page's www/ folder name):

    <key>.svg                   the rounded tile, vector
    <key>-192.png, -512.png     "any" icons, rounded, transparent corners
    <key>-maskable-512.png      full-bleed, glyph inside the 80% safe circle
                                (Android crops it to its own shape)
    <key>-apple-touch-180.png   full-bleed and opaque (iOS rounds it itself)

Needs `inkscape` on PATH. The glyphs are Carbon's, Apache-2.0 - see
kiosk_icon_glyphs/NOTICE.md.
"""

import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
GLYPHS = ROOT / "kiosk_icon_glyphs"
OUT = ROOT.parent / "employee_timeclock" / "public" / "images" / "kiosk"

# page folder name -> (Carbon glyph, Carbon colour). Keep in step with
# KIOSK_APPS in employee_timeclock/kiosk_pwa.py, which names the same pages.
ICONS = {
	"timeclock": ("time", "#0f62fe"),  # blue 60
	"job_timeclock": ("timer", "#198038"),  # green 60
}

SIZE = 512  # the drawing's own size; PNGs are scaled from it
GLYPH_UNITS = 32  # Carbon's icons are drawn on a 32 x 32 grid
TILE_RADIUS = 112
# How big the glyph is on the tile. The maskable one sits inside the 80%
# diameter circle that is all an Android launcher promises to keep.
GLYPH_PX_ROUNDED = 288
GLYPH_PX_FULL_BLEED = 256


def glyph_paths(name: str) -> str:
	svg = (GLYPHS / f"{name}.svg").read_text()
	match = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.DOTALL)
	if not match:
		sys.exit(f"{name}.svg isn't an <svg> document")
	return match.group(1)


def tile(glyph: str, color: str, *, rounded: bool, glyph_px: int) -> str:
	offset = (SIZE - glyph_px) / 2
	scale = glyph_px / GLYPH_UNITS
	radius = f' rx="{TILE_RADIUS}"' if rounded else ""
	return (
		f'<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}" viewBox="0 0 {SIZE} {SIZE}">'
		f'<rect width="{SIZE}" height="{SIZE}"{radius} fill="{color}"/>'
		f'<g transform="translate({offset} {offset}) scale({scale})" fill="#ffffff">{glyph_paths(glyph)}</g>'
		"</svg>\n"
	)


def render(svg_path: Path, png_path: Path, size: int) -> None:
	subprocess.run(
		[
			"inkscape",
			str(svg_path),
			"--export-type=png",
			f"--export-filename={png_path}",
			f"--export-width={size}",
			f"--export-height={size}",
		],
		check=True,
		capture_output=True,
	)


def main() -> None:
	OUT.mkdir(parents=True, exist_ok=True)
	with tempfile.TemporaryDirectory() as scratch:
		full_bleed_svg = Path(scratch) / "full-bleed.svg"
		for key, (glyph, color) in ICONS.items():
			rounded = tile(glyph, color, rounded=True, glyph_px=GLYPH_PX_ROUNDED)
			(OUT / f"{key}.svg").write_text(rounded)
			render(OUT / f"{key}.svg", OUT / f"{key}-192.png", 192)
			render(OUT / f"{key}.svg", OUT / f"{key}-512.png", 512)

			full_bleed_svg.write_text(tile(glyph, color, rounded=False, glyph_px=GLYPH_PX_FULL_BLEED))
			render(full_bleed_svg, OUT / f"{key}-maskable-512.png", 512)
			render(full_bleed_svg, OUT / f"{key}-apple-touch-180.png", 180)
			print(f"{key}: {glyph} on {color}")  # noqa: T201 - a command-line tool reporting what it drew


if __name__ == "__main__":
	main()
