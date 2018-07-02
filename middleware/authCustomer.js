import Cookies from 'js-cookie'

export default function ({ store, route, redirect }) {
  store.commit('account/SET_TOKEN', Cookies.getJSON('key2publish').account.token)
  if (!store.state.account.token) {
    console.log('komhier')
    return redirect('/account/login')
  }
  store.dispatch('account/checkAuth').then(function (data) {
    if (!data) {
      return redirect('/account/login')
    }
    return data
  })
}
