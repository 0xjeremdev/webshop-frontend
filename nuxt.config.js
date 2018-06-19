const webpack = require('webpack')

module.exports = {
  env: {
    apiUrl: process.env.API_URL || 'http://localhost:25678'
  },
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
      { rel: 'stylesheet', type: 'text/css', href: '//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto+Slab' }
    ]
  },
  mode: 'spa',

  // include buefy js on startup
  plugins: [
    { src: '~plugins/buefy', ssr: false },
    { src: '~plugins/persistedstate.js', ssr: false }
    //'~plugins/bootstrap.js'
    //{ src: '~/plugins/vue-notifications.js', ssr: false }
  ],

  // include your own css
  css: [
    '~/assets/main.css'
  ],
  modules: [
    '@nuxtjs/axios',
  ],

  axios: {
    // proxyHeaders: false
  },

  /* router: {
    middleware: ['auth', 'user-agent']
  }, */

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
