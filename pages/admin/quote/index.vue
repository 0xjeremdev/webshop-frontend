<template>
  <div>
    <br />
    <h1 class="title">Quote</h1>
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
        title: 'LabNed.com - Exploring Possibilities - Quotes',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['order_no', 'quote_date', 'fullName', 'status'],
        gridLabels: ['Order No', 'Quote Date', 'Fullname', 'Status'],
        gridTypes: { 'order_no': 'string', 'quote_date': 'date', 'fullName': 'combined', 'status': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        type: 'quote',
        customSortField: 'quote_date',
        customSortDir: 'DESC'
      }
    }
  }
</script>

<style>

</style>
