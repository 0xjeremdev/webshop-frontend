export default function ({ store, route, redirect, axios, error }) {
  let isAdminRoute = route.path
  isAdminRoute = isAdminRoute.startsWith('admin', 1)
  if (!store.state.authUser) {
    if ((isAdminRoute) && (route.path !== '/admin')) {
      return redirect('/admin')
    }
  }
  if (store.state.authUser) {
    return axios.get(store.state.apiUrl + '/admin/checktoken/')
      .then((res) => {
      })
      .catch((e) => {
        if ((isAdminRoute) && (route.path !== '/admin')) {
          return redirect('/admin')
        }
      })
  }
}
