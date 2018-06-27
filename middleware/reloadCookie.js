import Cookies from 'js-cookie'

export default function ({ store }) {
  try {
    if (Cookies.getJSON('key2publish').authUser instanceof Object) {
      store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
    }
    if (Cookies.getJSON('key2publish').cartContents instanceof Array && Cookies.getJSON('key2publish').cartContents[0] instanceof Object) {
      store.commit('SET_CART', Cookies.getJSON('key2publish').cartContents)
    }
  } catch (e) {
    console.log(e)
  }
}
