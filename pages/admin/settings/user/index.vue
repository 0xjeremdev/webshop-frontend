<template>
  <div>
    <br />
    <h1 class="title">Users</h1>
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
        title: 'LabNed.com - Exploring Possibilities - Users',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['lastname', 'firstname', 'company', 'mobile', 'email'],
        gridLabels: ['Lastname', 'Firstname', 'Company', 'Mobile', 'Email'],
        gridTypes: { 'lastname': 'string', 'firstname': 'string', 'company': 'string', 'phone': 'string', 'mobile': 'string', 'email': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        tableName: 'User',
        type: 'user',
        customSortField: 'lastname'
      }
    }
  }
</script>

<style>

</style>
