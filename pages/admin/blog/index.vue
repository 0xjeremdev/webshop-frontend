<template>
  <div>
    <br />
    <h1 class="title">Blogs</h1>
    <datagrid :data="gridData" :columns="gridColumns" :types="gridTypes" :tableName="tableName" :postUrl="postUrl" :queryOptions="queryOptions" :type="type" :customSortField="customSortField"></datagrid>
</div>
</template>

<script>
  import Datagrid from '~/components/ui/Datagrid'
  // import axios from 'axios'

  export default {
    layout: 'admin',
    head () {
      return {
        title: 'ITK Diagnostics - Categories',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['title', 'author'],
        gridTypes: { 'title': 'string', 'author': 'string' },
        gridData: [],
        queryOptions: {'options': {'fullCount': true}, 'count': true}, // these are the extra options you can give
        postUrl: this.$store.state.shopUrl,
        tableName: 'Blog',
        type: 'blog',
        customSortField: 'title'
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
