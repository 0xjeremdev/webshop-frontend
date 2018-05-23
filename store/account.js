import axios from 'axios'

export const state = () => ({
  token: null
})

export const mutations = {
  SET_TOKEN: function (state, value) {
    state.token = value
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
      throw new Error('')
    }
  },

  async register ({ commit, state, rootState }, { regData }) {
    try {
      const { data } = await axios.post(rootState.apiUrl + '/auth/register', regData)
      return data
    } catch (error) {

    }
  }
}
