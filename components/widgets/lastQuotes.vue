<template>
  <div id="lastQuotes">
    <p class="subtitle">Last 5 Quotes</p>
    <b-table :data="isEmpty ? [] : orderData"
      hoverable>
      <template slot-scope="orderData">
        <b-table-column field="order_no" label="Order No">
            {{ orderData.row.order_no }}
        </b-table-column>

        <b-table-column field="items" label="Product Amount" numeric>
            {{ orderData.row.items.length }}
        </b-table-column>

        <b-table-column field="creation_date" label="Quote date" centered>
            <span class="tag is-success">
                {{ new Date(orderData.row.quote_date).toLocaleDateString() }}
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
// import Cookies from 'js-cookie'

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
        let data = await this.$axios.$get(this.$store.state.apiUrl + '/admin/widgets/lastquotes', { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
        console.log(data)
        if (data.status === 200) {
          this.orderData = data['result']['_result']
          if (!(data['result']['_result'][0] instanceof Object)) {
            this.isEmpty = true
          }
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
