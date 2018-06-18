import Cookies from 'js-cookie'

export const state = () => ({
  data: {},
  countryList: {}
})

export const mutations = {
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
  async addToCart ({ commit, state, rootState }, { params, page }) {
    try {
      if (!(rootState.authUser instanceof Object)) {
        commit('SET_USER', Cookies.getJSON('key2publish').authUser, { root: true })
      }

      this.$axios.setToken(rootState.authUser.jwt, 'Bearer')

      let aql = 'FOR c in Country SORT c.name ASC RETURN { code: c.alpha2Code, name: c.name}'

      let query = {
        'options': {
          'fullCount': true
        },
        'count': true,
        'query': aql
      }
      console.log(query)
      let mydata = await this.$axios.$post(rootState.shopUrl + '/_api/cursor', query)
      console.log(mydata)
      return mydata
    } catch (e) {
      console.log(e)
      return e
    }
  }
}
