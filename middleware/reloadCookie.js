import Cookies from 'js-cookie'

export default function ({ store }) {
  try {
    if (Cookies.getJSON('key2publish').authUser instanceof Object) {
      store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
    }
  } catch (e) {
    console.log(e)
  }
}
