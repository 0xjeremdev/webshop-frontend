<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="quotes"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Quotes</h1>
          <DataGrid :data="gridData" :columns="gridColumns" :labels="gridLabels" :types="gridTypes" :apiUrl="apiUrl" :type="type" :customSortField="customSortField"></DataGrid>
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
        gridColumns: ['order_no', 'from_quote', 'order_date', 'quote_date', 'status'],
        gridLabels: ['OrderNo', 'From Quote', 'Order Date', 'Quote Date', 'Status'],
        gridTypes: { 'order_no': 'string', 'from_quote': 'string', 'order_date': 'date', 'quote_date': 'date', 'status': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        type: 'quote',
        customSortField: 'mysort'
      }
    }
  }
</script>
