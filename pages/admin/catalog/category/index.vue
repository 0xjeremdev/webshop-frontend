<template>
  <div>
    <br />
    <h1 class="title">Categories</h1>
    <datagrid :data="gridData" :columns="gridColumns" :types="gridTypes" :tableName="tableName" :postUrl="postUrl" :queryOptions="queryOptions" :type="type"></datagrid>
</div>
</template>

<script>
  import Datagrid from '~/components/ui/Datagrid'
  // import axios from 'axios'

  export default {
    layout: 'admin',
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Categories',
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
        postUrl: this.$store.state.productUrl,
        tableName: 'k2p_category',
        type: 'category'
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
