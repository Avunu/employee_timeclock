import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
		entry: 'timeclock.js',
		outDir: 'timeclock/public/dist/js/timeclock',
		srcDir: 'timeclock/public/js/timeclock'
	},
	job_timeclock: {
		entry: 'job_timeclock.ts',
		outDir: 'timeclock/public/dist/js/job_timeclock',
		srcDir: 'timeclock/public/js/job_timeclock'
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
			name: appName,
			fileName: () => 'index.js'
		},
		rollupOptions: {
			output: {
				assetFileNames: 'index.css'
			}
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, config.srcDir)
		}
	}
})
