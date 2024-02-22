module.exports = {
  // presets: [
  //   require('frappe-ui/src/utils/tailwind.config')
  // ],
  content: [
    "./timeclock/www/**/src/*.{html,vue,js,ts,jsx,tsx}",
    "./timeclock/www/**/src/components/*.{html,vue,js,ts,jsx,tsx}",
    "./node_modules/frappe-ui/src/components/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
