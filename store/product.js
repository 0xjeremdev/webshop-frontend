import Cookies from 'js-cookie'

export const state = () => ({
  data: {},
  searchVal: '',
  page: 1,
  total: 0,
  filters: { 'Product category LabNed': [], 'Reactivity': [], 'Host': [], 'Clone': [], 'Applications': [], Conjugate: [] },
  searchFilters: { 'Product category LabNed': {}, 'Reactivity': {}, 'Host': {}, 'Clone': {}, 'Applications': {}, Conjugate: {} }
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
    if (Object.keys(value).length > 0) {
      for (let key in value) {
        if (Object.keys(value[key]).length > 0) {
          for (let filter in value[key]) {
            state.searchFilters[key][filter] = value[key][filter]
          }
        } else {
          state.searchFilters[key] = value[key]
        }
      }
    } else {
      state.searchFilters = value
    }
  }
}

export const actions = {
  async getProducts ({ context, commit, state, rootState }, { params, page }) {
    try {
      if ((state.searchVal === '')) {
        commit('SET_SEARCHVAL', Cookies.getJSON('key2publish').product.searchVal)
      }
      let searchVal = state.searchVal
      console.log(searchVal)
      // let search = (searchVal.name !== '' && searchVal.name !== undefined) ? searchVal.name.toUpperCase() : ''
      let search = searchVal
      let searchFilters = state.searchFilters
      let query = {
        search: search,
        page: page,
        searchFilters: searchFilters
      }
      let mydata = await this.$axios.$post(rootState.apiUrl + '/product/search', query)
      console.log(mydata)
      commit('SET_TOTAL', mydata.result.extra.stats.fullCount)
      commit('SET_DATA', mydata.result._result)
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
      if ((state.searchVal === '')) {
        commit('SET_SEARCHVAL', Cookies.getJSON('key2publish').product.searchVal)
      }
      // this.$axios.setToken(rootState.authUser.jwt, 'Bearer')
      // console.log(params.search)
      let searchVal = state.searchVal
      // console.log(searchVal)
      let search = (searchVal !== '' && searchVal !== undefined) ? searchVal.toLowerCase() : ''
      search = (params.search !== '' && params.search !== undefined) ? params.search.toLowerCase() : search
      let searchFilters = state.searchFilters
      // console.log(query)
      let postData = { searchVal: search, searchFilters: searchFilters, field: field }
      let mydata = await this.$axios.$post(rootState.apiUrl + '/filter', postData)
      let val = {}
      console.log(mydata)
      val[field] = mydata.result['_result']
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
