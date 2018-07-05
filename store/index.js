import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Cookies from 'js-cookie'

Vue.use(Vuex)

// Polyfill for `window.fetch()`
require('whatwg-fetch')

export const state = () => ({
  authUser: null,
  apiUrl: 'http://localhost:25678', // process.env.apiUrl,
  cookieAccepted: false,
  isLoading: false,
  settings: {}
})

export const mutations = {
  SET_USER: function (state, user) {
    state.authUser = user
  },
  SET_COOKIEACCEPT: function (state, value) {
    state.cookieAccepted = value
  },
  SET_ISLOADING: function (state, value) {
    state.isLoading = value
  },
  SET_SETTINGS: function (state, value) {
    state.settings = value
  }
}
export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      // console.log(req.session)
      // commit('SET_USER', req.session.authUser)
    }
  },
  // deprecated
  async connectDB ({ commit, state }) {
    try {
      // console.log('connectDB')
      let username = 'root'
      let password = 'key2publish'
      const { data } = await axios.post((state.dbUrl + '/_open/auth'), { username, password })
      commit('SET_USER', data)
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async getSettings ({ commit, state, error }) {
    try {
      let config = await axios.get(state.apiUrl + '/admin/config')
      if (config.data instanceof Object) {
        if (config.data.result instanceof Object) {
          if (config.data.result['_result'] instanceof Array) {
            commit('SET_SETTINGS', config.data.result['_result'][0])
          } else {
            error({statusCode: '404', message: 'Page not found'})
          }
        } else {
          error({statusCode: '404', message: 'Page not found'})
        }
      } else {
        error({statusCode: '404', message: 'Page not found'})
      }
    } catch (e) {
      throw e
    }
  },

  async login ({ commit, state }, { username, password }) {
    try {
      // console.log(state)
      const { data } = await axios.post(state.apiUrl + '/auth/admin/login', { username, password })
      commit('SET_USER', data.result)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  checkAuth ({ commit, state, redirect }) {
    if (!state.authUser) commit('SET_USER', Cookies.getJSON('key2publish').authUser)
    // this.$axios.setToken(state.authUser.jwt, 'Bearer')
    if ((state.authUser !== null) && (typeof state.authUser === 'object')) {
      if (state.authUser.hasOwnProperty('jwt')) {
        return axios.get(state.apiUrl + '/admin/checktoken', { headers: { Authorization: `Bearer ${state.authUser.jwt}` } })
          .then((res) => {
            if (Object.keys(res.data['result']).length > 0) {
              return true
            }
            return false
          })
          .catch((e) => {
            return false
          })
      }
    }
  },

  async logout ({ commit }) {
    await commit('SET_USER', null)
    console.log('logged out')
  }
}
