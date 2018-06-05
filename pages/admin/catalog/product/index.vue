<template>
  <div>
    <br />
    <h1 class="title">Products</h1>
    <datagrid :data="gridData" :columns="gridColumns" :types="gridTypes" :tableName="tableName" :apiUrl="apiUrl" :queryOptions="queryOptions" :type="type"></datagrid>
</div>
</template>

<script>
  import Datagrid from '~/components/ui/Datagrid'
  // import axios from 'axios'

  export default {
    layout: 'admin',
    head () {
      return {
        title: 'ITK Diagnostics - Products',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['code', 'name'],
        gridTypes: { 'code': 'string', 'name': 'string' },
        gridData: [],
        queryOptions: {'options': {'fullCount': true}, 'count': true}, // these are the extra options you can give
        apiUrl: this.$store.state.apiUrl,
        tableName: 'k2p_product',
        type: 'product'
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
