<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Overview and Payment</h1>
      <div class="columns">
        <div class="column">
          <table class="table">
            <thead>
              <th class="th-wrap">ID</th>
              <th class="th-wrap">Name</th>
              <th class="th-wrap has-text-right">Amount</th>
              <th class="th-wrap has-text-right">Price</th>
            </thead>
            <tbody>
              <tr v-for="(value) in cartContents">
                <td>{{ value.id }}</td>
                <td>{{ value.name }}</td>
                <td class="has-text-right">{{ value.amount }}</td>
                <td class="has-text-right">€ {{ (parseFloat(value.price ) * Number(value.amount)).toFixed(2) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="th-wrap">&nbsp;</td>
                <td class="th-wrap">&nbsp;</td>
                <td class="th-wrap has-text-right">Total:</td>
                <td class="th-wrap has-text-right">€ {{ parseFloat(calcTotal()).toFixed(2) }}</td>
              </tr>
            </tfoot>
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
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        cartContents: [],
        paymentMethod: null,
        agreement: false,
        paymentMethods: [
          {
            code: 'cct',
            name: 'Credit Card Test',
            price: '10'
          },
          {
            code: 'ideal',
            name: 'IDEAL Test',
            price: '0'
          },
          {
            code: 'bank',
            name: 'Bank',
            price: '5'
          }
        ]
      }
    },
    asyncData ({ store }) {
      return { cartContents: store.state.cart.cartContents }
    },
    async created () {
      await this.getData()
      this.cartContents = this.$store.state.cart.cartContents
    },
    methods: {
      async getData () {
        let cart = this.$store.state.cart.cartContents
        await this.$store.dispatch('cart/getProductForCart', { cart: cart }, { root: true })
      },
      calcTotal: function () {
        let total = 0
        for (let key in this.cartContents) {
          total += parseFloat(this.cartContents[key].price) * Number(this.cartContents[key].amount)
        }
        return total
      },
      placeOrder () {
        this.$router.push('/order/done')
      }
    }
  }
</script>
