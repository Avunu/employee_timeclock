# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""The signing key for the badge-scan (RFID) tokens the timeclock pages issue."""

import frappe
from frappe import _
from frappe.utils.password import get_encryption_key

from employee_timeclock.kiosk import KioskAuthenticationError


def get_token_secret() -> str:
	"""Return the key the timeclock's JWTs are signed and verified with: the site's ``encryption_key``.

	It is read per request, from the site being served. A site that has no ``encryption_key`` yet
	gets one, generated and saved to its ``site_config.json`` the way frappe does the first time it
	encrypts a password. It still fails closed: a site whose ``encryption_key`` is set but empty can
	neither issue nor accept tokens, because a token signed with an empty key can be forged by anyone.

	Raises:
		KioskAuthenticationError: The site's ``encryption_key`` is empty. A subclass, so the kiosk
			user is not signed out.
	"""
	secret = get_encryption_key()
	if not secret:
		frappe.throw(
			_("Badge sign-in is unavailable: the site has no encryption key."),
			exc=KioskAuthenticationError,
		)
	return str(secret)
