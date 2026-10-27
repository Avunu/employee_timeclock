// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { mountKiosk } from "../../../public/js/kiosk/mount";
import { App } from "./App";
import { NfcProbe } from "./components/NfcProbe";

// /timeclock?probe=nfc: the temporary NFC probe, for finding out what the tablet reads from a badge.
const probe = new URLSearchParams(window.location.search).get("probe") === "nfc";

mountKiosk(probe ? <NfcProbe /> : <App />);
