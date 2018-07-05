export default function ({ store, app }) {
  try {
    if (app.$cookies.get('key2publish').authUser instanceof Object) {
      store.commit('SET_USER', app.$cookies.get('key2publish').authUser)
    }
    if (app.$cookies.get('key2publish').account.token instanceof Object) {
      store.commit('account/SET_TOKEN', app.$cookies.get('key2publish').account.token)
    }
    if (app.$cookies.get('key2publish').cart.cartContents[0] instanceof Object) {
      store.commit('cart/SET_CART', app.$cookies.get('key2publish').cart.cartContents)
    }
  } catch (e) {
    console.log(e)
  }
}
