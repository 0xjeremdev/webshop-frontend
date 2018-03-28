export const state = () => ({
  searchVal: 'test'
})

export const mutations = {
  SET_SEARCHVAL: function (state, value) {
    state.product.searchVal = value
  }
}
