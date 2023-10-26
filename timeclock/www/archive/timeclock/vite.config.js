import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// import { getProxyOptions } from './vite-dev-server.js'
// import { webserver_port } from '../../../../sites/common_site_config.json'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'timeclock.js'),
			name: 'timeclock',
			fileName: (format) => `index.js` // creates module only output
		},
		outDir: './timeclock/www/timeclock/',
		root: './',
		target: 'es2015',
		emptyOutDir: false,
		minify: false,
	},
	optimizeDeps: {},
	define: {
		'process.env': process.env
	}
})
