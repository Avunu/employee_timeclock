import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
	plugins: [vue()],
	build: {
		outDir: path.resolve(__dirname, '../'),
		root: path.resolve(__dirname, '.'),
		target: 'es2020',
		emptyOutDir: false,
		minify: true,
		lib: {
			entry: path.resolve(__dirname, 'job_timeclock.js'),
			name: 'job_timeclock',
			fileName: (format) => `index.js` // creates module only output
		},
		rollupOptions: {
			output: {
				assetFileNames: `index.css`   // For assets (CSS in this case)
			}
		}
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
