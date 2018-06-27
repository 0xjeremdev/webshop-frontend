import Cookies from 'js-cookie'

export const state = () => ({
  cartContents: []
})

export const mutations = {
  SET_CART: function (state, cart) {
    // used to restore the cart from cookie
    // console.log('test')
    // console.log(cart)
    // console.log(Cookies.getJSON('key2publish'))
    state.cartContents = cart
  },
  ADD_TO_CART: function (state, cart) {
    // simpler function to add to the cart
    let mycart = state.cartContents
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
    // state.cartContents = [] // hack to trigger vue the variable has changed there should be a better way so might need to rework in future
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
  async getProductForCart ({ commit, state, rootState }, { cart }) {
    try {
      if (!(rootState.authUser instanceof Object)) {
        commit('SET_USER', Cookies.getJSON('key2publish').authUser, { root: true })
      }
      if (cart === undefined || cart.length <= 0) return cart
      let mydata = await this.$axios.$post(rootState.apiUrl + '/product/cart/', { cart: cart })
      let data = mydata['result']['_result']
      for (let c in cart) {
        for (let d in data) {
          if (data[d].id === cart[c].id) {
            data[d].amount = cart[c].amount
          }
        }
      }
      // return data['result']['_result']
      console.log('Got Triggered here')
      commit('SET_CART', data)
    } catch (e) {
      console.log(e)
      return e
    }
  }
}
