<template>
  <section>
    <div class="columns my-margin-top">
      <div class="column">
          <breadCrumb></breadCrumb>
      </div>
      <div class="column">

      </div>
    </div>
    <hr class="navbar-divider my_div">
    <div class="container">
      <h1 class="title">Cart</h1>
      <b-table :data="getCartContents">
        <template slot-scope="props">
          <b-table-column field="id" label="Art. No." width="40" numeric>
            {{ props.row.id }}
          </b-table-column>

          <b-table-column field="name" label="Product Description">
            {{ props.row.name }}
          </b-table-column>

          <b-table-column field="amount" width="100" label="Amount" numeric>
            <b-field>
              <b-input class="has-text-right" type="number" placeholder="0" :value="getCartContents[props.index].amount" @input="setAmount($event, props)"></b-input>
            </b-field>
          </b-table-column>

          <b-table-column field="price" label="Price *" numeric width="120">
            € {{ (parseFloat(props.row.price ) * Number(props.row.amount)).toFixed(2) }}
          </b-table-column>

          <b-table-column label="Actions" width="100">
              <button class="button is-info" @click="doDeleteCart(key)"><b-icon icon="delete-forever"></b-icon></button>
          </b-table-column>
        </template>

        <template slot="footer" v-if="getCartContents.length > 0">
          <th></th>
          <th>{{ text }}</th>
          <th>
            <div class="th-wrap is-numeric">Subtotal:</div>
            <div v-if="discount !== 0" class="th-wrap is-numeric" style="font-weight: normal;">Disc. ({{ discountPerc  }}%):</div>
            <div v-if="discount !== 0" class="th-wrap is-numeric">Total:</div>
          </th>
          <th>
            <div class="th-wrap is-numeric">€ {{ parseFloat(subtotal).toFixed(2) }}</div>
            <div v-if="discount !== 0" class="th-wrap is-numeric" style="font-weight: normal;">€ {{ parseFloat(discount).toFixed(2) }}</div>
            <div v-if="discount !== 0" class="th-wrap is-numeric">€ {{ parseFloat(total).toFixed(2) }}</div>
          </th>
          <th></th>
        </template>

        <tr>

        </tr>

        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon
                  icon="cart-off"
                  size="is-large">
                </b-icon>
              </p>
              <p>Your cart is empty, please search for a product and press the Add To Cart button</p>
            </div>
          </section>
        </template>
      </b-table>
      <div v-if="getCartContents.length > 0" class="columns">
        <div class="column">
        </div>
        <div class="column is-one-fifth">
          <button class="button is-orange" @click="requestQuote()">Ask for Quote</button>
        </div>
        <div class="column is-one-fifth">
          <nuxt-link to="/order"><button class="button is-success">Order</button></nuxt-link>
        </div>
      </div>
      <br />
    </div>
  </section>
</template>

<script>
  import Cookies from 'js-cookie'
  import breadCrumb from '~/components/widgets/breadcrumb.vue'
  import search from '~/components/widgets/search.vue'
  // import { mapGetters } from 'vuex'

  export default {
    components: { search, breadCrumb },
    data () {
      return {
        checkedRows: [],
        text: '* price is excluding shipping and handling costs and tax',
        subtotal: 0,
        discount: 0,
        total: 0,
        discountPerc: 0
      }
    },
    async created () {
      let cookie = Cookies.getJSON('key2publish')
      if (!(this.$store.state.account.token instanceof Object)) {
        this.$store.commit('SET_USER', cookie.account.token)
      }
      if (!(this.$store.state.cart.cartContents instanceof Object)) {
        this.$store.commit('cart/SET_CART', cookie.cart.cartContents)
      }
      await this.getData()
      this.subtotal = this.calcSubTotal()
      await this.calcDiscount()
      await this.calcTotal()
      console.log(this.subtotal)
      console.log(this.discount)
      console.log(this.total)
    },
    computed: {
      getCartContents () {
        return this.$store.state.cart.cartContents
      }
    },
    methods: {
      requestQuote () {
        this.$router.replace('/order/quote')
      },
      async getData () {
        let cart = this.$store.state.cart.cartContents
        await this.$store.dispatch('cart/getProductForCart', { cart: cart }, { root: true })
      },
      calcSubTotal: function () {
        let total = 0
        for (let key in this.getCartContents) {
          total += parseFloat(this.getCartContents[key].price) * Number(this.getCartContents[key].amount)
        }
        return total
      },
      async calcDiscount () {
        try {
          let total = 0
          total = this.subtotal
          let discount = await this.$store.dispatch('account/getCustomerByToken')
          discount = (discount.data.result !== undefined && discount.data.result._result !== undefined && discount.data.result._result.length > 0 && discount.data.result._result[0].discount !== undefined) ? discount.data.result._result[0].discount : 0
          discount = (!isNaN(discount)) ? discount : 0
          this.discountPerc = discount
          total = total * (discount / 100)
          this.discount = total
        } catch (e) {
          this.discount = 0
        }
      },
      async calcTotal () {
        let total = 0
        total = this.subtotal - this.discount
        this.total = total
      },
      doDeleteCart: function (index) {
        this.$store.commit('cart/REMOVE_FROM_CART', index)
        this.$toast.open('Product removed from cart!')
      },
      addToCart (amount, row) {
        let contents = {'amount': amount, 'id': row.id}
        console.log(contents)
        this.$store.commit('cart/ADD_TO_CART', contents)
      },
      doReset (value, row) {
        this.addToCart(1, row)
      },
      setAmount: function (value, row) {
        if (value <= 0) {
          this.$dialog.confirm({
            title: 'Remove product ' + row.row.id + ' from cart',
            message: 'Are you sure you want to <b>remove</b> this product? This action cannot be undone.',
            confirmText: 'Remove product',
            type: 'is-danger',
            hasIcon: true,
            onConfirm: () => this.doDeleteCart(row.index),
            onCancel: () => this.doReset(value, row.row)
          })
        } else {
          this.addToCart(value, row.row)
        }
      }
    }
  }
</script>

<style scoped>
  .is-orange {
    background-color: #ee7600;
    color: white;
  }

  .is-orange:hover {
    background-color: #0f77ea;
    color: white;
  }

  .my-margin-top {
    padding-top: 1rem;
  }
</style>
