import Cookies from 'js-cookie'

export const state = () => ({
  data: [],
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
    // console.log(value)
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
        console.log(Cookies.getJSON('key2publish'))
        commit('SET_SEARCHVAL', (typeof (Cookies.getJSON('key2publish')) !== 'undefined') ? Cookies.getJSON('key2publish').product.searchVal : '')
      }
      let searchVal = state.searchVal
      console.log(searchVal)
      // let search = (searchVal.name !== '' && searchVal.name !== undefined) ? searchVal.name.toLowerCase() : ''
      let search = searchVal
      let searchFilters = state.searchFilters
      console.log(searchFilters)
      let query = {
        search: search,
        page: page,
        searchFilters: searchFilters
      }
      let mydata = await this.$axios.$post(rootState.apiUrl + '/product/search', query)
      console.log("mydata", mydata)
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

  async getProductsForGoogle ({ context, commit, state, rootState }, { params, page, category }) {
    try {
      console.log(params)
      // let search = (searchVal.name !== '' && searchVal.name !== undefined) ? searchVal.name.toLowerCase() : ''
      let search = ''
      let searchFilters = { 'Product category LabNed': {}, 'Reactivity': {}, 'Host': {}, 'Clone': {}, 'Applications': {}, Conjugate: {} }
      if (category !== undefined) { searchFilters['Product category LabNed'][category] = true }
      // console.log(searchFilters)
      // console.log(category)
      let query = {
        search: search,
        page: page,
        searchFilters: searchFilters
      }
      // console.log(searchFilters)
      let mydata = await this.$axios.$post(rootState.apiUrl + '/product/search', query)
      // console.log(mydata)
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

  async getProductsActive ({ state, rootState, commit }, { items }) {
    try {
      let productids = []
      for (let item in items) {
        productids[item] = items[0].id
      }
      // console.log(productids)
      let postData = { productids: productids }
      // console.log(postData)
      let data = await this.$axios.$post(rootState.apiUrl + '/product/isactive', postData)
      console.log(data)
      return data.result
      // commit('SET_ACTIVE_PRODUCTS', (data.result) ? data.result : true)
    } catch (e) {
      console.log(e.message)
      return true
    }
  },

  async getFilters ({ state, rootState, commit }, { field, params }) {
    try {
      // console.log(field)
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
      // let search = (searchVal !== '' && searchVal !== undefined) ? searchVal.toLowerCase() : ''
      // search = (params.search !== '' && params.search !== undefined) ? params.search.toLowerCase() : search
      let search = searchVal
      let searchFilters = state.searchFilters
      // console.log(query)

      let filterIsFalse = true
      for (let filter in searchFilters) {
        for (let option in searchFilters[filter]) {
          if (searchFilters[filter][option]) {
            filterIsFalse = false
            break
          }
        }
        if (!filterIsFalse) break
      }
      let val = {}
      if (search === '' && filterIsFalse) {
        let mydata = await this.$axios.$get(rootState.apiUrl + '/filter/' + field, { headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' } })
        val[field] = mydata.result['_result']
      /* } else if (field === 'Product category LabNed') {
        let mydata = await this.$axios.$get(rootState.apiUrl + '/filter/' + field, { headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' } })
        let postData = { searchVal: search, searchFilters: searchFilters, field: field }
        console.log(postData)
        let filteredData = await this.$axios.$post(rootState.apiUrl + '/filter', postData, { headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' } })
        let correctData = mydata.result['_result']
        for (var r = mydata.result['_result'].length; r >= 0; r--) {
          let keep = false
          for (let f in filteredData.result['_result']) {
            if (mydata.result['_result'][r] === filteredData.result['_result'][f]) keep = true
          }
          if (!keep) correctData.splice(r, 1)
        }
        val[field] = correctData */
      } else {
        let postData = { searchVal: search, searchFilters: searchFilters, field: field }
        console.log(postData)
        let filteredData = await this.$axios.$post(rootState.apiUrl + '/filter', postData)
        val[field] = filteredData.result['_result']
      }

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
