<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="delivery"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Delivery Address</h1>
          <DataGrid :data="gridData" :columns="gridColumns" :labels="gridLabels" :types="gridTypes" :apiUrl="apiUrl" :type="type" :customSortField="customSortField"></DataGrid>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import accountMenu from '~/components/ui/accountMenu.vue'
  import DataGrid from '~/components/ui/DatagridFrontend.vue'

  export default {
    components: { accountMenu, DataGrid },
    data () {
      return {
        gridColumns: ['name', 'street', 'houseno', 'postcode', 'city', 'country', 'company', 'department'],
        gridLabels: ['Name', 'Street', 'No.', 'Postal Code', 'City', 'Country', 'Company', 'Department'],
        gridTypes: { 'name': 'string', 'street': 'string', 'houseno': 'string', 'postcode': 'string', 'city': 'string', 'country': 'string', 'mysort': 'string', 'company': 'string', 'department': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        type: 'address',
        customSortField: 'mysort'
      }
    }
  }
</script>
