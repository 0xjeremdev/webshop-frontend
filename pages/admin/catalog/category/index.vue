<template>
  <div>
    <h1>Categorien</h1>
    <datagrid :data="gridData" :columns="gridColumns" :query="query" :queryOptions="queryOptions"></datagrid>
</div>
</template>

<script>
  import Datagrid from '~/components/Datagrid'
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
        gridData: [],
        query: { 'firstPart': 'FOR c in k2p_category', 'lastPart': 'RETURN c' }, // quey FIRST PART and LAST PART not necessarily
        queryOptions: {'options': {'fullCount': true}, 'count': true} // these are the extra options you can give
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
