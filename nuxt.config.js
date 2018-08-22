const webpack = require('webpack')

/* const resolve = require('path').resolve

const isVueRule = (rule) => {
  return rule.test.toString() === '/\\.vue$/'
}
const isSASSRule = (rule) => {
  return ['/\\.sass$/', '/\\.scss$/'].indexOf(rule.test.toString()) !== -1
}
const sassResourcesLoader = {
  loader: 'sass-resources-loader',
  options: {
    resources: [
      resolve(__dirname, 'node_modules/bulma/bulma.sass')
    ]
  }
} */

module.exports = {
  env: {
    apiUrl: 'https://itk-api.blt.ovh'
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
  mode: 'universal',

  // include buefy js on startup
  plugins: [
    { src: '~plugins/buefy', ssr: true },
    { src: '~plugins/quillEditor', ssr: false },
    { src: '~plugins/persistedstate.js', ssr: false }
    //'~plugins/bootstrap.js'
    //{ src: '~/plugins/vue-notifications.js', ssr: false }
  ],

  // include your own css
  css: [
    '~/assets/custom.sass',
    '~/assets/main.css',
    'quill/dist/quill.snow.css',
  ],
  modules: [
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/sentry',
  ],

  sentry: {
    dsn: 'https://dfb794d1fb994a4fb2dcb741a742d69f@sentry.io/1249042',
    config: {
      // Additional config
      environment: 'production'
    },
  },

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
      /* config.module.rules.forEach((rule) => {
        if (isVueRule(rule)) {
          rule.options.loaders.sass.push(sassResourcesLoader)
          rule.options.loaders.scss.push(sassResourcesLoader)
        }
        if (isSASSRule(rule)) {
          rule.use.push(sassResourcesLoader)
        }
      }) */
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
