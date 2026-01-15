import type { Config } from 'tailwindcss'

const config: Config = {
  // presets: [
  //   require('frappe-ui/src/utils/tailwind.config')
  // ],
  content: [
    "./timeclock/public/js/**/*.{html,vue,js,ts,jsx,tsx}",
    "./timeclock/www/**/*.{html,vue,js,ts,jsx,tsx}",
    "./node_modules/frappe-ui/src/components/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
