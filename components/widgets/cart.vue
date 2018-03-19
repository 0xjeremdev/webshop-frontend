<template>
  <b-dropdown hoverable>
    <button class="button is-danger" slot="trigger">
      <b-icon icon="cart-outline"></b-icon>
      <span>Cart</span>
    </button>
    <b-dropdown-item><h1 class="subtitle">Cart</h1></b-dropdown-item>
    <b-dropdown-item v-if="cartContents">
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
          <tr v-for="val in cartContents">
            <td>{{ val.id }}</td>
            <td class="has-text-right">{{ val.amount }}</td>
            <td class="has-text-right">€ {{ parseFloat(val.total).toFixed(2) }}</td>
            <td></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="has-text-right"><b>Totaal:</b></td>
            <td class="has-text-right">€ {{ parseFloat(calcTotal).toFixed(2) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </b-dropdown-item>
    <b-dropdown-item v-else>
      Cart is empty
    </b-dropdown-item>
    <b-dropdown-item v-on:click="goToCart()"><button class="button is-danger">Go To Cart</button></b-dropdown-item>
  </b-dropdown>
</template>

<script>
  export default {
    data () {
      return {
        cartContents: [ { amount: 5, id: 'CD3', total: 55.00 }, { amount: 2, id: 'RD3', total: 20.00 }, { amount: 104, id: 'BD3', total: 104.24 } ]
      }
    },
    computed: {
      calcTotal: function () {
        let total = 5
        for (let key in this.cartContents) {
          total += this.cartContents[key].total
        }
        return total
      }
    }
  }
</script>
