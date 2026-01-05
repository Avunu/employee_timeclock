import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import fs from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { Plugin } from 'vite'

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
const appConfigs: Record<string, AppConfig> = {
	timeclock: {
		entry: 'timeclock.js',
		outDir: 'timeclock/www/timeclock',
		srcDir: 'timeclock/www/timeclock/src'
	},
	job_timeclock: {
		entry: 'job_timeclock.js',
		outDir: 'timeclock/www/job_timeclock',
		srcDir: 'timeclock/www/job_timeclock/src'
	}
}

const config = appConfigs[appName]

// Custom plugin to delete index.js and index.css before each build
const deleteFilePlugin: Plugin = {
	name: 'delete-file',
	buildStart() {
		const files = ['index.js', 'index.css']
		files.forEach(file => {
			const filePath = resolve(__dirname, config.outDir, file)
			fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
				if (err && err.code === 'ENOENT') {
					console.log(`${file} doesn't exist, won't remove it.`)
				} else if (err) {
					console.error(`Error occurred while removing ${file}`, err)
				} else {
					console.log(`${file} removed`)
				}
			})
		})
	}
}

export default defineConfig({
	plugins: [
		vue(),
		Icons({
			compiler: 'vue3',
			autoInstall: true,
		}),
		deleteFilePlugin
	],
	build: {
		outDir: resolve(__dirname, config.outDir),
		root: resolve(__dirname, config.srcDir),
		target: 'es2020',
		emptyOutDir: false,
		minify: true,
		lib: {
			entry: resolve(__dirname, config.srcDir, config.entry),
			name: appName,
			fileName: (format) => `index.js`
		},
		rollupOptions: {
			output: {
				assetFileNames: 'index.css'
			}
		}
	},
	optimizeDeps: {
		include: [
			"frappe-ui",
		],
	},
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
	},
	css: {
		preprocessorOptions: {
			scss: {}
		}
	},
})
