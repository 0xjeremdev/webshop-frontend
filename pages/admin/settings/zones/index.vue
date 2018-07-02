<template>
  <div>
    <br />
    <h1 class="title">Users</h1>
    <datagrid :data="gridData" :columns="gridColumns" :labels="gridLabels" :types="gridTypes" :tableName="tableName" :apiUrl="apiUrl" :type="type" :customSortField="customSortField"></datagrid>
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
        gridColumns: ['zoneName', 'zoneDescription', 'price', 'mysort'],
        gridLabels: ['Zone Name', 'Description', 'Price', 'Sort'],
        gridTypes: { 'zoneName': 'string', 'zoneDescription': 'string', 'price': 'string', 'mysort': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        tableName: 'Zones',
        type: 'zones',
        customSortField: 'mysort'
      }
    }
  }
</script>

<style>

</style>
