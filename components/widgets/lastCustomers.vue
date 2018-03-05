<template>
  <div id="lastCustomers">
    <p class="subtitle">Last 5 Customers</p>
    <b-table :data="customerData"
      hoverable>
      <template slot-scope="customerData">
        <b-table-column field="name" label="Name">
            {{ customerData.row.firstname }} {{ customerData.row.lastname }}
        </b-table-column>

        <b-table-column field="company" label="Company">
            {{ customerData.row.company }}
        </b-table-column>

        <b-table-column field="creation_date" label="Signed up" centered>
            <span class="tag is-success">
                {{ new Date(customerData.row.creation_date).toLocaleDateString() }}
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
  template: '#last-customer',
  data () {
    return {
      isLoading: false,
      customerData: []
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
          'query': 'FOR p in Customer SORT p.creation_date DESC LIMIT 0,5 RETURN p'
        }
        console.log(query)
        let data = await this.$axios.$post(this.$store.state.shopUrl + '/_api/cursor', query)
        console.log(data)
        this.customerData = data['result']
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
