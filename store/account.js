import axios from 'axios'
import Cookies from 'js-cookie'

export const state = () => ({
  token: null,
  error: {}
})

export const mutations = {
  SET_TOKEN: function (state, value) {
    state.token = value
  },
  SET_ERROR: function (state, value) {
    state.error = value
  }
}

export const actions = {
  async login ({ commit, state, rootState }, { email, password }) {
    try {
      // console.log(state)
      const { data } = await axios.post(rootState.apiUrl + '/auth/login', { email, password })
      if (typeof data.result.jwt === 'undefined' || data.result.jwt === '') {
        throw new Error('Could not log in, invalid username/password')
      }
      commit('SET_TOKEN', data.result)
    } catch (error) {
      if (error.response.data.errors[0].type === 'AccountInactive') throw new Error('Your account is inactive, please validate your account by checking your email for the activation link. If no activation link was received please contact our Customer Support')
      if (error.response && error.response.status === 401) {
        throw new Error('Could not log in, invalid username/password')
      }
      throw error
    }
  },

  async logout ({ commit }) {
    try {
      commit('SET_TOKEN', '')
    } catch (error) {
      throw new Error('help')
    }
  },

  checkAuth ({ commit, state, rootState }) {
    try {
      if (!state.token) commit('SET_TOKEN', Cookies.getJSON('key2publish').account.token)
      // this.$axios.setToken(state.authUser.jwt, 'Bearer')
      if ((state.token !== null) && (typeof state.token === 'object')) {
        if (state.token.hasOwnProperty('jwt')) {
          return axios.get(rootState.apiUrl + '/checktoken', { headers: { Authorization: `Bearer ${state.token.jwt}` } })
            .then((res) => {
              console.log(res)
              if (Object.keys(res.data['result']).length > 0) {
                return true
              }
              return false
            })
            .catch((e) => {
              return false
            })
        }
      }
      return false
    } catch (e) {
      console.log(e)
      return false
    }
  },

  async getAuth ({ commit, state, rootState }) {
    if (!state.token) commit('SET_TOKEN', Cookies.getJSON('key2publish').account.token)
    // this.$axios.setToken(state.authUser.jwt, 'Bearer')
    if ((state.token !== null) && (typeof state.token === 'object')) {
      if (state.token.hasOwnProperty('jwt')) {
        return axios.get(rootState.apiUrl + '/checktoken', { headers: { Authorization: `Bearer ${state.token.jwt}` } })
      }
    }
    return false
  },

  async getCustomerByToken ({ state, rootState }) {
    try {
      if (state.token !== undefined && state.token !== null && state.token.jwt !== undefined && state.token.jwt !== null && state.token.jwt !== '') return await axios.get(rootState.apiUrl + '/customer', { headers: { Authorization: `Bearer ${state.token.jwt}` } })
      return false
    } catch (e) {
      console.log(e)
      return false
    }
  },

  async getCustomer ({ state, rootState }, { id }) {
    try {
      const key = id.replace('Customer/', '')
      return await axios.get(rootState.apiUrl + '/customer/' + key, { headers: { Authorization: `Bearer ${state.token.jwt}` } })
    } catch (e) {
      console.log(e)
      return false
    }
  },

  async saveCustomer ({ commit, state, rootState }, { customer }) {
    try {
      return await axios.put(rootState.apiUrl + '/customer/', customer, { headers: { Authorization: `Bearer ${state.token.jwt}` } })
    } catch (e) {
      console.log(e)
      return false
    }
  },

  async changePassword ({ commit, state, rootState }, { customer }) {
    try {
      return await axios.put(rootState.apiUrl + '/customer/changepassword', customer, { headers: { Authorization: `Bearer ${state.token.jwt}` } })
    } catch (e) {
      console.log(e)
      return false
    }
  },

  async getAddress ({ state, rootState }, { id }) {
    try {
      return await axios.get(rootState.apiUrl + '/address/' + id, { headers: { Authorization: `Bearer ${state.token.jwt}` } })
    } catch (e) {
      console.log(e)
      return false
    }
  },

  async getAddresses ({ state, rootState }) {
    try {
      return await axios.get(rootState.apiUrl + '/address?perPage=100&currentPage=1&mysort=name&sortOrder=asc', { headers: { Authorization: `Bearer ${state.token.jwt}` } })
    } catch (e) {
      console.log(e)
      return false
    }
  },
  async searchAddresses ({ state, rootState }, { query }) {
    try {
      return await axios.get(rootState.apiUrl + '/address?perPage=100&currentPage=1&mysort=name&sortOrder=asc&' + query, { headers: { Authorization: `Bearer ${state.token.jwt}` } })
    } catch (e) {
      console.log(e)
      return false
    }
  },

  async saveAddress ({ state, rootState }, { address }) {
    try {
      console.log(address)
      if (address._key !== undefined) {
        // update if key is set
        return await axios.put(rootState.apiUrl + '/address', address, { headers: { Authorization: `Bearer ${state.token.jwt}` } })
      }
      // insert if key is not set
      return await axios.post(rootState.apiUrl + '/address', address, { headers: { Authorization: `Bearer ${state.token.jwt}` } })
    } catch (e) {
      console.log(e)
      return false
    }
  },

  async register ({ commit, rootState }, { regData }) {
    try {
      // console.log(regData)
      if (regData.vatno === undefined) regData.vatno = ''
      if (regData.company === undefined) regData.company = ''
      if (regData.phone === undefined) regData.phone = ''
      if (regData.fax === undefined) regData.fax = ''
      if (regData.mobile === undefined) regData.mobile = ''
      if (regData.gender === undefined) regData.gender = ''
      await axios.post(rootState.apiUrl + '/auth/register', regData)
      // return data.status === 200
      return true
    } catch (error) {
      commit('SET_ERROR', error.response.data.errors)
      return false
    }
  },

  async forgotPassword ({ rootState }, { email }) {
    try {
      await axios.post(rootState.apiUrl + '/recovery/auth/reset/request', { email: email })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },

  async verifyPasswordByToken ({ rootState }, { token }) {
    try {
      await axios.post(rootState.apiUrl + '/recovery/auth/reset/verifytoken', { token: token })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },

  async resetPasswordByToken ({ rootState }, { token, password }) {
    try {
      await axios.post(rootState.apiUrl + '/recovery/auth/reset', { token: token, password: password })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },

  async deleteAccount ({ rootState, state }) {
    try {
      await axios.delete(rootState.apiUrl + '/customer', { headers: { Authorization: `Bearer ${state.token.jwt}` } })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
