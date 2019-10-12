export const state = () => ({
  data: ['Bank Transfer', 'IDEAL', 'PayPal']
})

export const mutations = {
  SET_DATA: function (state, value) {
    state.data = value
  },
  SET_IDEALDATA: function (state, value) {
    state.ideal_data = value
  },
  SET_PAYPALDATA: function (state, value) {
    state.paypal_data = value
  }
}

export const actions = {
  async getIdealData ({ rootState }) {
    try {
      let mydata = await this.$axios.$get(rootState.apiUrl + '/payment/ideal', { headers: { Authorization: `Bearer ${rootState.account.token.jwt}` } })
      // console.log(mydata.result.Actions)
      if (mydata.result.Actions[0].RequestParameters !== undefined) return mydata.result.Actions[0].RequestParameters
      return {}
    } catch (e) {
      console.log(e)
      return e
    }
  },

  async getPayPalData ({ rootState }) {
    try {
      let mydata = await this.$axios.$get(rootState.apiUrl + '/payment/paypal', { headers: { Authorization: `Bearer ${rootState.account.token.jwt}` } })
      // console.log(mydata.result.Actions)
      if (mydata.result.Actions[0].RequestParameters !== undefined) return mydata.result.Actions[0].RequestParameters
      return {}
    } catch (e) {
      console.log(e)
      return e
    }
  },

  async doPay ({ rootState }, { payment }) {
    try {
      let mydata = await this.$axios.$post(rootState.apiUrl + '/payment/transaction', payment, { headers: { Authorization: `Bearer ${rootState.account.token.jwt}` } })
      console.log(mydata)
      return mydata
    } catch (e) {
      console.log(e)
      return e
    }
  }
}
