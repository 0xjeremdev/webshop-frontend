<template>
  <section class="section">
    <hr class="navbar-divider my_div">
    <breadCrumb></breadCrumb>
    <hr class="navbar-divider my_div">
    <search></search>
    <div class="container">
      <h1 class="title">Cart</h1>
      <b-table :data="getCartContents"
        checkable
        :checked-rows.sync="checkedRows">
        <template slot-scope="props">
          <b-table-column field="id" label="ID" width="40" numeric>
            {{ props.row.id }}
          </b-table-column>

          <b-table-column field="name" label="Name" numeric>
            {{ props.row.name }}
          </b-table-column>

          <b-table-column field="amount" width="60" label="Amount" numeric>
            <b-field>
              <b-input class="has-text-right" type="number" placeholder="0" :value="props.row.amount" @input="setAmount($event, props)"></b-input>
            </b-field>
          </b-table-column>

          <b-table-column field="price" label="Price" numeric>
            € {{ (parseFloat(props.row.price ) * Number(props.row.amount)).toFixed(2) }}
          </b-table-column>

          <b-table-column label="Actions">
              <button class="button is-danger" @click="doDeleteCart(key)"><b-icon icon="delete-forever"></b-icon></button>
          </b-table-column>
        </template>

        <template slot="footer" v-if="getCartContents[0]">
          <th></th>
          <th></th>
          <th></th>
          <th>
            <div class="th-wrap is-numeric">Total:</div>
          </th>
          <th>
            <div class="th-wrap is-numeric">€ {{ parseFloat(calcTotal).toFixed(2) }}</div>
          </th>
          <th></th>
        </template>

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
    </div>
  </section>
</template>

<script>
  import Cookies from 'js-cookie'
  import breadCrumb from '~/components/widgets/breadcrumb.vue'
  import search from '~/components/widgets/search.vue'
  import { mapGetters } from 'vuex'

  export default {
    components: { search, breadCrumb },
    data () {
      return {
        checkedRows: []
      }
    },
    created () {
      let cookie = Cookies.getJSON('key2publish')
      console.log(cookie)
      if (!(this.$store.state.authUser instanceof Object)) {
        this.$store.commit('SET_USER', cookie.authUser)
      }
      if (!(this.$store.state.cartContents instanceof Array)) {
        this.$store.commit('SET_CART', cookie.cartContents)
      }
    },
    computed: {
      ...mapGetters({
        getCartContents: ''
      }),
      /* getCartContents: function () {
        return this.$store.state.cartContents
      }, */
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
      },
      addToCart (amount, row) {
        let contents = {'amount': amount - 1, 'id': row.id, 'price': row.price}
        this.$store.commit('ADD_TO_CART', contents)
      },
      setAmount: function (value, row) {
        console.log(row)
        console.log(value)
        if (value <= 0) {
          this.doDeleteCart(row.index)
        } else {
          this.addToCart(value, row.row)
        }
      }
    }
  }
</script>
