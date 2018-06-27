import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'

export default ({store, isHMR}) => {
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
        order: state.order,
        product: { searchVal: state.product.searchVal, searchFilters: state.product.searchFilters, page: state.product.page, total: state.product.total }
      }),
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) => {
          Cookies.set(key, value)
        },
        removeItem: key => Cookies.remove(key)
      }
    })(store) // vuex plugins can be connected to store, even after creation
  })
}
