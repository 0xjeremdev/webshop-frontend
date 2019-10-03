<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Overview and Payment</h1>
      <orderMenu :step="step"></orderMenu>
      <b-message type="is-danger" has-icon title="An error has occured" :active.sync="showError">
        {{ formError }}
      </b-message>
      <div class="columns">
        <div class="column">
          <table class="table">
            <thead>
              <tr>
                <th class="th-wrap">ID</th>
                <th class="th-wrap">Name</th>
                <th class="th-wrap has-text-right">Amount</th>
                <th width="20%" class="th-wrap has-text-right">Price</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right"><strong>Subtotal (ex. VAT):</strong></td>
                <td width="20%" class="th-wrap has-text-right"><strong>€ {{ parseFloat(subtotal).toFixed(2) }}</strong></td>
              </tr>
              <tr v-if="discount !== 0">
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right">Discount ({{ discountPerc }}%):</td>
                <td width="20%" class="th-wrap has-text-right">€ {{ parseFloat(discount).toFixed(2) }}</td>
              </tr>
              <tr v-if="discount !== 0">
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right"><strong>Subtotal (ex. VAT):</strong></td>
                <td width="20%" class="th-wrap has-text-right"><strong>€ {{ parseFloat(subtotalwithdiscount).toFixed(2) }}</strong></td>
              </tr>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right">Shipping Costs (ex. VAT):</td>
                <td width="20%" class="th-wrap has-text-right">€ {{ parseFloat(shippingcosts).toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right"><strong>Total (ex. VAT):</strong></td>
                <td width="20%" class="th-wrap has-text-right"><strong>€ {{ parseFloat(shippingtotal).toFixed(2) }}</strong></td>
              </tr>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right">VAT ({{ vat }}%):</td>
                <td width="20%" class="th-wrap has-text-right">€ {{ parseFloat(vatamount).toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right"><strong>Total (inc. VAT):</strong></td>
                <td width="20%" class="th-wrap has-text-right"><strong>€ {{ parseFloat(total).toFixed(2) }}</strong></td>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="(value) in cartContents">
                <td>{{ value.id }}</td>
                <td>{{ value.name }}</td>
                <td class="has-text-right">{{ value.amount }}</td>
                <td width="20%" class="has-text-right">€ {{ (parseFloat(value.price ) * Number(value.amount)).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          <br/>
        </div>
        <div class="column">
          <h2 class="subtitle">Payment Methods</h2>
          <div class="field" v-for="(value, key) in payment_options" :key="key" v-if="value">
            <b-radio v-if="key === 'Bank Transfer' && customer['allow_banktransfer']" v-model="paymentMethod"
              :native-value="key" @input="setPaymentMethod($event)">
              {{ key }}
            </b-radio>
            <b-radio v-else-if="key !== 'Bank Transfer'" v-model="paymentMethod"
              :native-value="key" @input="setPaymentMethod($event)">
              {{ (key==="PayPal"? "Credit card / Paypal":key) }}
            </b-radio>
            <b-field label="Select your Bank" v-if="paymentMethod === 'iDeal' && key === 'iDeal'" v-for="(val, index) in idealData" :key="index">
              <b-select v-model="selectedBank" expanded placeholder="Select your bank" @input="setIdeal($event)">
                <option
                  v-for="bank in val.ListItemDescriptions"
                  :value="bank.Value"
                  :key="bank.Value"
                >
                  {{ bank.Description }}
                </option>
              </b-select>
            </b-field>
          </div>
          <br/>
          <b-field>
            <b-checkbox v-model="agreement">I agree to the LabNed <a href="/termsandconditions" target="_new">Terms and Conditions</a> and <a href="/privacypolicy" target="_new">Privacy Policy</a></b-checkbox>
          </b-field>
          <button class="button is-primary" @click="placeOrder()">Place Order</button>
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-fifth has-text-right">
          <nuxt-link to="/order"><button class="button is-orange">Previous</button></nuxt-link>
        </div>
        <div class="column">
        </div>
        <div class="column is-one-fifth">

        </div>
      </div>
      <b-loading :active.sync="isFetching" :canCancel="true"></b-loading>
    </div>
  </section>
</template>

<script>
  import orderMenu from '~/components/ui/orderMenu.vue'

  export default {
    middleware: ['authCustomer'],
    components: { orderMenu },
    data () {
      return {
        serviceLink: null,
        selectedBank: null,
        isFetching: false,
        step: '2',
        showError: false,
        formError: 'Please agree with our Terms and Conditions including our Privacy Policy',
        cartContents: [],
        paymentMethod: 'iDeal',
        agreement: false,
        shippingcosts: 0,
        shippingtotal: 0,
        subtotal: 0,
        vatamount: 0,
        total: 0,
        vat: this.$store.state.VAT,
        customer: {},
        payment_options: [],
        paymentMethods: [
          {
            code: 'paypal',
            name: 'PayPal Test',
            price: '0'
          },
          {
            code: 'iDeal',
            name: 'IDEAL Test',
            price: '0',
            options: []
          },
          {
            code: 'bank',
            name: 'Bank Transfer',
            price: '0'
          }
        ]
      }
    },
    async asyncData ({ store, error, app: { $cookies } }) {
      try {
        // if (!(store.state.order.address instanceof Object)) {
        store.commit('order/SET_ADDRESS', $cookies.get('key2publish').order.address)
        store.commit('order/SET_BILLING', $cookies.get('key2publish').order.billing)
        store.commit('order/SET_CUSTOMER', $cookies.get('key2publish').order.customer)
        // }
        store.dispatch('getSettings')

        let cart = store.state.cart.cartContents
        await store.dispatch('cart/getProductForCart', { cart: cart }, { root: true })
        let condition = 'RT'
        cart = store.state.cart.cartContents
        for (let v = 0; v < cart.length; v++) {
          if (cart[v]['shipping'] === 'DRY ICE') {
            condition = cart[v]['shipping']
            break
          }
          if (cart[v]['shipping'] === 'ICE') {
            condition = cart[v]['shipping']
          }
        }
        let zonecosts = await store.dispatch('order/getZoneCosts', { cc: store.state.order.address.country }, { root: true })
        zonecosts = zonecosts['result']['_result'][0]['price'][condition]
        let customerData = await store.dispatch('account/getCustomerByToken')
        var subtotal = 0
        for (let key in cart) {
          subtotal += parseFloat(cart[key].price) * Number(cart[key].amount)
        }
        let discount = (customerData.data.result !== undefined && customerData.data.result._result !== undefined && customerData.data.result._result.length > 0 && customerData.data.result._result[0].discount !== undefined) ? customerData.data.result._result[0].discount : 0
        let discountPerc = discount
        discount = subtotal * (discount / 100)
        let subtotalwithdiscount = subtotal - discount
        let shippingcosts = parseFloat(zonecosts)
        let shippingtotal = subtotalwithdiscount + shippingcosts
        let vatamount = (store.state.VAT / 100) * shippingtotal
        let total = shippingtotal + vatamount
        let idealData = await store.dispatch('payment/getIdealData')

        return { discountPerc: discountPerc, customer: customerData.data.result._result[0], payment_options: store.state.settings.payment_options, cartContents: cart, shippingcosts: shippingcosts, subtotal: subtotal, shippingtotal: shippingtotal, vatamount: vatamount, total: total, idealData: idealData, discount: discount, subtotalwithdiscount: subtotalwithdiscount }
      } catch (e) {
        console.log(e)
        error({ 'statusCode': 500, 'message': 'Unexpected error occured, please contact our support team' })
      }
    },
    methods: {
      placeOrder () {
        if (!this.agreement) {
          this.formError = 'Please agree with our Terms and Conditions including our Privacy Policy'
          this.showError = true
          return false
        }

        if (!this.serviceLink) {
          this.formError = 'Failed to communicate with this payment option, please select another option'
          this.showError = true
          return false
        }

        this.showError = false
        // place order in database should be changed
        // console.log(this.$router)
        window.location.href = this.serviceLink
        // this.$store.dispatch('order/placeOrder', { status: 'Payment Received' }, { root: true })
        // this.$store.commit('cart/SET_CART', [])
        // this.$router.replace({path: '/order/done', replace: true})
      },
      async setPaymentMethod (value) {
        try {
          this.showError = false
          this.paymentMethod = value
          if (value === 'PayPal') {
            let payment = {
              'Currency': 'EUR',
              'AmountDebit': parseFloat(this.total).toFixed(2),
              'Invoice': this.getOrderNo(),
              'ContinueOnIncomplete': 1,
              'ReturnURL': this.$store.state.settings.ReturnURL,
              'ReturnURLCancel': this.$store.state.settings.ReturnURLCancel,
              'ReturnURLError': this.$store.state.settings.ReturnURLError,
              'ReturnURLReject': this.$store.state.settings.ReturnURLReject,
              'PushURL': this.$store.state.settings.ReturnURL,
              'PushURLFailure': this.$store.state.settings.ReturnURLError,
              'Services': {
                'ServiceList': [
                  {
                    'Name': 'paypal',
                    'Action': 'Pay'
                  }
                ]
              }
            }
            let service = await this.$store.dispatch('payment/doPay', { payment: payment })
            if (service.result.RequiredAction !== undefined && service.result.RequiredAction.RedirectURL !== undefined) {
              this.serviceLink = service.result.RequiredAction.RedirectURL
            }
          }
          if (value === 'Bank Transfer') {
            this.serviceLink = '/order/done'
          }
        } catch (e) {
          console.log(e)
          this.formError = 'Failed to communicate with this payment option, please select another option'
          this.showError = true
        }
      },
      async setIdeal (value) {
        try {
          console.log(this)
          this.showError = false
          this.selectedBank = value
          let payment = {
            'Currency': 'EUR',
            'AmountDebit': parseFloat(this.total).toFixed(2),
            'Invoice': this.getOrderNo(),
            'ContinueOnIncomplete': 1,
            'ReturnURL': this.$store.state.settings.ReturnURL,
            'ReturnURLCancel': this.$store.state.settings.ReturnURLCancel,
            'ReturnURLError': this.$store.state.settings.ReturnURLError,
            'ReturnURLReject': this.$store.state.settings.ReturnURLReject,
            'PushURL': this.$store.state.settings.ReturnURL,
            'PushURLFailure': this.$store.state.settings.ReturnURLError,
            'ClientIP': {
              'Type': 0,
              'Address': '0.0.0.0'
            },
            'Services': {
              'ServiceList': [{
                'Name': 'ideal',
                'Action': 'Pay',
                'Parameters': [{
                  'Name': 'issuer',
                  'Value': value
                }]
              }]
            }
          }

          let service = await this.$store.dispatch('payment/doPay', { payment: payment })
          if (service.result.RequiredAction !== undefined && service.result.RequiredAction.RedirectURL !== undefined) {
            this.serviceLink = service.result.RequiredAction.RedirectURL
          }
        } catch (e) {
          console.log(e)
          this.formError = 'Failed to communicate with this payment option, please select another option'
          this.showError = true
        }
      },
      getOrderNo () {
        // create order_no
        let date = new Date()
        var monthNums = [
          '01', '02', '03',
          '04', '05', '06',
          '07', '08', '09',
          '10', '11', '12'
        ]
        var day = date.getDate()
        var monthIndex = monthNums[date.getMonth()]
        var year = date.getFullYear()

        let no = (Number(this.$store.state.settings.orderno_inc) + 1).toString()
        let size = Number(this.$store.state.settings.orderno_size)
        let s = no + ''
        while (s.length < size) s = '0' + s
        let orderno = this.$store.state.settings.order_prefix
        if (this.$store.state.settings.order_date) orderno += year + monthIndex + day
        orderno += s

        return orderno
      }
    }
  }
</script>
