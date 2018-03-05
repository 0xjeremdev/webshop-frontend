<template>
  <div>
    <h1>Customers</h1>
    <datagrid :data="gridData" :columns="gridColumns" :tableName="tableName" :postUrl="postUrl" :queryOptions="queryOptions" :type="type" :customSortField="customSortField"></datagrid>
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
        gridData: [],
        queryOptions: {'options': {'fullCount': true}, 'count': true}, // these are the extra options you can give
        postUrl: this.$store.state.shopUrl,
        tableName: 'Customer',
        type: 'customer',
        customSortField: 'lastname'
      }
    }
  }
</script>

<style>

</style>
