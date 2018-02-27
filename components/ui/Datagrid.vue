<template>
  <div>
    <div id="SearchTable">
      <b-table :data="testData"
        default-sort="name"
        :checked-rows.sync="searchCheckedRows"
        checkable>
        <template slot-scope="testData">
          <b-table-column class="action" label="test" width="100">
            <b-field>
              <b-tooltip :label="'Add new ' + type" type="is-dark" animated>
                <button class="button is-primary" @click="newProduct">New</button>
              </b-tooltip>
            </b-field>
          </b-table-column>
          <b-table-column v-for="key in columns" v-bind:data="key"
             v-bind:key="key.text" :label="key" width="150" class="searchfield">
            <b-field>
                <b-input @input="onSearch" type="search"
                   icon="magnify"
                   v-model="searches[key]"
                   :placeholder="key" rounded>
               </b-input>
            </b-field>
          </b-table-column>
        </template>
      </b-table>
    </div>
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
          <b-tooltip :label="'Edit ' + type" type="is-dark" animated>
            <a class="button is-success" @click="editProduct(data.row)"><b-icon icon="pencil" /></a>
          </b-tooltip>
          <b-tooltip :label="'Delete ' + type" type="is-dark" animated>
            <a class="button is-danger" @click="deleteProduct(data.row)"><b-icon icon="delete" /></a>
          </b-tooltip>
        </b-table-column>
        <b-table-column v-for="key in columns"  v-bind:data="key"
           v-bind:key="key.text" :field="key" :label="key|capitalize" sortable width="150">
            <span v-if="data.row.hasOwnProperty(key)">{{ data.row[key] }}</span>
            <span v-else-if="data.row.hasOwnProperty('basic')">{{ data.row.basic[key] }}</span>
        </b-table-column>
      </template>
      <template slot="footer">
        <b-select class="" placeholder="Select an Action" @input="onActionChange" rounded>
          <option value="deleteSelected">Delete Selected</option>
          <option value="addNew">Add New</option>
        </b-select>
      </template>
      <template slot="bottom-left">
        <div align="center" valign="middle">
          <b-select class="" v-model="perPage" :disabled="!isPaginated" @input="onPageChange" rounded>
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
            <p>{{ loadMessage }}</p>
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
      queryOptions: Object,
      postUrl: String,
      tableName: String,
      type: String,
      customSortField: String
    },
    data: function () {
      return {
        data: [],
        searches: {},
        isPaginated: true,
        isPaginationSimple: false,
        defaultSortDirection: 'asc',
        currentPage: 1,
        perPage: 5,
        checkedRows: [],
        searchCheckedRows: [], // only here to align search with grid accordingly
        isEmpty: false,
        total: 0,
        loading: true,
        sortField: 'code',
        sortOrder: 'asc',
        testData: [ { name: 'test' } ],
        loadMessage: 'Waiting for data to load',
        startValue: 'basic'
      }
    },
    async mounted () {
      await this.loadAsyncData()
    },
    methods: {
      newProduct: function () {
        this.$router.push(this.$router.currentRoute.path + '/new')
      },
      editProduct: function (row) {
        this.$router.push(this.$router.currentRoute.path + '/' + row['_key'])
        // console.log(this.$router.currentRoute.path)
      },
      deleteProduct: function (row) {
        this.$dialog.confirm({
          title: 'Verwijder ' + this.type,
          message: 'Weet u zeker dat u het product wilt <b>verwijderen</b>? Deze actie kan niet worden ongedaan',
          confirmText: 'Verwijder ' + this.type,
          cancelText: 'Annuleren',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.doDelete(false, row)
        })
      },
      async doDelete (withCheckbox, row) {
        try {
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
          }
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
          let codes = '['
          let count = 0
          if (withCheckbox) {
            for (var prod in this.checkedRows) {
              if (count !== 0) { codes += ', ' }
              codes += '\'' + this.checkedRows[prod]._key + '\''
              count++
            }
            codes += ']'
          }
          let query
          if (withCheckbox) {
            query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p IN ' + this.tableName + ' FILTER p._key IN ' + codes + ' REMOVE { _key: p._key } IN ' + this.tableName }
          } else {
            query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p IN ' + this.tableName + ' FILTER p._key == @code REMOVE { _key: p._key } IN ' + this.tableName + ' OPTIONS { waitForSync: true }', bindVars: { 'code': row.basic.code } }
          }
          console.log(query)
          await this.$axios.$post(this.postUrl + '/_api/cursor', query)
          await this.loadAsyncData()
          this.$toast.open('Deleted product')
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not delete product')
        }
      },
      /*
       * Load Data Async
       */
      async loadAsyncData () {
        try {
          if (this.params !== '') {
            this.loading = true
            if (this.customSortField !== '') {
              this.sortField = this.customSortField
              this.startValue = ''
            }
            if (!(this.$store.state.authUser instanceof Object)) {
              this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
            }
            this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')

            let searchFilter = ''
            for (let search in this.searches) {
              if (searchFilter !== '') { searchFilter += ' && ' }
              searchFilter += 'p.basic.' + search + ' LIKE \'' + this.searches[search] + '%\''
            }
            if (searchFilter !== '') { searchFilter = ' FILTER ' + searchFilter }

            let executedQuery = this.queryOptions
            let dbIdentifier = 'p.'
            if (this.type === 'product' || this.type === 'category') { dbIdentifier = 'p.basic.' }
            executedQuery['query'] = 'FOR p IN ' + this.tableName + searchFilter + ' SORT ' + dbIdentifier + this.sortField + ' ' + this.sortOrder + ' LIMIT ' + (this.currentPage - 1) + ', ' + this.perPage + ' RETURN p'
            console.log(executedQuery)
            let data = await this.$axios.$post(this.postUrl + '/_api/cursor', executedQuery)
            console.log(data)
            if (data['result'][0] instanceof Object) {
              this.data = data['result']
              this.total = data['extra']['stats']['fullCount']
              this.loading = false
            } else {
              this.data = []
              this.loadMessage = 'No Search results found'
              this.loading = false
            }
          }
        } catch (e) {
          this.data = []
          this.loading = false
          this.loadMessage = 'Could not load any data, make sure there is any data'
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
      },

      async onSearch () {
        // console.log('jomhier')
        await this.loadAsyncData()
      },
      onActionChange: function (action) {
        switch (action) {
          case 'deleteSelected':
            if (this.checkedRows.length > 1) {
              this.$dialog.confirm({
                title: 'Verwijder producten',
                message: 'Weet u zeker dat u de producten wilt <b>verwijderen</b>? Deze actie kan niet worden ongedaan',
                confirmText: 'Verwijder Producten',
                cancelText: 'Annuleren',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => this.doDelete(true)
              })
            } else {
              this.$toast.open('No Data Selected')
            }
            break
          case 'addNew':
            this.newProduct()
            break
        }
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
