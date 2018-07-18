<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Send a quote to your purchasing department</h1>
      <em>Please fill in below e-mail address of your purchasing department. This will send an email to your purchasing department, in which they can login (or create an account) and place the order for you. You can also send a quote to yourself, to place an order at a later date.</em>
      <br />
      <br />
      <b-message type="is-danger" has-icon title="An error has occured" :active.sync="showError">
        {{ formError }}
      </b-message>
      <div class="columns">
        <div class="column">
      <form @submit.prevent="sendQuote()">
        <b-field label="E-mail"
        :type="(typeof message['email'] !== 'undefined' && message['email'] !== '') ? 'is-danger' : ''"
        :message="message['email']">
          <b-input v-model="email" type="email" autocomplete='email' placeholder="example@labned.com"></b-input>
        </b-field>
        <button class="button is-orange" type="submit">Send quote</button>
      </form>
        </div>
        <div class="column">
          <h2 class="subtitle">Overview</h2>
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
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    middleware: 'authCustomer',
    data () {
      return {
        email: '',
        vat: this.$store.state.settings.VAT,
        message: {
          email: ''
        },
        showError: false,
        formError: 'There are errors, please correct them to save',
        isLoading: false
      }
    },
    async asyncData ({ store, error, app: { $cookies } }) {
      if (!(store.state.order.address instanceof Object)) {
        store.commit('order/SET_ADDRESS', $cookies.get('key2publish').order.address)
        store.commit('order/SET_BILLING', $cookies.get('key2publish').order.billing)
        store.commit('order/SET_CUSTOMER', $cookies.get('key2publish').order.customer)
        store.commit('SET_SETTINGS', $cookies.get('key2publish').settings)
      }
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
      let costs = await store.dispatch('order/getShippingCosts', { condition: condition }, { root: true })
      let zonecosts = await store.dispatch('order/getZoneCosts', { cc: store.state.order.address.country }, { root: true })
      console.log(zonecosts['result']['_result'])
      zonecosts = zonecosts['result']['_result'][0]
      // if (zonecosts['result'] !== undefined && zonecosts['result']['_result'].length > 0) zonecosts = zonecosts['result']['_result'][0]
      // if (zonecosts['result'] === undefined || zonecosts['result']['_result'].length <= 0) error({ 'statusCode': 500, 'message': 'An unexpected error occured' })
      var subtotal = 0
      for (let key in cart) {
        subtotal += parseFloat(cart[key].price) * Number(cart[key].amount)
      }
      let shippingcosts = parseFloat(zonecosts.price) + parseFloat(costs.price)
      let shippingtotal = subtotal + shippingcosts
      let vatamount = (store.state.settings.VAT / 100) * shippingtotal
      let total = shippingtotal + vatamount
      return { cartContents: cart, shippingcosts: shippingcosts, subtotal: subtotal, shippingtotal: shippingtotal, vatamount: vatamount, total: total }
    },
    computed: {
      checkErrors: {
        cache: false,
        get () {
          try {
            let messages = this.message
            for (var mes in messages) {
              // console.log(mes + ' - ' + this.message[mes])
              if (this.message[mes] !== '') {
                return true
              }
            }
            return false
          } catch (e) {
            console.log(e)
          }
        }
      }
    },
    methods: {
      async validate (value, fld, type) {
        let messages = this.message
        switch (type) {
          case 'email':
            messages[fld] = await this.$store.dispatch('validation/validateMail', { value: value })
            break
        }

        this.message = '' // hack to let two way binding work if a key in an object has changed
        this.message = messages
        this.customer[fld] = value
      },
      async sendQuote () {
        try {
          this.isLoading = true
          this.formError = 'There are errors, please correct them to send your quote'
          // validate fields here
          await this.validate(this.email, 'email', 'email')
          if (this.checkErrors) {
            this.showError = true
            this.isLoading = false
          }
          if (!this.checkErrors) {
            let result = await this.$store.dispatch('order/placeQuote', { status: 'Quote placed', email: this.email })
            if (result) {
              this.isLoading = false
              this.showError = false
              // this.router.replace({ path: '/order/done', replace: true})
              // this.$toast.open({ message: 'Saved', type: 'is-success' })
            }
            this.showError = true
            this.formError = 'Could not change your login credentials, please provide either the same e-mail or an e-mail that has not been registered yet. Also check you have inserted your current password correctly'
            this.isLoading = false
            // this.$toast.open({ message: 'Could not save data, please try again', type: 'is-danger' })
          }
        } catch (e) {
          console.log(e)
          this.showError = true
          this.isLoading = false
          // this.$toast.open({ message: 'Could not save data, please try again', type: 'is-danger' })
        }
      }
    }
  }
</script>
