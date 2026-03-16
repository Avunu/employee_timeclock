import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'
import type { Plugin, ResolvedConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
				// Write initial stamp so the browser has a baseline on first load
				if (isWatch) writeStamp(resolvedConfig)
				return
			}

			if (isWatch) writeStamp(resolvedConfig)
			notifyFrappeReload(changedFiles)
		},
	}
}

function writeStamp(config: ResolvedConfig) {
	try {
		const outDir = config.build.outDir
		writeFileSync(`${outDir}/build-stamp.json`, JSON.stringify({ ts: Date.now() }))
	} catch (_) {}
}

async function notifyFrappeReload(changedFiles: string[]) {
	try {
		const redisUrl = process.env.FRAPPE_REDIS_QUEUE || 'redis://localhost:11000'
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
		vue(),
		Icons({
			compiler: 'vue3',
			autoInstall: true,
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
