<template>
  <div>
    <br />
    <h1 class="title">Temperature</h1>
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
        title: 'LabNed.com - Exploring Possibilities - Temperatures',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['temperatureName', 'temperatureDescription', 'price', 'mysort'],
        gridLabels: ['Temperature Name', 'Description', 'Price', 'Sort'],
        gridTypes: { 'temperatureName': 'string', 'temperatureDescription': 'string', 'price': 'string', 'mysort': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        tableName: 'Temperature',
        type: 'temperature',
        customSortField: 'mysort'
      }
    }
  }
</script>

<style>

</style>
