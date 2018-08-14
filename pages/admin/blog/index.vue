<template>
  <div>
    <br />
    <h1 class="title">Blogs</h1>
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
        title: 'LabNed.com - Exploring Possibilities - Blog',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['title', 'active'],
        gridLabels: ['Title', 'Active'],
        gridTypes: { 'title': 'string', 'active': 'boolean' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
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
