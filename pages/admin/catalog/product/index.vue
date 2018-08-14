<template>
  <div>
    <br />
    <h1 class="title">Products</h1>
    <datagrid :data="gridData" :columns="gridColumns" :labels="gridLabels" :types="gridTypes" :apiUrl="apiUrl" :type="type"></datagrid>
</div>
</template>

<script>
  import Datagrid from '~/components/ui/Datagrid'
  // import axios from 'axios'

  export default {
    layout: 'admin',
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Products',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['vat', 'name', 'Price LabNed'],
        gridLabels: ['LabNed No', 'Name', 'Price LabNed'],
        gridTypes: { 'vat': 'string', 'name': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
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
