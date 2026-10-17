// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
	presets: [require("./node_modules/frappe-ui/tailwind/preset.js")],
	content: [
		"./timeclock/public/js/**/*.{html,vue,js,ts,jsx,tsx}",
		"./timeclock/www/**/*.{html,vue,js,ts,jsx,tsx}",
		"./node_modules/frappe-ui/src/components/**/*.{vue,js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			// frappe-ui's plugin replaces the entire fontSize scale with its own tokens;
			// restore Tailwind's defaults so standard classes like text-4xl still work.
			fontSize: defaultTheme.fontSize,
		},
	},
	plugins: [],
};

export default config;
