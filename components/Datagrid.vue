<template>
  <div>
    <b-table
      :data="isEmpty ? [] : data"
      :loading="loading"
      paginated
      backend-pagination
      :total="total"
      :per-page="perPage"
      @page-change="onPageChange"

      backend-sorting
      :default-sort-direction="defaultSortDirection"
      :default-sort="[sortField, sortOrder]"
      @sort="onSort"
      :checked-rows.sync="checkedRows"
      checkable
      hoverable>
      <template slot-scope="data">
        <b-table-column label="Action" align="center" valign="middle" width="100">
          <a class="button is-success" @click="editProduct(data.row)"><b-icon icon="pencil" /></a>
          <a class="button is-danger" @click="deleteProduct(data.row)"><b-icon icon="delete" /></a>
        </b-table-column>
        <b-table-column v-for="key in columns"  v-bind:data="key"
           v-bind:key="key.text" :field="key" :label="key|capitalize" sortable width="150">
            {{ data.row.basic[key] }}
        </b-table-column>
      </template>
      <template slot="bottom-left">
        <div align="center" valign="middle">
          <b-select class="" v-model="perPage" :disabled="!isPaginated" @input="onPageChange">
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </b-select>
        </div>
      </template>
      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                icon="emoticon-sad"
                size="is-large">
              </b-icon>
            </p>
            <p>Nothing here.</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  export default {
    template: '#grid-template',
    props: {
      columns: Array,
      filterKey: Object,
      query: Object,
      queryOptions: Object
    },
    data: function () {
      return {
        data: [],
        isPaginated: true,
        isPaginationSimple: false,
        defaultSortDirection: 'asc',
        currentPage: 1,
        perPage: 5,
        checkedRows: [],
        isEmpty: false,
        total: 0,
        loading: false,
        sortField: 'code',
        sortOrder: 'asc'
      }
    },
    async mounted () {
      await this.loadAsyncData()
    },
    methods: {
      editProduct: function (row) {
        console.log(row)
      },
      deleteProduct: function (row) {
        console.log(row)
      },
      /*
       * Load Data Async
       */
      async loadAsyncData () {
        try {
          if (this.params !== '') {
            if (!(this.$store.state.authUser instanceof Object)) {
              this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
            }
            this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
            console.log('store credentials:')
            console.log(this.$store.state.authUser)
            let executedQuery = this.queryOptions // {'options': {'fullCount': true}, 'query': 'FOR c in k2p_product LIMIT 10 return c', 'count': true}
            executedQuery['query'] = this.query.firstPart + ' LIMIT ' + (this.currentPage - 1) + ', ' + this.perPage + ' ' + this.query.lastPart
            // query.query
            console.log(executedQuery)
            // const { data } = await this.$axios.post('http://localhost:8529/_db/key2publish/_api/cursor', { query })
            let data = await this.$axios.$post('http://localhost:8529/_db/key2publish/_api/cursor', executedQuery)
            console.log(data)
            if (data['result'] instanceof Array) {
              this.data = data['result']
              this.total = data['extra']['stats']['fullCount']
            } else {
              this.data = []
            }
          }
        } catch (e) {
          console.log(e)
        }
      },
      /*
       * Handle page-change event
       */
      async onPageChange (page) {
        this.currentPage = page
        await this.loadAsyncData()
      },
      /*
       * Handle sort event
       */
      async onSort (field, order) {
        this.sortField = field
        this.sortOrder = order
        await this.loadAsyncData()
      }
    },
    computed: {
      filteredData: function () {
        // var sortKey = this.sortKey
        console.log(this.filterKey)
        var filterKeys = this.filterKey

        // var order = this.sortOrders[sortKey] || 1
        var data = this.data
        for (var filterKey in filterKeys) {
          console.log(filterKey)
          if (filterKeys[filterKey] !== '') {
            data = data.filter(function (row) {
              return Object.keys(row).some(function (key) {
                return String(row[key]).toLowerCase().indexOf(filterKeys[filterKey]) > -1
              })
            })
          }
        }
        return data
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  }
</script>
