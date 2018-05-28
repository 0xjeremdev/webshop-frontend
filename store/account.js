import axios from 'axios'

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

  async register ({ commit, state, rootState }, { regData }) {
    try {
      console.log(regData)
      await axios.post(rootState.apiUrl + '/auth/register', regData)
      // return data.status === 200
      return true
    } catch (error) {
      commit('SET_ERROR', error.response.data.errors)
      return false
    }
  }
}
