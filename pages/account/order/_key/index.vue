<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="order"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Order No: {{ order.order_no }}</h1>
          <div>Order Date: {{ order_date }}</div>
          <br />
          <div class="columns">
            <div class="column is-one-third">
              <h2 class="subtitle">Order send by</h2>
              <table class="table">
                <tbody>
                  <tr>
                    <th class="th-wrap">Name:</th>
                    <td>{{ order.customer.title }} {{ order.customer.firstname }} {{ order.customer.lastname}}</td>
                  </tr>
                  <!-- <tr>
                    <th class="th-wrap">Gender:</th>
                    <td>{{ order.customer.gender }}</td>
                  </tr> -->
                  <tr>
                    <th class="th-wrap">Company:</th>
                    <td>{{ order.customer.company }}</td>
                  </tr>
                  <tr>
                    <th class="th-wrap">Phone:</th>
                    <td>{{ order.customer.phone }} </td>
                  </tr>
                  <tr>
                    <th class="th-wrap">Mobile:</th>
                    <td>{{ order.customer.mobile }}</td>
                  </tr>
                  <tr>
                    <th class="th-wrap">Fax:</th>
                    <td>{{ order.customer.fax }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="column">
              <h2 class="subtitle">Products</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th class="th-wrap">ID</th>
                    <th class="th-wrap">Name</th>
                    <th class="th-wrap">Amount</th>
                    <th class="th-wrap" width="15%">Price</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <td class="th-wrap"></td>
                    <td colspan="2" class="th-wrap has-text-right"><strong>Subtotal (ex. VAT):</strong></td>
                    <td width="15%" class="th-wrap has-text-right"><strong>€ {{ parseFloat(subtotal).toFixed(2) }}</strong></td>
                  </tr>
                  <tr v-if="order.discount !== undefined && order.discount !== 0">
                    <td class="th-wrap"></td>
                    <td colspan="2" class="th-wrap has-text-right">Discount:</td>
                    <td width="15%" class="th-wrap has-text-right">€ {{ parseFloat(order.discount).toFixed(2) }}</td>
                  </tr>
                  <tr v-if="order.discount !== undefined && order.discount !== 0">
                    <td class="th-wrap"></td>
                    <td colspan="2" class="th-wrap has-text-right"><strong>Total With Discount (ex. VAT):</strong></td>
                    <td width="15%" class="th-wrap has-text-right"><strong>€ {{ parseFloat(order.subtotalwithdiscount).toFixed(2) }}</strong></td>
                  </tr>
                  <tr>
                    <td class="th-wrap"></td>
                    <td colspan="2" class="th-wrap has-text-right">Shipping Costs (ex. VAT):</td>
                    <td width="15%" class="th-wrap has-text-right">€ {{ parseFloat(order.shippingcosts).toFixed(2) }}</td>
                  </tr>
                  <tr>
                    <td class="th-wrap"></td>
                    <td colspan="2" class="th-wrap has-text-right"><strong>Total (ex. VAT):</strong></td>
                    <td width="15%" class="th-wrap has-text-right"><strong>€ {{ parseFloat(order.shippingtotal).toFixed(2) }}</strong></td>
                  </tr>
                  <tr>
                    <td class="th-wrap"></td>
                    <td colspan="2" class="th-wrap has-text-right">VAT: {{ (order.vat) ? `(${order.vat}%)` : '' }}</td>
                    <td width="15%" class="th-wrap has-text-right">€ {{ parseFloat(order.vatamount).toFixed(2) }}</td>
                  </tr>
                  <tr>
                    <td class="th-wrap"></td>
                    <td colspan="2" class="th-wrap has-text-right"><strong>Total (incl. VAT):</strong></td>
                    <td width="15%" class="th-wrap has-text-right"><strong>€ {{ parseFloat(order.total).toFixed(2) }}</strong></td>
                  </tr>
                </tfoot>
                <tbody>
                  <tr v-for="(value, index) in order.items">
                    <td>{{ value.id }}</td>
                    <td>{{ value.name }}</td>
                    <td>{{ value.amount }}</td>
                    <td>€ {{ (parseFloat(value.price) * Number(value.amount)).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <h2 class="subtitle">Your billing address details:</h2>
              <table class="table">
                <tbody>
                  <tr><td>Name:</td><td>{{ order.billing_address.name }}</td></tr>
                  <tr><td>Street: </td><td>{{ order.billing_address.street }}</td></tr>
                  <tr><td>House No.: </td><td>{{ order.billing_address.houseno }}</td></tr>
                  <tr><td>Postal code: </td><td>{{ order.billing_address.postcode }}</td></tr>
                  <tr><td>City: </td><td>{{ order.billing_address.city }}</td></tr>
                  <tr><td>Country: </td><td>{{ order.billing_address.country }}</td></tr>
                </tbody>
              </table>
            </div>
            <div class="column">
              <h2 class="subtitle">Your delivery address details:</h2>
              <table class="table">
                <tbody>
                  <tr><td>Name:</td><td>{{ order.delivery_address.name }}</td></tr>
                  <tr><td>Street: </td><td>{{ order.delivery_address.street }}</td></tr>
                  <tr><td>House No.: </td><td>{{ order.delivery_address.houseno }}</td></tr>
                  <tr><td>Postcode: </td><td>{{ order.delivery_address.postcode }}</td></tr>
                  <tr><td>City: </td><td>{{ order.delivery_address.city }}</td></tr>
                  <tr><td>Country: </td><td>{{ order.delivery_address.country }}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <button class="button is-orange" @click="doReOrder()">Reorder</button>
        </div>
      </div>
    </div>
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  </section>
</template>

<script>
  import accountMenu from '~/components/ui/accountMenu.vue'

  export default {
    middleware: 'authCustomer',
    components: { accountMenu },
    data () {
      return {
        quote: {},
        isLoading: false
      }
    },
    async asyncData ({ store, params, app: { $axios, $cookies } }) {
      try {
        if (params.key !== undefined) {
          let order = await $axios.$get(store.state.apiUrl + '/order/' + params.key, { headers: { Authorization: `Bearer ${store.state.account.token.jwt}` } })
          console.log(order)
          let orderResult = order.result._result[0]
          var subtotal = 0
          for (let v = 0; v < orderResult.items.length; v++) {
            subtotal += (parseFloat(orderResult.items[v].price) * Number(orderResult.items[v].amount))
          }
          let orderDate = new Date(orderResult.order_date)
          var monthNums = [
            '01', '02', '03',
            '04', '05', '06', '07',
            '08', '09', '10',
            '11', '12'
          ]

          var day = orderDate.getDate()
          var monthIndex = monthNums[orderDate.getMonth()]
          var year = orderDate.getFullYear()
          orderDate = year + '-' + monthIndex + '-' + day

          let items = order.result._result[0].items
          console.log(items)

          let activeProducts = await store.dispatch('product/getProductsActive', { items: items })

          return { order: order.result._result[0], activeProducts: activeProducts, subtotal: subtotal, order_date: orderDate }
        }

        return { order: {}, subtotal: 0 }
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      doReOrder () {
        if (this.activeProducts) {
          this.$store.commit('cart/SET_CART', this.order.items)
          this.$router.push('/cart')
        } else {
          this.$toast.open('One or more items are not available anymore. Please contact our customer support to help you further')
        }
      }
    }
  }
</script>
