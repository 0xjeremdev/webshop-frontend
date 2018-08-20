<template>
  <div>
    <br />
    <h1 class="title">CMS</h1>
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
        title: 'LabNed.com - Exploring Possibilities - CMS',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['title', 'mysort', 'section', 'active'],
        gridLabels: ['Title', 'Sort', 'Section', 'Active'],
        gridTypes: { 'title': 'string', 'mysort': 'string', 'section': 'string', 'active': 'boolean' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        tableName: 'Page',
        type: 'page',
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
