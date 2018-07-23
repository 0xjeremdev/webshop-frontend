<template>
  <div>
    <br />
    <h1 class="title">Order</h1>
    <datagrid :data="gridData" :columns="gridColumns" :labels="gridLabels" :types="gridTypes" :apiUrl="apiUrl" :type="type" :customSortField="customSortField" :customSortDir="customSortDir"></datagrid>
</div>
</template>

<script>
  import Datagrid from '~/components/ui/Datagrid'
  // import axios from 'axios'

  export default {
    layout: 'admin',
    head () {
      return {
        title: 'ITK Diagnostics - Order',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['order_no', 'from_quote', 'order_date', 'fullName', 'status'],
        gridLabels: ['Order No', 'From Quote', 'Order Date', 'Fullname', 'Status'],
        gridTypes: { 'order_no': 'string', 'from_quote': 'boolean', 'order_date': 'date', 'fullName': 'combined', 'status': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        type: 'order',
        customSortField: 'order_date',
        customSortDir: 'DESC'
      }
    }
  }
</script>

<style>

</style>
