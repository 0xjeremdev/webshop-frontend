<template>
  <b-dropdown hoverable position="is-bottom-left">
      <button class="button is-orange" @click="$router.push('/cart')" style="border: 1px solid white;" slot="trigger">
        <b-icon icon="cart-outline"></b-icon>
        <span>Cart</span>
      </button>
      <b-dropdown-item v-show="getCartContents[0]" @click="$router.push('/cart')">
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
              <td>{{ val.name }}</td>
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
        <!-- <nuxt-link to="/cart"><button class="button is-danger">Go To Cart</button></nuxt-link> -->
      </b-dropdown-item>
      <b-dropdown-item v-show="!getCartContents[0]">
        Cart is empty
      </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  export default {
    data () {
      return {
        cartContents: []
      }
    },
    computed: {
      getCartContents: function () {
        return this.$store.state.cart.cartContents
      },
      calcTotal: function () {
        let total = 0
        let cartContents = this.$store.state.cart.cartContents
        for (let key in cartContents) {
          // console.log(key)
          total += parseFloat(cartContents[key].price) * Number(cartContents[key].amount)
        }
        return total
      }
    },
    methods: {
      doDeleteCart: function (index) {
        this.$store.commit('cart/REMOVE_FROM_CART', index)
      }
    }
  }
</script>
