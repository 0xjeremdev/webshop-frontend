<template>
  <b-dropdown hoverable position="is-bottom-left">
    <button class="button is-danger" style="border: 1px solid white;" slot="trigger">
      <b-icon icon="cart-outline"></b-icon>
      <span>Cart</span>
    </button>
    <b-dropdown-item v-if="getCartContents[0]">
      <h1 class="subtitle">Cart</h1>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th class="has-text-right">Amount</th>
            <th class="has-text-right">Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(val, key) in getCartContents">
            <td>{{ val.id }}</td>
            <td class="has-text-right">{{ val.amount }}</td>
            <td class="has-text-right">€ {{ (parseFloat(val.price) * Number(val.amount)).toFixed(2) }}</td>
            <td><button class="button is-danger" @click="doDeleteCart(key)"><b-icon icon="delete-forever"></b-icon></button></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="has-text-right"><b>Total:</b></td>
            <td class="has-text-right">€ {{ parseFloat(calcTotal).toFixed(2) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <nuxt-link to="/cart"><button class="button is-danger">Go To Cart</button></nuxt-link>
    </b-dropdown-item>
    <b-dropdown-item v-else>
      Cart is empty
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  export default {
    data () {
      return {
        cartContents: [ { amount: 5, id: 'CD3', price: 55.00 }, { amount: 2, id: 'RD3', price: 20.00 }, { amount: 104, id: 'BD3', price: 104.24 } ]
      }
    },
    computed: {
      getCartContents: function () {
        return this.$store.state.cartContents
      },
      calcTotal: function () {
        let total = 0
        for (let key in this.getCartContents) {
          // console.log(key)
          total += parseFloat(this.getCartContents[key].price) * Number(this.getCartContents[key].amount)
        }
        return total
      }
    },
    methods: {
      doDeleteCart: function (index) {
        this.$store.commit('REMOVE_FROM_CART', index)
      }
    }
  }
</script>
