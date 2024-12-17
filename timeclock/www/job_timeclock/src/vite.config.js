import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import { resolve } from 'path'

// Custom plugin to delete index.js before each build
const deleteFilePlugin = {
	name: 'delete-file',
	buildStart() {
		// files to delete
		const files = [
			'index.js',
			'index.css'
		]
		files.forEach(file => {
			const filePath = resolve(__dirname, '../' + file)
			fs.unlink(filePath, (err) => {
				if (err && err.code === 'ENOENT') {
					// File doesn't exist, no problem
					console.log(file + ' doesn’t exist, won’t remove it.')
				} else if (err) {
					// Other errors
					console.error('Error occurred while removing ' + file, err)
				} else {
					console.log(file + ' removed')
				}
			})
		})
	}
}


export default defineConfig({
	plugins: [vue(), deleteFilePlugin],
	build: {
		outDir: resolve(__dirname, '../'),
		root: resolve(__dirname, '.'),
		target: 'es2020',
		emptyOutDir: false,
		minify: true,
		lib: {
			entry: resolve(__dirname, 'job_timeclock.js'),
			name: 'job_timeclock',
			fileName: (format) => `index.js`
		},
		rollupOptions: {
			output: {
				assetFileNames: 'index.css'
			}
		},
	},
	optimizeDeps: {
		include: [
			"frappe-ui",
		],
	},
	define: {
		'process.env': process.env
	},
	css: {
		preprocessorOptions: {
			scss: {}
		}
	},
})
