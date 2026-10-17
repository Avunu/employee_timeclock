// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { createRequire } from "module";
import type { Plugin, ResolvedConfig } from "vite";

// frappe-ui's components declare props with imported types, which Vue's SFC compiler resolves
// through TypeScript's JS API. The app's `typescript` is the native TS 7 build, which has none, so
// point the compiler at the TS 6 copy (the `typescript6` alias), the same instance plugin-vue loads.
const require = createRequire(import.meta.url);
require("vue/compiler-sfc").registerTS(() => require("typescript6"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @tiptap v3 ships source-only (no dist/). This plugin resolves all @tiptap/*
// imports to their TypeScript source so Rolldown can compile them directly.
function tiptapSourcePlugin(): Plugin {
	return {
		name: "tiptap-source-resolve",
		enforce: "pre",
		resolveId(id) {
			if (!id.startsWith("@tiptap/")) return;
			const m = id.match(/^(@tiptap\/[^/]+)(\/.*)?$/);
			if (!m) return;
			const [, pkg, subpath] = m;
			const pkgRoot = resolve(__dirname, `node_modules/${pkg}`);
			if (!existsSync(pkgRoot)) return;
			const hasSrc = existsSync(resolve(pkgRoot, "src"));
			const srcRoot = hasSrc ? resolve(pkgRoot, "src") : pkgRoot;
			if (subpath) {
				const candidate = resolve(srcRoot, subpath.slice(1));
				if (existsSync(`${candidate}.ts`)) return `${candidate}.ts`;
				const index = resolve(candidate, "index.ts");
				if (existsSync(index)) return index;
			} else {
				const index = resolve(srcRoot, "index.ts");
				if (existsSync(index)) return index;
			}
		},
	};
}

function frappeNotifyPlugin(changedFiles: string[]): Plugin {
	let isFirstBuild = true;
	let resolvedConfig: ResolvedConfig;

	return {
		name: "frappe-notify",
		configResolved(config) {
			resolvedConfig = config;
		},
		closeBundle() {
			const isWatch = !!resolvedConfig?.build?.watch;

			if (isFirstBuild) {
				isFirstBuild = false;
				return;
			}

			if (isWatch) notifyFrappeReload(changedFiles);
		},
	};
}

async function notifyFrappeReload(changedFiles: string[]) {
	try {
		const redisUrl = process.env.FRAPPE_REDIS_QUEUE || "redis://localhost:13000";
		const { createClient } = await import("@redis/client");
		const client = createClient({ url: redisUrl });

		await client.connect();
		await client.publish(
			"events",
			JSON.stringify({
				event: "build_event",
				message: {
					success: true,
					changed_files: changedFiles,
					live_reload: true,
				},
			}),
		);
		await client.disconnect();
	} catch (error) {
		console.log(`🔄 ${changedFiles.join(", ")} rebuilt - please refresh your browser manually`);
		console.warn("⚠️  Could not connect to Redis for live reload:", (error as Error).message);
	}
}

// Get the app name from environment variable (defaults to 'timeclock')
const appName = process.env.VITE_APP || "timeclock";

interface AppConfig {
	/** The bundle name: the build writes `<bundle>.bundle.[hash].js|css`, which the `www` page loads by
	 * that name through `bundled_asset`. Not `timeclock`: esbuild already builds `timeclock.bundle.css`. */
	bundle: string;
	entry: string;
	srcDir: string;
}

// Map of app configurations
// Source: public/js/<app>  |  Output: public/dist/{js,css}/<bundle>.bundle.[hash].*
const appConfigs: Record<string, AppConfig> = {
	timeclock: {
		bundle: "timeclock_kiosk",
		entry: "timeclock.ts",
		srcDir: "timeclock/public/js/timeclock",
	},
	job_timeclock: {
		bundle: "job_timeclock",
		entry: "job_timeclock.ts",
		srcDir: "timeclock/public/js/job_timeclock",
	},
};

const config = appConfigs[appName];
if (!config) {
	throw new Error(`Unknown app: ${appName}. Valid apps: ${Object.keys(appConfigs).join(", ")}`);
}

export default defineConfig({
	plugins: [
		tiptapSourcePlugin(),
		Vue(),
		Icons({
			compiler: "vue3",
			autoInstall: true,
		}),
		Components({
			dts: true,
			resolvers: [IconsResolver()],
		}),
		frappeNotifyPlugin([`${config.bundle}.bundle.js`]),
	],
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
	build: {
		outDir: resolve(__dirname, "timeclock/public/dist"),
		// esbuild's bundles and the other SPA's build live here too
		emptyOutDir: false,
		// one manifest per SPA, so the second build does not overwrite the first's;
		// scripts/vite-register.mjs reads every .vite/manifest*.json
		manifest: `.vite/manifest.${appName}.json`,
		target: "es2020",
		minify: true,
		lib: {
			entry: resolve(__dirname, config.srcDir, config.entry),
			formats: ["es"],
		},
		rolldownOptions: {
			output: {
				entryFileNames: `js/${config.bundle}.bundle.[hash].js`,
				chunkFileNames: `js/${config.bundle}-[name]-[hash].js`,
				assetFileNames: `css/${config.bundle}.bundle.[hash][extname]`,
			},
		},
		sourcemap: true,
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, config.srcDir),
		},
	},
});
