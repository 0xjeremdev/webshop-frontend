export default function ({ store, route, redirect, app }) {
  store.commit('account/SET_TOKEN', app.$cookies.get('key2publish').account.token)
  if (!store.state.account.token) {
    store.commit('SET_REMEMBERLINK', route.path)
    return redirect('/account/login')
  }
  store.dispatch('account/checkAuth').then(function (data) {
    if (!data) {
      store.commit('SET_REMEMBERLINK', route.path)
      return redirect('/account/login')
    }
    return data
  })
}
