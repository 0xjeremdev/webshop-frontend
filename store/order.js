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
  async getCountryList ({ commit, state, rootState }, { params, page }) {
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
