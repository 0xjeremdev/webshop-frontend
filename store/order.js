import Cookies from 'js-cookie'

export const state = () => ({
  data: {},
  customer: {},
  address: '',
  billing: '',
  fromQuote: false,
  countryList: {}
})

export const mutations = {
  SET_COUNTRYLIST: function (state, value) {
    state.countryList = value
  },
  SET_DATA: function (state, value) {
    state.data = value
  },
  SET_CUSTOMER: function (state, value) {
    state.customer = value
  },
  SET_ADDRESS: function (state, value) {
    state.address = value
  },
  SET_BILLING: function (state, value) {
    state.billing = value
  },
  SET_FROMQUOTE: function (state, value) {
    state.fromQuote = value
  }
}

export const actions = {
  async getCountryList ({ commit, state, rootState }) {
    try {
      if (!(rootState.account.token instanceof Object)) {
        commit('account/SET_TOKEN', Cookies.getJSON('key2publish').account.token, { root: true })
      }

      // this.$axios.setToken(rootState.authUser.jwt, 'Bearer')

      let mydata = await this.$axios.$get(rootState.apiUrl + '/country')
      return mydata['result']['_result']
    } catch (e) {
      console.log(e)
      return e
    }
  },
  async placeOrder ({ commit, state, rootState }, { status }) {
    try {
      let postData = {
        delivery: state.address,
        billing: state.billing,
        customer: state.customer,
        items: rootState.cart.cartContents,
        from_quote: (state.fromQuote) ? state.fromQuote : false,
        status: status
      }
      await this.$axios.$post(rootState.apiUrl + '/order', postData, { headers: { Authorization: `Bearer ${rootState.account.token.jwt}` } })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  async placeQuote ({ commit, state, rootState }, { status, email }) {
    try {
      let postData = {
        // delivery: state.address,
        // billing: state.billing,
        quot_by: state.customer,
        items: rootState.cart.cartContents,
        from_quote: true,
        status: status
      }
      await this.$axios.$post(rootState.apiUrl + '/quote', postData, { headers: { Authorization: `Bearer ${rootState.account.token.jwt}` } })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  async getShippingCosts ({ commit, state, rootState }, { condition }) {
    try {
      if (!rootState.account.token) commit('account/SET_TOKEN', Cookies.getJSON('key2publish').account.token, { root: true })
      // this.$axios.setToken(state.authUser.jwt, 'Bearer')
      if ((rootState.account.token !== null) && (typeof rootState.account.token === 'object')) {
        if (rootState.account.token.hasOwnProperty('jwt')) {
          let shippingcosts = await this.$axios.$get(rootState.apiUrl + '/shipping/' + condition, { headers: { Authorization: `Bearer ${rootState.account.token.jwt}` } })
          return shippingcosts['result']['_result'][0]
        }
      }
      return false
    } catch (e) {
      console.log(e.request)
    }
  },
  async getZoneCosts ({ commit, state, rootState }, { cc }) {
    try {
      console.log(cc)
      if (!rootState.account.token) commit('account/SET_TOKEN', Cookies.getJSON('key2publish').account.token, { root: true })
      // this.$axios.setToken(state.authUser.jwt, 'Bearer')
      if ((rootState.account.token !== null) && (typeof rootState.account.token === 'object')) {
        if (rootState.account.token.hasOwnProperty('jwt')) {
          let zonecosts = await this.$axios.$get(rootState.apiUrl + '/shipping/zonecost/' + cc, { headers: { Authorization: `Bearer ${rootState.account.token.jwt}` } })
          console.log('benhier')
          console.log(zonecosts['result']['_result'][0])
          return zonecosts
        }
      }
      return false
    } catch (e) {
      console.log(e.request)
    }
  }
}
