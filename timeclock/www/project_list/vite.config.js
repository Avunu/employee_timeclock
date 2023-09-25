import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'project_list.js'),
			name: 'project_list',
			fileName: (format) => `index.js` // creates module only output
		},
		outDir: './timeclock/www/project_list/',
		root: './',
		target: 'es2015',
		emptyOutDir: false,
		minify: true,
	},
	optimizeDeps: {},
	define: {
		'process.env': process.env
	}
})
