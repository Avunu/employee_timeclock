# Copyright (c) 2026, Avunu LLC and Contributors
# See license.txt

"""Tests for the kiosk pages as installable apps (``employee_timeclock.kiosk_pwa``)."""

import json
import struct
from pathlib import Path

import frappe
from frappe.tests import IntegrationTestCase
from frappe.tests.classes.context_managers import set_user
from frappe.website.path_resolver import PathResolver

from employee_timeclock.kiosk_pwa import (
	ICON_DIR,
	KIOSK_APPS,
	MANIFEST_FILE,
	THEME_COLOR,
	WORKER_FILE,
	KioskAppRenderer,
	get_head_context,
	get_manifest,
)

APP_DIR = Path(frappe.get_app_path("employee_timeclock"))
ICONS = APP_DIR / "public" / "images" / "kiosk"


def _png_size(path: Path) -> tuple[int, int]:
	"""Width and height from a PNG's IHDR chunk - no imaging library needed."""
	header = path.read_bytes()[:24]
	assert header[:8] == b"\x89PNG\r\n\x1a\n", f"{path.name} isn't a PNG"
	return struct.unpack(">II", header[16:24])


def _icon_file(src: str) -> Path:
	assert src.startswith(f"{ICON_DIR}/"), src
	return ICONS / src.removeprefix(f"{ICON_DIR}/")


class TestRegistry(IntegrationTestCase):
	def test_every_kiosk_app_is_a_page_under_www(self) -> None:
		for key in KIOSK_APPS:
			with self.subTest(app=key):
				self.assertTrue((APP_DIR / "www" / key / "index.html").exists())

	def test_a_short_name_fits_under_a_home_screen_icon(self) -> None:
		# Launchers cut a label off at about a dozen characters.
		for key, app in KIOSK_APPS.items():
			with self.subTest(app=key):
				self.assertLessEqual(len(app.short_name), 12)


class TestIcons(IntegrationTestCase):
	def test_every_icon_the_manifest_names_exists_at_the_size_it_claims(self) -> None:
		for key in KIOSK_APPS:
			for icon in get_manifest(key)["icons"]:
				with self.subTest(app=key, icon=icon["src"]):
					width, height = (int(side) for side in icon["sizes"].split("x"))
					self.assertEqual(_png_size(_icon_file(icon["src"])), (width, height))

	def test_the_apple_touch_icon_exists_at_180(self) -> None:
		for key in KIOSK_APPS:
			with self.subTest(app=key):
				self.assertEqual(
					_png_size(_icon_file(get_head_context(key)["apple_touch_icon_url"])), (180, 180)
				)


class TestManifest(IntegrationTestCase):
	def test_the_app_is_its_own_page_and_nothing_wider(self) -> None:
		for key in KIOSK_APPS:
			with self.subTest(app=key):
				manifest = get_manifest(key)
				self.assertEqual(manifest["start_url"], f"/{key}")
				self.assertEqual(manifest["scope"], f"/{key}")
				# The browser keys an install on this, so it must differ per page.
				self.assertEqual(manifest["id"], f"/{key}")

	def test_it_has_what_a_browser_needs_to_offer_installing(self) -> None:
		for key, app in KIOSK_APPS.items():
			with self.subTest(app=key):
				manifest = get_manifest(key)
				self.assertEqual(manifest["name"], app.name)
				self.assertEqual(manifest["display"], "standalone")
				self.assertEqual(manifest["display_override"], ["fullscreen"])
				sizes = {icon["sizes"] for icon in manifest["icons"]}
				self.assertTrue({"192x192", "512x512"} <= sizes)
				self.assertIn("maskable", {icon["purpose"] for icon in manifest["icons"]})

	def test_the_colours_match_the_dark_toolbar(self) -> None:
		manifest = get_manifest("timeclock")
		self.assertEqual(manifest["theme_color"], THEME_COLOR)
		self.assertEqual(manifest["background_color"], THEME_COLOR)


class TestKioskHead(IntegrationTestCase):
	def test_the_head_tags_point_at_that_pages_own_files(self) -> None:
		for key in KIOSK_APPS:
			with self.subTest(app=key):
				html = frappe.render_template(
					"employee_timeclock/templates/includes/kiosk_head.html", {"pwa": get_head_context(key)}
				)
				self.assertIn(f'href="/{key}/{MANIFEST_FILE}"', html)
				self.assertIn(f"{key}-apple-touch-180.png", html)
				self.assertIn(f'content="{THEME_COLOR}"', html)
				self.assertIn(KIOSK_APPS[key].short_name, html)


class TestKioskAppRenderer(IntegrationTestCase):
	def test_it_claims_each_pages_manifest_and_worker(self) -> None:
		for key in KIOSK_APPS:
			for file in (MANIFEST_FILE, WORKER_FILE):
				with self.subTest(path=f"{key}/{file}"):
					self.assertTrue(KioskAppRenderer(f"{key}/{file}").can_render())

	def test_it_leaves_everything_else_alone(self) -> None:
		for path in (
			"timeclock",
			"timeclock/",
			"timeclock/other.js",
			"timeclock/manifest.json",
			"job_timeclock/sw.js",
			"employee-timeclock/sw.js",
			"sw.js",
			"timeclock/sw.js/extra",
		):
			with self.subTest(path=path):
				self.assertFalse(KioskAppRenderer(path).can_render())

	def test_the_manifest_is_served_as_json_with_the_right_type(self) -> None:
		response = KioskAppRenderer(f"timeclock/{MANIFEST_FILE}").render()

		self.assertTrue(response.content_type.startswith("application/manifest+json"))
		self.assertEqual(json.loads(response.get_data(as_text=True)), get_manifest("timeclock"))

	def test_the_worker_may_control_its_own_pages_route_and_no_other(self) -> None:
		for key in KIOSK_APPS:
			with self.subTest(app=key):
				response = KioskAppRenderer(f"{key}/{WORKER_FILE}").render()

				# A worker's default reach is the folder it is served from,
				# /<page>/, which stops short of the page's own address.
				self.assertEqual(response.headers["Service-Worker-Allowed"], f"/{key}")
				self.assertTrue(response.content_type.startswith("text/javascript"))
				self.assertIn("addEventListener", response.get_data(as_text=True))

	def test_neither_file_is_left_to_go_stale_in_a_cache(self) -> None:
		for file in (MANIFEST_FILE, WORKER_FILE):
			with self.subTest(file=file):
				response = KioskAppRenderer(f"timeclock/{file}").render()
				self.assertEqual(response.headers["Cache-Control"], "no-cache")

	def test_frappe_picks_it_over_its_own_renderers(self) -> None:
		self.assertIn("employee_timeclock.kiosk_pwa.KioskAppRenderer", frappe.get_hooks("page_renderer"))
		for file in (MANIFEST_FILE, WORKER_FILE):
			with self.subTest(file=file):
				_endpoint, renderer = PathResolver(f"timeclock/{file}").resolve()
				self.assertIsInstance(renderer, KioskAppRenderer)

	def test_it_asks_nothing_of_the_visitor(self) -> None:
		# A browser fetches a manifest and a worker without credentials, so
		# neither may sit behind the login the page itself has.
		with set_user("Guest"):
			for file in (MANIFEST_FILE, WORKER_FILE):
				with self.subTest(file=file):
					self.assertEqual(KioskAppRenderer(f"timeclock/{file}").render().status_code, 200)
