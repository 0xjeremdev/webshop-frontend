import Cookies from 'js-cookie'

export const state = () => ({
  data: {},
  searchVal: '',
  page: 1,
  total: 0,
  filters: { 'Product Type': [], 'Reactivity': [], 'Host': [], 'Clone': [], 'Application': [], Conjugate: [] },
  searchFilters: { 'Product Type': [], 'Reactivity': [], 'Host': [], 'Clone': [], 'Application': [], Conjugate: [] }
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
  },
  SET_FILTERS: function (state, value) {
    for (let key in value) {
      state.filters[key] = value[key]
    }
    // state.filters = { ...state.filters, value }
  },
  SET_SEARCH_FILTERS: function (state, value) {
    for (let key in value) {
      state.searchFilters[key] = value[key]
    }
  }
}

export const actions = {
  async getProducts ({ commit, state, rootState }, { params, page }) {
    try {
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
      let search = (searchVal.name !== '' && searchVal.name !== undefined) ? searchVal.name.toUpperCase() : ''
      // search = (params.search !== '' && params.search !== undefined) ? params.search.toUpperCase() : search
      console.log(search)
      let query = {
        'options': {
          'fullCount': true
        },
        'count': true,
        'query': 'FOR p in k2p_product FILTER UPPER(p.basic.name) LIKE @search OR UPPER(p.basic.description) LIKE @search LIMIT ' + ((page - 1) * 10) + ', 10 RETURN { _key: p._key, _id: p._id, artno: p.basic.vat, name: p.basic.name, description: p.basic.description, clone: p.basic.clone, size: p.basic.size, price: p.basic[\'Price LabNed\'], reactivity: p.basic.Reactivity, host: p.basic.Host, applications: p.basic.Applications, conjugate: p.basic.Conjugate, images: { image1: p.basic.picture, image2: p.basic.price } }',
        'bindVars': {
          'search': (search.trim() !== '') ? (search.trim() + '%') : '%'
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
  },

  async getFilters ({ state, rootState, commit }, { field, params }) {
    try {
      if (!(rootState.authUser instanceof Object)) {
        commit('SET_USER', Cookies.getJSON('key2publish').authUser, { root: true })
      }
      if (!(state.searchVal instanceof Object)) {
        commit('SET_SEARCHVAL', Cookies.getJSON('key2publish').product.searchVal)
      }
      this.$axios.setToken(rootState.authUser.jwt, 'Bearer')
      // console.log(params.search)
      let searchVal = state.searchVal
      // console.log(searchVal)
      let search = (searchVal.name !== '' && searchVal.name !== undefined) ? searchVal.name.toLowerCase() : ''
      search = (params.search !== '' && params.search !== undefined) ? params.search.toLowerCase() : search
      // console.log(search)
      let query = {
        'options': {
          'fullCount': true
        },
        'count': true,
        'query': 'FOR p in k2p_product FILTER LOWER(p.basic.name) LIKE @search OR LOWER(p.basic.description) LIKE @search FILTER p.basic[\'' + field + '\'] != "" AND p.basic[\'' + field + '\'] != null COLLECT field = p.basic[\'' + field + '\'] LIMIT 0,100 RETURN { \'' + field + '\': field }',
        'bindVars': {
          'search': (search !== '') ? (search + '%') : '%'
        }
      }
      // console.log(query)
      let mydata = await this.$axios.$post(rootState.productUrl + '/_api/cursor', query)
      let val = {}
      val[field] = mydata.result
      // console.log(val)
      // console.log(mydata.extra.stats.fullCount)
      commit('SET_FILTERS', val)
      // console.log(mydata)
    } catch (e) {
      console.log(e)
      return e
    }
  }
}
