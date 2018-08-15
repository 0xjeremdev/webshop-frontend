export default function ({ store, route, redirect, app }) {
  if (app.$cookies.get('key2publish') !== undefined) store.commit('account/SET_TOKEN', app.$cookies.get('key2publish').account.token)
  store.commit('SET_REMEMBERLINK', route.path, { root: true })
  if (!store.state.account.token) {
    // console.log('myroute is:' + route.path)
    return redirect('/account/login')
  }
  store.dispatch('account/checkAuth').then(function (data) {
    if (!data) {
      return redirect('/account/login')
    }
    return data
  })
}
