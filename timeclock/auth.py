# Copyright (c) 2026, Avunu LLC and contributors
# For license information, please see license.txt

"""The signing key for the badge-scan (RFID) tokens the timeclock pages issue."""

import frappe
from frappe import _


def get_token_secret() -> str:
	"""Return the key the timeclock's JWTs are signed and verified with: the site's ``encryption_key``.

	It is read per request, from the site being served, and it fails closed: a site without an
	``encryption_key`` can neither issue nor accept tokens, because a token signed with an empty
	key can be forged by anyone.

	Raises:
		frappe.AuthenticationError: The site has no ``encryption_key``.
	"""
	secret = frappe.conf.get("encryption_key")
	if not secret:
		frappe.throw(
			_("Badge sign-in is unavailable: the site has no encryption key."),
			exc=frappe.AuthenticationError,
		)
	return str(secret)
