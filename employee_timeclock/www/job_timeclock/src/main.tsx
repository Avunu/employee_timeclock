// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { mountKiosk } from "../../../public/js/kiosk/mount";
import { App } from "./App";

// Realtime on: machine timers change from other tablets.
mountKiosk(<App />, { realtime: true });
