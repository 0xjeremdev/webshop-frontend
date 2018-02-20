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
              <button class="button is-primary" @click="newProduct">Nieuw</button>
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
          <a class="button is-success" @click="editProduct(data.row)"><b-icon icon="pencil" /></a>
          <a class="button is-danger" @click="deleteProduct(data.row)"><b-icon icon="delete" /></a>
        </b-table-column>
        <b-table-column v-for="key in columns"  v-bind:data="key"
           v-bind:key="key.text" :field="key" :label="key|capitalize" sortable width="150">
            {{ data.row.basic[key] }}
        </b-table-column>
      </template>
      <template slot="footer">
        <b-select class="" placeholder="Select an Action" @input="onActionChange" rounded>
          <option value="deleteSelected">Selectie Verwijderen</option>
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
      query: Object,
      queryOptions: Object
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
        loadMessage: 'Wachten op data om te laden'
      }
    },
    async mounted () {
      await this.loadAsyncData()
    },
    methods: {
      newProduct: function () {
        this.$router.push(this.$router.currentRoute.path + '/newproduct')
      },
      editProduct: function (row) {
        this.$router.push(this.$router.currentRoute.path + '/' + row['code'])
        // console.log(this.$router.currentRoute.path)
      },
      deleteProduct: function (row) {
        this.$dialog.confirm({
          title: 'Verwijder product',
          message: 'Weet u zeker dat u het product wilt <b>verwijderen</b>? Deze actie kan niet worden ongedaan',
          confirmText: 'Verwijder Product',
          cancelText: 'Annuleren',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.doDelete(false) // this.$toast.open('Account deleted!')
        })
        // console.log(row['code'])
      },
      doDelete: function (withCheckbox) {
        try {
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
          }
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')

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
            executedQuery['query'] = this.query.firstPart + searchFilter + ' SORT ' + 'p.basic.' + this.sortField + ' ' + this.sortOrder + ' LIMIT ' + (this.currentPage - 1) + ', ' + this.perPage + ' ' + this.query.lastPart
            console.log(executedQuery)
            let data = await this.$axios.$post('http://localhost:8529/_db/key2publish/_api/cursor', executedQuery)
            console.log(data)
            if (data['result'] instanceof Array) {
              this.data = data['result']
              this.total = data['extra']['stats']['fullCount']
              this.loading = false
            } else {
              this.data = []
              this.loadMessage = 'Kon geen data vinden'
              this.loading = false
            }
          }
        } catch (e) {
          this.data = []
          this.loading = false
          this.loadMessage = 'Kon geen data laden'
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
            this.$dialog.confirm({
              title: 'Verwijder producten',
              message: 'Weet u zeker dat u de producten wilt <b>verwijderen</b>? Deze actie kan niet worden ongedaan',
              confirmText: 'Verwijder Producten',
              cancelText: 'Annuleren',
              type: 'is-danger',
              hasIcon: true,
              onConfirm: () => this.doDelete(true) // this.$toast.open('Account deleted!')
            })
            break
          case 'addNew':
            this.$router.push(this.$router.currentRoute.path + '/new')
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
