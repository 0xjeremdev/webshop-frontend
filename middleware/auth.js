export default function ({ store, route, redirect }) {
  let isAdminRoute = route.path
  isAdminRoute = isAdminRoute.startsWith('admin', 1)
  let isAdminLogin = (route.path !== '/admin')
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
