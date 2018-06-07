<template>
  <div>
    <br />
    <h1 class="title">Customers</h1>
    <datagrid :data="gridData" :columns="gridColumns" :labels="gridLabels" :types="gridTypes" :apiUrl="apiUrl" :type="type" :customSortField="customSortField"></datagrid>
</div>
</template>

<script>
  import Datagrid from '~/components/ui/Datagrid'
  // import axios from 'axios'

  export default {
    layout: 'admin',
    head () {
      return {
        title: 'ITK Diagnostics - Customers',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['lastname', 'firstname', 'company', 'phone', 'mobile', 'email'],
        gridLabels: ['Lastname', 'Firstname', 'Company', 'Phone', 'Mobile', 'Email'],
        gridTypes: { 'lastname': 'string', 'firstname': 'string', 'company': 'string', 'phone': 'string', 'mobile': 'string', 'email': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        type: 'customer',
        customSortField: 'lastname'
      }
    }
  }
</script>

<style>

</style>
