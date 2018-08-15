import createPersistedState from 'vuex-persistedstate'
// import Cookies from 'js-cookie'

export default ({store, isHMR, app}) => {
  // In case of HMR, mutation occurs before nuxReady, so previously saved state
  // gets replaced with original state received from server. So, we've to skip HMR.
  // Also nuxtReady event fires for HMR as well, which results multiple registration of
  if (isHMR) return
  window.onNuxtReady((nuxt) => {
    createPersistedState({
      key: 'key2publish',
      reducer: state => ({
        cart: state.cart,
        authUser: state.authUser,
        cookieAccepted: state.cookieAccepted,
        account: { token: state.account.token },
        order: { address: state.order.address, billing: state.order.billing, customer: state.order.customer, fromQuote: state.order.fromQuote },
        product: { searchVal: state.product.searchVal, searchFilters: state.product.searchFilters, page: state.product.page, total: state.product.total }
        // settings: state.settings
      }),
      storage: {
        getItem: key => app.$cookies.get(key),
        setItem: (key, value) => {
          app.$cookies.set(key, value)
        },
        removeItem: key => app.$cookies.remove(key)
      }
    })(store) // vuex plugins can be connected to store, even after creation
  })
}
