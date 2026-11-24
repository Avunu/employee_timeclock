// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
	presets: [require("./node_modules/frappe-ui/tailwind/preset.js")],
	content: [
		"./employee_timeclock/public/js/**/*.{html,vue,js,ts,jsx,tsx}",
		"./employee_timeclock/www/**/*.{html,vue,js,ts,jsx,tsx}",
		"./node_modules/frappe-ui/src/components/**/*.{vue,js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			// frappe-ui's plugin replaces the entire fontSize scale with its own tokens;
			// restore Tailwind's defaults so standard classes like text-4xl still work.
			fontSize: defaultTheme.fontSize,
			// frappe-ui 1.x also replaces the color palette, the border radius scale and the box
			// shadows. Pin the 0.1.278 values for the names this app uses, so the upgrade does not
			// change how the app looks. Moving to the 1.x palette and scales is a visual change to
			// make on its own.
			colors: {
				gray: {
					50: "#F8F8F8",
					100: "#F3F3F3",
					200: "#EDEDED",
					300: "#E2E2E2",
					400: "#C7C7C7",
					500: "#999999",
					600: "#7C7C7C",
					700: "#525252",
					800: "#383838",
					900: "#171717",
				},
				orange: {
					50: "#FFF9F5",
					100: "#FFEFE4",
					200: "#FFDEC5",
					300: "#FFCBA3",
					400: "#F4B07F",
					500: "#E86C13",
					600: "#D45A08",
					700: "#BD3E0C",
					800: "#9E3513",
					900: "#6B2711",
				},
				green: {
					50: "#F2FDF4",
					100: "#E4FAEB",
					200: "#C3F9D3",
					300: "#A6EFC0",
					400: "#86E0A8",
					500: "#46B37E",
					600: "#278F5E",
					700: "#137949",
					800: "#075E35",
					900: "#173B2C",
				},
				red: {
					50: "#FFF7F7",
					100: "#FFE7E7",
					200: "#FFD8D8",
					300: "#FDC2C2",
					400: "#F79596",
					500: "#E03636",
					600: "#CC2929",
					700: "#B52A2A",
					800: "#941F1F",
					900: "#6B1515",
				},
				blue: {
					50: "#F2F9FF",
					100: "#E6F4FF",
					200: "#C8E6FF",
					300: "#A7D7FD",
					400: "#73BBF6",
					500: "#0289F7",
					600: "#007BE0",
					700: "#0070CC",
					800: "#005CA3",
					900: "#004880",
				},
				amber: {
					50: "#FDFAED",
					100: "#FFF7D3",
					200: "#FEEDA9",
					300: "#FBDB73",
					400: "#FBCC55",
					500: "#E79913",
					600: "#DB7706",
					700: "#B35309",
					800: "#91400D",
					900: "#763813",
				},
				teal: {
					50: "#F0FDFA",
					100: "#E6F7F4",
					200: "#BAE8E1",
					300: "#97DED4",
					400: "#73D1C4",
					500: "#36BAAD",
					600: "#0B9E92",
					700: "#0F736B",
					800: "#115C57",
					900: "#114541",
				},
			},
			borderRadius: {
				sm: "0.25rem",
				DEFAULT: "0.5rem",
				md: "0.625rem",
				lg: "0.75rem",
				xl: "1rem",
				"2xl": "1.25rem",
			},
			boxShadow: {
				sm: "0px 1px 2px rgba(0, 0, 0, 0.1)",
				DEFAULT: "0px 0px 1px rgba(0, 0, 0, 0.45), 0px 1px 2px rgba(0, 0, 0, 0.1)",
				md: "0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0.5px 2px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.16)",
				lg: "0px 0px 1px rgba(0, 0, 0, 0.35), 0px 6px 8px -4px rgba(0, 0, 0, 0.1)",
				xl: "0px 0px 1px rgba(0, 0, 0, 0.19), 0px 1px 2px rgba(0, 0, 0, 0.07), 0px 6px 15px -5px rgba(0, 0, 0, 0.11)",
				"2xl":
					"0px 0px 1px rgba(0, 0, 0, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 24px -3px rgba(0, 0, 0, 0.1)",
			},
		},
	},
	plugins: [],
};

export default config;
