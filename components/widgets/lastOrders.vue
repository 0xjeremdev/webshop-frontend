<template>
  <div id="lastOrders">
    <p class="subtitle">Last 5 Orders</p>
    <b-table :data="isEmpty ? [] : orderData"
      hoverable>
      <template slot-scope="orderData">
        <b-table-column field="order_no" label="Order No">
            {{ orderData.row.order_no }}
        </b-table-column>

        <b-table-column field="items" label="Product Amount" numeric>
            {{ orderData.row.items.length }}
        </b-table-column>

        <b-table-column field="creation_date" label="Order date" centered>
            <span class="tag is-success">
                {{ new Date(orderData.row.order_date).toLocaleDateString() }}
            </span>
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                icon="emoticon-sad"
                size="is-large">
              </b-icon>
            </p>
            <p>No data found</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  template: '#last-order',
  data () {
    return {
      isLoading: false,
      orderData: [],
      isEmpty: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      try {
        this.isLoading = true
        if (!(this.$store.state.authUser instanceof Object)) {
          this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
        }
        this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
        let query = {
          'options':
          {
            'fullCount': true
          },
          'count': true,
          'query': 'FOR p in Order FILTER p.order_date != \'\' SORT p.order_date DESC LIMIT 0,5 RETURN p'
        }
        console.log(query)
        let data = await this.$axios.$post(this.$store.state.shopUrl + '/_api/cursor', query)
        console.log(data)
        this.orderData = data['result']
        if (!(data['result'][0] instanceof Object)) {
          this.isEmpty = true
        }
        this.isLoading = false
      } catch (e) {
        this.$toast.open('Could not load data')
        this.isLoading = false
      }
    }
  }
}
</script>
