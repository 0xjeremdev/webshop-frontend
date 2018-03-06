<template>
  <div>
    <br />
    <h1 class="title">Quotes</h1>
    <DatagridForOrder :data="gridData"
      :columns="gridColumns"
      :types="gridTypes"
      :tableName="tableName"
      :postUrl="postUrl"
      :queryOptions="queryOptions"
      :type="type"
      :customSortField="customSortField"
      :customFilter="customFilter"
      :customReturn="customReturn"></DatagridForOrder>
  </div>
</template>

<script>
  import DatagridForOrder from '~/components/ui/DatagridForOrder'
  // import axios from 'axios'

  export default {
    layout: 'admin',
    head () {
      return {
        title: 'ITK Diagnostics - Orders',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { DatagridForOrder },
    data () {
      return {
        gridColumns: ['order_no', 'is_quote', 'quote_date', 'fullName'],
        gridTypes: { 'order_no': 'string', 'is_quote': 'boolean', 'quote_date': 'date', 'fullName': 'combined' },
        // gridCombined: { 'fullName': 'CONCAT()' }
        gridData: [],
        queryOptions: {'options': {'fullCount': true}, 'count': true}, // these are the extra options you can give
        postUrl: this.$store.state.shopUrl,
        tableName: 'Order',
        type: 'order',
        customSortField: 'order_no',
        customFilter: 'p.is_quote == true AND p.quote_date != \'\' AND p.order_date == \'\'',
        customReturn: ' RETURN { \'order_no\': p.order_no, \'is_quote\': p.is_quote, \'quote_date\': p.quote_date, \'fullName\': CONCAT(p.customer.firstname, " ", p.customer.lastname) }'
      }
    }
  }
</script>

<style>

</style>
