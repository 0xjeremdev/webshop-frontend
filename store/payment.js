// import Cookies from 'js-cookie'
import { BuckarooHmac } from '~/utils/utils'

export const state = () => ({
  buckaroo_link: 'checkout.buckaroo.nl',
  buckaroo_testlink: 'testcheckout.buckaroo.nl',
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
      const requestUri = link + '/json/Transaction/Specification/ideal?serviceVersion=2'
      const websiteKey = 'sZ31uaeeGJ'
      const secretKey = 'fds76hb390'
      const content = ''
      const httpMethod = 'GET'
      let header = BuckarooHmac.GetAuthHeader(requestUri, websiteKey, secretKey, content, httpMethod)
      console.log(header)
      let mydata = await this.$axios.$get('https://' + link + '/json/Transaction/Specification/ideal?serviceVersion=2', { headers: { Authorization: `${header}` } })
      // console.log(mydata.Actions[0].RequestParameters)
      if (mydata.Actions[0].RequestParameters !== undefined) return mydata.Actions[0].RequestParameters
      return {}
    } catch (e) {
      console.log(e)
      return e
    }
  },

  async getPayPalData ({ context, commit, state, rootState }) {
    try {
      const testmode = true
      const link = (testmode) ? state.buckaroo_testlink : state.buckaroo_link
      const requestUri = link + '/json/Transaction/Specification/ideal?serviceVersion=2'
      const websiteKey = 'sZ31uaeeGJ'
      const secretKey = 'fds76hb390'
      const content = ''
      const httpMethod = 'GET'
      let header = BuckarooHmac.GetAuthHeader(requestUri, websiteKey, secretKey, content, httpMethod)
      let mydata = await this.$axios.$get('https://' + link + '/json/Transaction/Specification/paypal?serviceVersion=1', { headers: { Authorization: `${header}` } })
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
      const requestUri = link + '/json/Transaction/Specification/ideal?serviceVersion=2'
      const websiteKey = 'sZ31uaeeGJ'
      const secretKey = 'fds76hb390'
      const content = ''
      const httpMethod = 'GET'
      let header = BuckarooHmac.GetAuthHeader(requestUri, websiteKey, secretKey, content, httpMethod)
      let mydata = await this.$axios.$post('https://' + link + '/json/Transaction', payment, { headers: { Authorization: `${header}` } })
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
      const requestUri = link + '/json/Transaction/Specification/ideal?serviceVersion=2'
      const websiteKey = 'sZ31uaeeGJ'
      const secretKey = 'fds76hb390'
      const content = ''
      const httpMethod = 'GET'
      let header = BuckarooHmac.GetAuthHeader(requestUri, websiteKey, secretKey, content, httpMethod)
      let mydata = await this.$axios.$post('https://' + link + '/json/Transaction', payment, { headers: { Authorization: `${header}` } })
      return mydata
    } catch (e) {
      console.log(e)
      return e
    }
  }
}
