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
    apiUrl: 'https://api.labned.com'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'LabNed.com',
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
    // '@nuxtjs/sitemap',
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/sentry',
    ['@nuxtjs/google-analytics', { id: 'UA-34214652-1' }],
    ['@nuxtjs/google-tag-manager', { id: 'GTM-N3C6RXC' }],
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
  /*sitemap: {
      path: '/sitemap.xml',
      hostname: 'https://labned.com',
      cacheTime: 1000 * 60 * 15,
      gzip: true,
      generate: true, // Enable me when using nuxt generate
      exclude: [
        '/order/**',
        '/cart',
        '/account/**',
        '/admin/**'
      ],
  },*/
  router: {
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },
  babel: {
    presets: [
      ['vue-app', {
        useBuiltIns: true,
        targets: { ie: 9, uglify: true }
        }
      ]
    ]
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
