import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import jwt from 'jsonwebtoken'

Vue.use(Vuex)

// Polyfill for `window.fetch()`
require('whatwg-fetch')

export const state = () => ({
  authUser: null,
  apiUrl: 'https://itk-api.blt.ovh', // process.env.apiUrl,
  cookieAccepted: false
})

export const mutations = {
  SET_USER: function (state, user) {
    state.authUser = user
  },
  SET_COOKIEACCEPT: function (state, value) {
    state.cookieAccepted = value
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
  async login ({ commit, state }, { username, password }) {
    try {
      // console.log(state)
      const { data } = await axios.post('http://localhost:25678/auth/admin/login', { username, password })
      commit('SET_USER', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  checkJWT (token) {
    jwt.verify(token, function (err, decoded) {
      if (err) {
        console.log(err)
        /*
          err = {
            name: 'TokenExpiredError',
            message: 'jwt expired',
            expiredAt: 1408621000
          }
        */
      }
      console.log(decoded)
      return decoded
    })
  },

  async logout ({ commit }) {
    await commit('SET_USER', null)
    console.log('logged out')
  }
}
