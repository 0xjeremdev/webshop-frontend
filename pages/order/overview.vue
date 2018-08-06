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
                <th class="th-wrap has-text-right">Price</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right"><strong>Subtotal (ex. VAT):</strong></td>
                <td class="th-wrap has-text-right"><strong>€ {{ parseFloat(subtotal).toFixed(2) }}</strong></td>
              </tr>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right">Shipping Costs (ex. VAT):</td>
                <td class="th-wrap has-text-right">€ {{ parseFloat(shippingcosts).toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right"><strong>Total (ex. VAT):</strong></td>
                <td class="th-wrap has-text-right"><strong>€ {{ parseFloat(shippingtotal).toFixed(2) }}</strong></td>
              </tr>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right">VAT ({{ vat }}%):</td>
                <td class="th-wrap has-text-right">€ {{ parseFloat(vatamount).toFixed(2) }}</td>
              </tr>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td colspan="2" class="th-wrap has-text-right"><strong>Total (inc. VAT):</strong></td>
                <td class="th-wrap has-text-right"><strong>€ {{ parseFloat(total).toFixed(2) }}</strong></td>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="(value) in cartContents">
                <td>{{ value.id }}</td>
                <td>{{ value.name }}</td>
                <td class="has-text-right">{{ value.amount }}</td>
                <td class="has-text-right">€ {{ (parseFloat(value.price ) * Number(value.amount)).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          <br/>
        </div>
        <div class="column">
          <h2 class="subtitle">Payment Methods</h2>
          <div class="field" v-for="value in paymentMethods">
            <b-radio v-model="paymentMethod"
              :native-value="value.code">
              {{ value.name }} <span v-if="value.price > 0"> (+ € {{ parseFloat(value.price).toFixed(2) }})</span>
            </b-radio>
          </div>
          <br/>
          <b-field>
            <b-checkbox v-model="agreement">I agree to the LabNed <a href="/termsandconditions" target="_new">Terms and Conditions</a> including it's <a href="/privacypolicy" target="_new">Privacy Policy</a></b-checkbox>
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
    middleware: 'authCustomer',
    components: { orderMenu },
    data () {
      return {
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
        vat: this.$store.state.settings.VAT,
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
      if (!(store.state.order.address instanceof Object)) {
        store.commit('order/SET_ADDRESS', $cookies.get('key2publish').order.address)
        store.commit('order/SET_BILLING', $cookies.get('key2publish').order.billing)
        store.commit('order/SET_CUSTOMER', $cookies.get('key2publish').order.customer)
      }
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
      // let costs = await store.dispatch('order/getShippingCosts', { condition: condition }, { root: true })
      let zonecosts = await store.dispatch('order/getZoneCosts', { cc: store.state.order.address.country }, { root: true })
      // console.log(zonecosts['result']['_result'])
      zonecosts = zonecosts['result']['_result'][0]['price'][condition]
      // console.log(parseFloat(zonecosts))
      // if (zonecosts['result'] !== undefined && zonecosts['result']['_result'].length > 0) zonecosts = zonecosts['result']['_result'][0]
      // if (zonecosts['result'] === undefined || zonecosts['result']['_result'].length <= 0) error({ 'statusCode': 500, 'message': 'An unexpected error occured' })
      var subtotal = 0
      for (let key in cart) {
        subtotal += parseFloat(cart[key].price) * Number(cart[key].amount)
      }
      let shippingcosts = parseFloat(zonecosts)
      let shippingtotal = subtotal + shippingcosts
      let vatamount = (store.state.settings.VAT / 100) * shippingtotal
      let total = shippingtotal + vatamount
      return { cartContents: cart, shippingcosts: shippingcosts, subtotal: subtotal, shippingtotal: shippingtotal, vatamount: vatamount, total: total }
    },
    methods: {
      placeOrder () {
        if (!this.agreement) {
          this.showError = true
          return false
        }

        this.showError = false
        // place order in database should be changed
        this.$store.dispatch('order/placeOrder', { status: 'Payment Received' }, { root: true })
        this.$store.commit('cart/SET_CART', [])
        this.$router.replace({path: '/order/done', replace: true})
      }
    }
  }
</script>
