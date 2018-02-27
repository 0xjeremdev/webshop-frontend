<template>
  <div>
    <h1>Orders</h1>
    <datagrid :data="gridData" :columns="gridColumns" :tableName="tableName" :postUrl="postUrl" :queryOptions="queryOptions" :type="type"></datagrid>
</div>
</template>

<script>
  import Datagrid from '~/components/ui/Datagrid'
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
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['order_no', 'fromQuote', 'quoteDate', 'billingaddress', 'deliveryaddress', 'customerid'],
        gridData: [],
        queryOptions: {'options': {'fullCount': true}, 'count': true}, // these are the extra options you can give
        postUrl: this.$store.state.shopUrl,
        tableName: 'Order',
        type: 'order',
        customSortField: 'order_no'
      }
    },
    computed: {
      searchQuery: function () {
        return this.searches
      }
    }
  }
</script>

<style>

</style>
