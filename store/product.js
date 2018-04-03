import Cookies from 'js-cookie'

export const state = () => ({
  data: {},
  searchVal: '',
  page: 1,
  total: 0
})

export const mutations = {
  SET_DATA: function (state, value) {
    state.data = value
  },
  SET_SEARCHVAL: function (state, value) {
    state.searchVal = value
  },
  SET_PAGE: function (state, value) {
    state.page = value
  },
  SET_TOTAL: function (state, value) {
    state.total = value
  }
}

export const actions = {
  async getProducts ({ commit, state, rootState }, { params, page }) {
    try {
      console.log('start')
      if (!(rootState.authUser instanceof Object)) {
        commit('SET_USER', Cookies.getJSON('key2publish').authUser, { root: true })
      }
      if (!(state.searchVal instanceof Object)) {
        commit('SET_SEARCHVAL', Cookies.getJSON('key2publish').product.searchVal)
      }
      this.$axios.setToken(rootState.authUser.jwt, 'Bearer')
      // console.log(params.search)
      let searchVal = state.searchVal
      console.log(searchVal)
      let search = (searchVal.name !== '' && searchVal.name !== undefined) ? searchVal.name.toLowerCase() : ''
      search = (params.search !== '' && params.search !== undefined) ? params.search.toLowerCase() : search
      console.log(search)
      let query = {
        'options': {
          'fullCount': true
        },
        'count': true,
        'query': 'FOR p in k2p_product FILTER LOWER(p.basic.name) LIKE @search OR LOWER(p.basic.description) LIKE @search LIMIT ' + ((page - 1) * 10) + ', 10 RETURN { _key: p._key, _id: p._id, artno: p.basic.vat, name: p.basic.name, description: p.basic.description, clone: p.basic.clone, size: p.basic.size, price: p.basic[\'Price LabNed\'], reactivity: p.basic.Reactivity, host: p.basic.Host, applications: p.basic.Applications, conjugate: p.basic.Conjugate, images: { image1: p.basic.picture, image2: p.basic.price } }',
        'bindVars': {
          'search': (search !== '') ? (search + '%') : '%'
        }
      }
      console.log(query)
      let mydata = await this.$axios.$post(rootState.productUrl + '/_api/cursor', query)
      console.log(mydata)
      commit('SET_TOTAL', mydata.extra.stats.fullCount)
      commit('SET_DATA', mydata.result)
      return mydata
    } catch (e) {
      console.log(e)
      commit('SET_TOTAL', 0)
      commit('SET_DATA', [])
      return e
    }
  }
}
