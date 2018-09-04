<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Send a quote to your purchasing department</h1>
      <em>Please fill in below e-mail address of your purchasing department. This will send an email to your purchasing department, in which they can login (or create an account) and place the order for you. You can also send a quote to yourself, to place an order at a later date.</em>
      <br />
      <br />
      <b-message :type="(wasSend) ? 'is-success' : 'is-danger'" has-icon :title="(wasSend) ? 'Success' : 'An error has occured'" :active.sync="showError">
        {{ formError }}
      </b-message>
      <!-- <b-message type="is-danger" has-icon title="An error has occured" :active.sync="showError">
        {{ formError }}
      </b-message> -->
      <div v-if="!wasSend" class="columns">
        <div class="column">
      <form @submit.prevent="sendQuote()">
        <b-field label="E-mail"
        :type="(typeof message['email'] !== 'undefined' && message['email'] !== '') ? 'is-danger' : ''"
        :message="message['email']">
          <b-input v-model="email" type="email" autocomplete='email' placeholder="example@labned.com"></b-input>
        </b-field>
        <p class="control"><button class="button is-orange" type="submit">Send Quote</button></p>
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
      <p class="control"><button class="button is-info" style="margin-right: 0.75em;" @click="backToSearch()">Back to Search</button>
      <button class="button is-info" @click="checkQuotes">Check send Quotes</button></p>
    </div>
  </section>
</template>

<script>
  export default {
    middleware: 'authCustomer',
    data () {
      return {
        wasSend: false,
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
      console.log(store.account)
      // if (!(Object.keys(store.account.token).length === 0 && store.account.token.constructor === Object)) {
      // store.commit('account/SET_TOKEN', $cookies.get('key2publish').account.token)
      // }
      let data = await store.dispatch('account/getAuth')
      if (data.data.result.id !== undefined) {
        const customer = await store.dispatch('account/getCustomer', { id: data.data.result.id })
        store.commit('order/SET_CUSTOMER', customer.data.result._result[0])
      }
      if (Object.keys(store.state.order.customer).length === 0 && store.state.order.customer.constructor === Object) {
        store.commit('order/SET_CUSTOMER', $cookies.get('key2publish').order.customer)
        store.commit('SET_SETTINGS', $cookies.get('key2publish').settings)
      }
      let cart = store.state.cart.cartContents
      await store.dispatch('cart/getProductForCart', { cart: cart }, { root: true })
      cart = store.state.cart.cartContents

      var subtotal = 0
      for (let key in cart) {
        subtotal += parseFloat(cart[key].price) * Number(cart[key].amount)
      }

      return { cartContents: cart, subtotal: subtotal }
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
        this[fld] = value
      },
      async backToSearch () {
        this.$router.push('/search')
      },
      async checkQuotes () {
        this.$router.replace({ path: '/account/quote', replace: true })
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
            let result = await this.$store.dispatch('order/placeQuote', { status: 'Quote placed', email: this.email, subtotal: this.subtotal })
            if (result) {
              this.isLoading = false
              this.showError = true
              this.$store.commit('cart/SET_CART', [])
              this.formError = 'We have send the quote to the specified e-mail: ' + this.email
              this.wasSend = true
              // this.$router.replace({ path: '/account/quote', replace: true })
              // this.$toast.open({ message: 'Saved', type: 'is-success' })
            } else {
              this.showError = true
              this.formError = 'Could not send a quote. Server was not responding please contact us so we can assist you in another way'
              this.isLoading = false
              this.wasSend = false
            } // this.$toast.open({ message: 'Could not save data, please try again', type: 'is-danger' })
          }
        } catch (e) {
          console.log(e)
          this.showError = true
          this.isLoading = false
          this.formError = 'Could not send a quote. Server was not responding please contact us so we can assist you in another way'
          this.wasSend = false
          // this.$toast.open({ message: 'Could not save data, please try again', type: 'is-danger' })
        }
      }
    }
  }
</script>
