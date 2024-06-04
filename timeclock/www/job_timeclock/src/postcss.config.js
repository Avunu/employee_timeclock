// postcss.config.js
module.exports = {
    plugins: {
        'postcss-import': {},
        tailwindcss: {},
        autoprefixer: {},
    },
    presets:[require('frappe-ui/src/utils/tailwind.config')],
}