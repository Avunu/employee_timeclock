# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""The kiosk pages as installable apps.

Each kiosk page under www/ is its own app: its
own name, its own icon, its own web app manifest, installed to a tablet's home
screen on its own. This module is the one place that names them, builds each
manifest, and serves the two files a page needs that Frappe can't serve from
www/ (its static pages refuse .js and .json):

    /<page>/manifest.webmanifest   what the browser reads to install the page
    /<page>/sw.js                  its service worker

The service worker caches only the page's built JS, CSS and images, so an
installed app opens fast, and the last copy of the page, so it opens offline
too. It never caches a call to the server: each page keeps what it needs itself.

Icons are drawn by tools/build_kiosk_icons.py into public/images/kiosk/.
Front-end counterpart: public/js/kiosk/serviceWorker.ts, which registers it.
"""

import json
from pathlib import Path
from typing import Any, NamedTuple

import frappe
from frappe.website.page_renderers.base_renderer import BaseRenderer
from werkzeug.wrappers import Response

# The dark toolbar's colour (Carbon's g100 background). The browser tints its
# own chrome with it, and an installed app's splash screen starts on it.
THEME_COLOR = "#161616"

MANIFEST_FILE = "manifest.webmanifest"
WORKER_FILE = "sw.js"

ICON_DIR = "/assets/employee_timeclock/images/kiosk"


class KioskApp(NamedTuple):
	name: str
	# What fits under an icon on a home screen.
	short_name: str
	description: str


# Keyed by the page's www/ folder name, which is also its route and the stem of
# its icon files. tools/build_kiosk_icons.py draws an icon for each key.
KIOSK_APPS: dict[str, KioskApp] = {
	"timeclock": KioskApp(
		name="Timeclock",
		short_name="Timeclock",
		description="Scan your badge to clock in and out.",
	),
	"job_timeclock": KioskApp(
		name="Project Tracker",
		short_name="Tracker",
		description="Track your time on work orders.",
	),
}


def service_worker_source() -> str:
	"""The one worker every kiosk page runs: public/js/kiosk-sw.js."""
	return Path(frappe.get_app_path("employee_timeclock", "public", "js", "kiosk-sw.js")).read_text()


def get_manifest(app: str) -> dict[str, Any]:
	"""The web app manifest for the kiosk page `app`.

	The scope is the page's own route, so the installed app is that one page:
	following a link out of it (Use old timeclock) leaves the app, and the
	browser shows it in its own window rather than inside the app.
	"""
	route = f"/{app}"
	return {
		# Its own identity, so each page installs as its own app.
		"id": route,
		"name": KIOSK_APPS[app].name,
		"short_name": KIOSK_APPS[app].short_name,
		"description": KIOSK_APPS[app].description,
		"start_url": route,
		"scope": route,
		# A wall-mounted tablet has no use for the status bar; a browser that
		# can't go full screen falls back to standalone, still with no address bar.
		"display_override": ["fullscreen"],
		"display": "standalone",
		"background_color": THEME_COLOR,
		"theme_color": THEME_COLOR,
		"icons": [
			{"src": f"{ICON_DIR}/{app}-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
			{"src": f"{ICON_DIR}/{app}-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
			# Full-bleed, for launchers that crop icons to their own shape.
			{
				"src": f"{ICON_DIR}/{app}-maskable-512.png",
				"sizes": "512x512",
				"type": "image/png",
				"purpose": "maskable",
			},
		],
	}


def get_head_context(app: str) -> dict[str, str]:
	"""What templates/includes/kiosk_head.html puts in a page's <head>."""
	return {
		"name": KIOSK_APPS[app].name,
		"short_name": KIOSK_APPS[app].short_name,
		"theme_color": THEME_COLOR,
		"manifest_url": f"/{app}/{MANIFEST_FILE}",
		"icon_url": f"{ICON_DIR}/{app}-192.png",
		# iOS ignores the manifest's icons and takes this one, rounding it itself.
		"apple_touch_icon_url": f"{ICON_DIR}/{app}-apple-touch-180.png",
	}


class KioskAppRenderer(BaseRenderer):
	"""Serves a kiosk page's manifest and service worker (see the module docs).

	Registered as a `page_renderer` hook, which Frappe tries before its own
	renderers, so nothing under www/ has to stand in for these paths.
	"""

	def __init__(self, path: str, http_status_code: int | None = None):
		super().__init__(path=path, http_status_code=http_status_code)
		self.app, _, self.file = self.path.partition("/")

	def can_render(self) -> bool:
		return self.app in KIOSK_APPS and self.file in (MANIFEST_FILE, WORKER_FILE)

	def render(self) -> Response:
		if self.file == MANIFEST_FILE:
			response = Response(
				json.dumps(get_manifest(self.app), indent="\t"),
				content_type="application/manifest+json; charset=utf-8",
			)
		else:
			response = Response(
				service_worker_source(),
				content_type="text/javascript; charset=utf-8",
			)
			# A worker may only control the folder it is served from, which for
			# /<page>/sw.js is /<page>/ - and the page itself is /<page>, outside
			# it. This lets it control the page's own route as well.
			response.headers["Service-Worker-Allowed"] = f"/{self.app}"
		# Cheap to refetch, and a stale manifest or worker is worse than a request.
		response.headers["Cache-Control"] = "no-cache"
		response.headers["X-Content-Type-Options"] = "nosniff"
		return response
