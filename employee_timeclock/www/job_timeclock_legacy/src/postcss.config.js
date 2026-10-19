// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// postcss.config.js
module.exports = {
	plugins: {
		"postcss-import": {},
		tailwindcss: {},
		autoprefixer: {},
	},
	presets: [require("frappe-ui/src/utils/tailwind.config")],
};
