// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { type Config } from "postcss-load-config";

const config: Config = {
	plugins: {
		"tailwindcss/nesting": {},
		tailwindcss: {},
		autoprefixer: {},
	},
};

export default config;
