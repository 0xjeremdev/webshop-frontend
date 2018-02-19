export default function ({ store, route, redirect }) {
  if (!store.state.authUser) {
    let isAdminRoute = route.path
    isAdminRoute = isAdminRoute.startsWith('admin', 1)

    if ((isAdminRoute) && (route.path !== '/admin')) {
      return redirect('/admin')
    }
  }
}
