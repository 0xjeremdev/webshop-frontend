import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

// Polyfill for `window.fetch()`
require('whatwg-fetch')

const store = () => new Vuex.Store({
  state: {
    authUser: null
  },
  mutations: {
    SET_USER: function (state, user) {
      state.authUser = user
    }
  },
  actions: {
    // nuxtServerInit is called by Nuxt.js before server-rendering every page
    nuxtServerInit ({ commit }, { req }) {
      if (req.session && req.session.authUser) {
        // console.log(req.session)
        commit('SET_USER', req.session.authUser)
      }
    },
    async login ({ commit }, { username, password }) {
      try {
        const { data } = await axios.post('http://localhost:8529/_open/auth', { username, password })
        commit('SET_USER', data)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          throw new Error('Bad credentials')
        }
        throw error
      }
    },

    async logout ({ commit }) {
      await commit('SET_USER', null)
    }
  }
})

export default store
