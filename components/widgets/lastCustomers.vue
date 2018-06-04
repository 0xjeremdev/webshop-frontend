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
// import Cookies from 'js-cookie'

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
        // get user token
        let data = await this.$axios.$get(this.$store.state.apiUrl + '/admin/widgets/lastcustomers', '')
        console.log(data['result'])
        this.customerData = data['result']['_result']
        if (!(data['result']['_result'][0] instanceof Object)) {
          this.isEmpty = true
        }
        this.isLoading = false
      } catch (e) {
        console.log(e)
        this.$toast.open('Could not load data')
        this.isLoading = false
      }
    }
  }
}
</script>
