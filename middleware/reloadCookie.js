export default function ({ store, app }) {
  try {
    let cookie = app.$cookies.get('key2publish')
    if (typeof cookie !== 'undefined') {
      if (cookie.authUser instanceof Object) {
        store.commit('SET_USER', cookie.authUser)
      }
      if (cookie.account.token instanceof Object) {
        store.commit('account/SET_TOKEN', cookie.account.token)
      }
      if (cookie.cart.cartContents[0] instanceof Object) {
        store.commit('cart/SET_CART', cookie.cart.cartContents)
      }
    }
  } catch (e) {
    console.log(e)
  }
}
