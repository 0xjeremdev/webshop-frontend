import Cookies from 'js-cookie'

export default function ({ store, route, redirect }) {
  try {
    if (Cookies.getJSON('key2publish').authUser instanceof Object) {
      store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
    }
    var auth = false
    var isAdminRoute = false
    var authUser = store.state.authUser
    console.log('authuser:')
    console.log(authUser)
    if ((authUser !== null) && (authUser.jwt !== '')) {
      auth = true
    }
    // console.log('weetnietwatditis')
    // console.log(authUser)
    // console.log(route.path)
    isAdminRoute = route.path
    isAdminRoute = isAdminRoute.startsWith('admin', 1)

    if (!auth && isAdminRoute) {
      if (route.path !== '/admin') {
        return redirect('/admin')
      }
      // return redirect('/admin')
    }
  } catch (e) {
    console.log(e)
  }
}
