<template>
  <div>
    <h1>Products</h1>
    <div id="SearchTable">
      <b-table :data="testData"
        default-sort="name"
        :checked-rows.sync="checkedRows"
        checkable>
        <template slot-scope="testData">
          <b-table-column class="action" label="test" width="100">
            Search:
          </b-table-column>
          <b-table-column v-for="key in gridColumns" v-bind:data="key"
             v-bind:key="key.text" :label="key" width="150" class="searchfield">
            <b-field>
                <b-input type="search"
                   icon="magnify"
                   v-model="searches[key]"
                   :placeholder="key">
               </b-input>
            </b-field>
        </b-table-column>
        </template>
      </b-table>
    </div>
    <datagrid :data="gridData" :columns="gridColumns" :filter-key="searchQuery" :query="query" :queryOptions="queryOptions"></datagrid>
    <p><button v-on:click="logMethod">Log Search</button></p>
</div>
</template>

<script>
  import Datagrid from '~/components/Datagrid'
  // import axios from 'axios'

  export default {
    layout: 'admin',
    head () {
      return {
        title: 'ITK Diagnostics - Products',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        searches: {},
        gridColumns: ['code', 'name'],
        gridData: [],
        testData: [ { name: 'test' } ],
        checkedRows: [],
        query: { 'firstPart': 'FOR p in k2p_product', 'lastPart': 'RETURN p' }, // quey FIRST PART and LAST PART not necessarily
        queryOptions: {'options': {'fullCount': true}, 'count': true} // these are the extra options you can give
      }
    },
    methods: {
      logMethod: function () {
        // this.searches.test = 'Help'
        console.log(this.searches)
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
