import Cookies from 'js-cookie'

export const state = () => ({
  data: {},
  countryList: {}
})

export const mutations = {
  SET_COUNTRYLIST: function (state, value) {
    state.countryList = value
  },
  SET_DATA: function (state, value) {
    state.data = value
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
      console.log(mydata)
      return mydata['result']['_result']
    } catch (e) {
      console.log(e)
      return e
    }
  }
}
