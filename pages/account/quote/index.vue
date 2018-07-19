<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="quotes"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Quotes</h1>
          <h2 class="subtitle">Quotes Received</h2>
          <DataGrid :data="gridData" :columns="gridColumns" :labels="gridLabels" :types="gridTypes" :apiUrl="apiUrl" :type="type" :customSortField="customSortField"></DataGrid>
        </div>
      </div>

      <div class="columns">
        <div class="column is-one-quarter">
          
        </div>
        <div class="column">
          <h2 class="subtitle">Quotes Send By You</h2>
          <DataGrid :data="gridData" :columns="gridColumns" :labels="gridLabels" :types="gridTypes" :apiUrl="apiUrl" :type="received_type" :customData="customData" :customSortField="customSortField"></DataGrid>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import accountMenu from '~/components/ui/accountMenu.vue'
  import DataGrid from '~/components/ui/DatagridFrontendOrder.vue'

  export default {
    components: { accountMenu, DataGrid },
    data () {
      return {
        gridColumns: ['order_no', 'order_date', 'quote_date', 'status'],
        gridLabels: ['OrderNo', 'Order Date', 'Quote Date', 'Status'],
        gridTypes: { 'order_no': 'string', 'order_date': 'date', 'quote_date': 'date', 'status': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        type: 'quote',
        customSortField: 'quote_date',
        received_type: 'quote',
        customData: '&email=' + this.$store.state.order.customer.email
      }
    },
    async asyncData ({ store }) {
      let data = await store.dispatch('account/getAuth')
      if (data.data.result.id !== undefined) {
        const customer = await store.dispatch('account/getCustomer', { id: data.data.result.id })
        store.commit('order/SET_CUSTOMER', customer.data.result._result[0])
      }
    }
  }
</script>
