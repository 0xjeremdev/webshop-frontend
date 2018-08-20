export default function ({ store, route, redirect, app }) {
  let isAdminRoute = route.path
  isAdminRoute = isAdminRoute.startsWith('admin', 1)
  let isAdminLogin = (route.path !== '/admin')
  if (app.$cookies.get('key2publish') !== undefined) store.commit('SET_USER', app.$cookies.get('key2publish').authUser)
  if (!store.state.authUser) {
    if ((isAdminRoute) && (isAdminLogin)) {
      return redirect('/admin')
    }
  }
  try {
    store.dispatch('checkAuth').then(function (data) {
      if ((isAdminRoute) && (isAdminLogin) && (!data)) {
        return redirect('/admin')
      }
    })
  } catch (e) {
    console.log(e)
  }
}
