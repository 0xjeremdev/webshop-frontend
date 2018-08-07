// import Cookies from 'js-cookie'

export const state = () => ({
  buckaroo_link: 'https://checkout.buckaroo.nl',
  buckaroo_testlink: 'https://testcheckout.buckaroo.nl',
  data: ['Bank Transfer', 'IDEAL', 'PayPal'],
  ideal_data: {},
  paypal_data: {}
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
  async getIdealData ({ context, commit, state, rootState }) {
    try {
      const testmode = true
      const link = (testmode) ? state.buckaroo_testlink : state.buckaroo_link
      let mydata = await this.$axios.$get(link + '/json/Transaction/Specification/ideal?serviceVersion=2')
      return mydata
    } catch (e) {
      console.log(e)
      return e
    }
  },

  async getPayPalData ({ context, commit, state, rootState }) {
    try {
      const testmode = true
      const link = (testmode) ? state.buckaroo_testlink : state.buckaroo_link
      let mydata = await this.$axios.$get(link + '/json/Transaction/Specification/paypal?serviceVersion=1')
      return mydata
    } catch (e) {
      console.log(e)
      return e
    }
  },

  async doPayViaIDEAL ({ context, commit, state, rootState }, { payment }) {
    try {
      const testmode = true
      const link = (testmode) ? state.buckaroo_testlink : state.buckaroo_link
      let mydata = await this.$axios.$post(link + '/json/Transaction', payment)
      return mydata
    } catch (e) {
      console.log(e)
      return e
    }
  },

  async doPayViaPayPal ({ context, commit, state, rootState }, { payment }) {
    try {
      const testmode = true
      const link = (testmode) ? state.buckaroo_testlink : state.buckaroo_link
      let mydata = await this.$axios.$post(link + '/json/Transaction', payment)
      return mydata
    } catch (e) {
      console.log(e)
      return e
    }
  }
}
