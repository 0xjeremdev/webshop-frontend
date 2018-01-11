const webpack = require('webpack')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'itk-webshop-frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'ITK Webshop Frontend Project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css'}
    ]
  },
  // include your own css
  css: [
    '~/assets/main.css'
  ],
  // include buefy js on startup
  plugins: [
    '~plugins/buefy',
    //{ src: '~/plugins/vue-notifications.js', ssr: false }
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    // fix for bulma (part of buefy) to ignore warnings using poscss-custom-properties
    postcss: {
      plugins: {
        'postcss-custom-properties': {
          warnings: false
        }
      }
    },
    vendor: ['jquery', 'axios'],
    plugins: [
      new webpack.ProvidePlugin({
        // set shortcuts as global for plugins
        '$': 'jquery',
        'jQuery': 'jquery',
        'windows.jQuery': 'jquery',
        'axios': 'axios'
      })
    ]
  }
}
