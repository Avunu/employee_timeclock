import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import type { Plugin, ResolvedConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// @tiptap v3 ships source-only (no dist/). This plugin resolves all @tiptap/*
// imports to their TypeScript source so Rolldown can compile them directly.
function tiptapSourcePlugin(): Plugin {
	return {
		name: 'tiptap-source-resolve',
		enforce: 'pre',
		resolveId(id) {
			if (!id.startsWith('@tiptap/')) return
			const m = id.match(/^(@tiptap\/[^/]+)(\/.*)?$/)
			if (!m) return
			const [, pkg, subpath] = m
			const pkgRoot = resolve(__dirname, `node_modules/${pkg}`)
			if (!existsSync(pkgRoot)) return
			const hasSrc = existsSync(resolve(pkgRoot, 'src'))
			const srcRoot = hasSrc ? resolve(pkgRoot, 'src') : pkgRoot
			if (subpath) {
				const candidate = resolve(srcRoot, subpath.slice(1))
				if (existsSync(`${candidate}.ts`)) return `${candidate}.ts`
				const index = resolve(candidate, 'index.ts')
				if (existsSync(index)) return index
			} else {
				const index = resolve(srcRoot, 'index.ts')
				if (existsSync(index)) return index
			}
		},
	}
}

function frappeNotifyPlugin(changedFiles: string[]): Plugin {
	let isFirstBuild = true
	let resolvedConfig: ResolvedConfig

	return {
		name: 'frappe-notify',
		configResolved(config) {
			resolvedConfig = config
		},
		closeBundle() {
			const isWatch = !!resolvedConfig?.build?.watch

			if (isFirstBuild) {
				isFirstBuild = false
				return
			}

			if (isWatch) notifyFrappeReload(changedFiles)
		},
	}
}

async function notifyFrappeReload(changedFiles: string[]) {
	try {
		const redisUrl = process.env.FRAPPE_REDIS_QUEUE || 'redis://localhost:13000'
		const { createClient } = await import('@redis/client')
		const client = createClient({ url: redisUrl })

		await client.connect()
		await client.publish(
			'events',
			JSON.stringify({
				event: 'build_event',
				message: {
					success: true,
					changed_files: changedFiles,
					live_reload: true,
				},
			}),
		)
		await client.disconnect()
	} catch (error) {
		console.log(`🔄 ${changedFiles.join(', ')} rebuilt - please refresh your browser manually`)
		console.warn('⚠️  Could not connect to Redis for live reload:', (error as Error).message)
	}
}

// Get the app name from environment variable (defaults to 'timeclock')
const appName = process.env.VITE_APP || 'timeclock'

interface AppConfig {
	entry: string
	outDir: string
	srcDir: string
}

// Map of app configurations
// Source: public/js/<app>  |  Output: public/dist/js/<app>
const appConfigs: Record<string, AppConfig> = {
	timeclock: {
		entry: 'timeclock.ts',
		outDir: 'timeclock/public/dist/js/timeclock',
		srcDir: 'timeclock/public/js/timeclock'
	},
	project_tracker: {
		entry: 'project_tracker.ts',
		outDir: 'timeclock/public/dist/js/project_tracker',
		srcDir: 'timeclock/public/js/project_tracker'
	}
}

const config = appConfigs[appName]
if (!config) {
	throw new Error(`Unknown app: ${appName}. Valid apps: ${Object.keys(appConfigs).join(', ')}`)
}

export default defineConfig({
	plugins: [
		tiptapSourcePlugin(),
		Vue(),
		Icons({
			compiler: 'vue3',
			autoInstall: true,
		}),
		Components({
			dts: true,
			resolvers: [
				IconsResolver(),
			],
		}),
		frappeNotifyPlugin([`${appName}/index.js`]),
	],
	define: {
		'process.env.NODE_ENV': JSON.stringify('production'),
	},
	build: {
		outDir: resolve(__dirname, config.outDir),
		emptyOutDir: true,
		target: 'es2020',
		minify: true,
		lib: {
			entry: resolve(__dirname, config.srcDir, config.entry),
			formats: ['es'],
			fileName: () => 'index.js'
		},
		rolldownOptions: {
			output: {
				assetFileNames: 'index.css',
			}
		},
		sourcemap: true,
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, config.srcDir)
		}
	}
})
