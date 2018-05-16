import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import jwt from 'jsonwebtoken'

Vue.use(Vuex)

// Polyfill for `window.fetch()`
require('whatwg-fetch')

export const state = () => ({
  authUser: null,
  dbUrl: 'http://localhost:8529',
  productUrl: 'http://localhost:8529/_db/key2publish/',
  shopUrl: 'http://localhost:8529/_db/k2p_webshop/',
  cartContents: [],
  cookieAccepted: false
})

export const getters = {
  getCartContents: state => state.cartContents
}

export const mutations = {
  SET_USER: function (state, user) {
    state.authUser = user
  },
  SET_COOKIEACCEPT: function (state, value) {
    state.cookieAccepted = value
  },
  SET_CART: function (state, cart) {
    // used to restore the cart from cookie
    // console.log('test')
    // console.log(cart)
    state.cartContents = cart
  },
  ADD_TO_CART: function (state, cart) {
    // simpler function to add to the cart
    let mycart = state.cartContents
    // console.log(typeof mycart)
    let found = false
    for (let key in mycart) {
      if (mycart[key]['id'] === cart['id']) {
        // cart.amount++
        mycart[key] = cart
        found = true
      }
    }
    if (!found) {
      mycart.push(cart)
    }
    state.cartContents = []
    state.cartContents = mycart
  },
  REMOVE_FROM_CART: function (state, index) {
    // simpler function to remove from the cart
    // console.log('index:' + index)
    let mycart = state.cartContents
    mycart.splice(index, 1)
    state.cartContents = mycart
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
      const { data } = await axios.post('http://localhost:8529/_open/auth', { username, password })
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
