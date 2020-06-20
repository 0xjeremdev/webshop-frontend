
<template>
  <div>
     <b-alert v-if="showDismissibleAlert"  class="button is-danger" dismissible>Attribute Fields are not selected!</b-alert>
        <template>
          <section>
            <b-field grouped group-multiline>             
              <b-select v-model="attrSelected">
                <option v-for="option in optionsData" v-bind:value="option.value" v-bind:key="option.text">
                {{ option.text }}
              </option>
              </b-select>
              <!-- <span>Selected: {{ attrSelected }}</span>          -->
              <b-select v-model="opSelected">
                <option v-for="option in funcOptions" v-bind:value="option.value" v-bind:key="option.text">
                {{ option.text }}
              </option>
              </b-select>
              <!-- <span>Selected: {{ opSelected }}</span>            -->
              <b-input v-model="message" placeholder="Attribute value"/>
              <!-- <p>Message is: {{ message }}</p> -->
              <button class="button is-primary" v-on:click="search">Get Data</button>&nbsp;&nbsp;             
              <button class="button is-primary" v-on:click="csvExport">Export CSV</button>&nbsp;&nbsp;
              <button class="button is-primary" v-on:click="jsonExport">Export JSON</button>
              
          </b-field>
        </section>
      </template>
    <div id="SearchTable">
      <b-table :data="testData"
        default-sort="name"
        :checked-rows.sync="searchCheckedRows"
        checkable>

        <template slot-scope="testData">
          <b-table-column class="action" label="test">
            <b-tooltip :label="'Add new ' + type" type="is-dark" animated>
              <button class="button is-primary" @click="newProduct">New</button>
            </b-tooltip>
          </b-table-column>
          <b-table-column v-for="(key, index) in columns" v-bind:data="key"
             v-bind:key="key.text" :label="labels[index]" class="searchfield">
            <b-field>
                <b-input type="search"
                   icon="magnify"
                   v-model="searches[key]"
                   :placeholder="labels[index]" rounded>
               </b-input>
            </b-field>
          </b-table-column>
        </template>
      </b-table>
    </div>
    <div id="dataTable">
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
          <b-table-column label="Action" align="center" valign="middle" class="action">
            <b-tooltip :label="'Edit ' + type" type="is-dark" animated>
              <a class="button is-success" @click="editProduct(data.row)"><b-icon icon="pencil" /></a>
            </b-tooltip>
            <b-tooltip :label="'Delete ' + type" type="is-dark" animated>
              <a class="button is-danger" @click="deleteProduct(data.row)"><b-icon icon="delete" /></a>
            </b-tooltip>
          </b-table-column>
          <b-table-column v-for="(key, index) in columns"  v-bind:data="key"
             v-bind:key="key.text" :field="key" :label="labels[index]|capitalize" sortable class="datafield">
              <span v-if="((data.row.hasOwnProperty(key)) && (types[key] === 'string'))">{{ data.row[key] }}</span>
              <span v-else-if="((data.row.hasOwnProperty(key)) && (types[key] === 'int'))">{{ data.row[key] }}</span>
              <span v-else-if="((data.row.hasOwnProperty(key)) && (types[key] === 'combined'))">{{ data.row[key] }}</span>
              <span v-else-if="data.row.hasOwnProperty('basic')">{{ data.row.basic[key] }}</span>
              <span v-else-if="((data.row.hasOwnProperty(key)) && (types[key] === 'date'))" class="tag is-success">{{ new Date(data.row[key]).toLocaleDateString('nl-NL', options ) }}</span>
              <span v-else-if="((data.row.hasOwnProperty(key)) && (types[key] === 'boolean'))"><b-icon :icon="getIcon(data.row[key])"></b-icon></span>
          </b-table-column>
        </template>
        <template slot="footer">
          <b-select v-model="actionChange" class="" placeholder="Select an Action" @input="onActionChange" rounded>
            <option value="deleteSelected">Delete Selected</option>
            <option value="addNew">Add New</option>
          </b-select>
        </template>
        <template slot="bottom-left">
          <div align="center" valign="middle">
            <b-select class="" v-model="perPage" :disabled="!isPaginated" @input="onPageActionChange" rounded>
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
  </div>
</template>

<script>
  // import Cookies from 'js-cookie'
  import lodash from 'lodash'

  export default {
    template: '#grid-template',
    props: {
      columns: Array,
      labels: Array,
      types: Object,
      apiUrl: String,
      type: String,
      customSortField: String,
      customFilter: String
    },
    data: function () {
      return {
        actionChange: null,
        data: [],
        searches: {},
        isPaginated: true,
        isPaginationSimple: false,
        defaultSortDirection: 'asc',
        currentPage: 1,
        perPage: 10,
        checkedRows: [],
        searchCheckedRows: [], // only here to align search with grid accordingly
        isEmpty: false,
        total: 0,
        loading: true,
        sortField: 'code',
        sortOrder: 'asc',
        testData: [ { name: 'test' } ],
        loadMessage: 'Waiting for data to load',
        attrSelected: '',
        opSelected: '',
        message: '',
        optionsData: [{ text: 'Select Attribute Name', value: '', disabled: true }, { text: 'LabNed artikel nummer', value: 'LabNed artikel nummer' }, { text: 'Stam nummer', value: 'Stam nummer' }, { text: 'Applications', value: 'Applications' }],
        funcOptions: [{ text: 'Select Operator', value: '', disabled: true }, { text: '==', value: '==' }, { text: '!=', value: '!=' }, { text: '<=', value: '<=' }, { text: '>=', value: '>=' }],
        startValue: 'basic',
        showDismissibleAlert: false,
        'options': { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }
      }
    },
    watch: {
      searches: {
        deep: true,
        handler: lodash.debounce(function (e) {
          this.loadAsyncData()
        }, 500)
      }
    },
    async mounted () {
      await this.loadAsyncData()
    },
    methods: {
      getIcon (val) {
        if (val) {
          return 'check'
        }
        return 'close'
      },
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
          /* if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
          }
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer') */
          let codes = []
          if (withCheckbox) {
            for (var prod in this.checkedRows) {
              codes.push(this.checkedRows[prod]._key)
            }
          }
          /* let query
          if (withCheckbox) {
            query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p IN ' + this.tableName + ' FILTER p._key IN ' + codes + ' REMOVE { _key: p._key } IN ' + this.tableName }
          } else {
            query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p IN ' + this.tableName + ' FILTER p._key == @key REMOVE { _key: p._key } IN ' + this.tableName + ' OPTIONS { waitForSync: true }', bindVars: { 'key': row._key } }
          } */

          let data
          if (withCheckbox) {
            console.log(this.apiUrl + '/admin/' + this.type + '/delete')
            data = await this.$axios.$post(this.apiUrl + '/admin/' + this.type + '/delete', {id: codes}, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
          } else {
            console.log(this.apiUrl + '/admin/' + this.type + '/' + row._key)
            data = await this.$axios.$delete(this.apiUrl + '/admin/' + this.type + '/' + row._key, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
          }

          console.log(data['_result'])
          await this.loadAsyncData()
          await this.resetAction()
          this.$toast.open('Deleted ' + this.type)
        } catch (e) {
          await this.resetAction()
          console.log(e)
          this.$toast.open('Could not delete ' + this.type)
        }
      },
      /*
       * Load Data Async
       */
      async loadAsyncData () {
        try {
          if (this.params !== '') {
            this.loading = true
            if (this.customSortField !== undefined) {
              this.sortField = this.customSortField
              this.startValue = ''
            }
            /* if (!(this.$store.state.authUser instanceof Object)) {
              this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
            }
            this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer') */

            // let dbIdentifier = 'p.'
            // if (this.type === 'product' || this.type === 'category') { dbIdentifier = 'p.basic.' }

            /* let searchFilter = ''
            for (let search in this.searches) {
              console.log(search)
              if (searchFilter !== '') { searchFilter += ' && ' }
              if (this.types[search] !== 'date') { searchFilter += 'LOWER(' + dbIdentifier + search + ')' + ' LIKE \'' + this.searches[search].toLowerCase() + '%\'' }
              if (this.types[search] === 'date') { searchFilter += 'DATE_FORMAT(' + dbIdentifier + search + ',"%d-%m%-%yyyy") LIKE \'' + this.searches[search] + '%\'' }
            }
            if (this.customFilter !== undefined) {
              searchFilter += ' '
              if (searchFilter !== ' ') {
                searchFilter += 'AND '
              }
              searchFilter += this.customFilter + ' '
            }
            if (searchFilter !== '') { searchFilter = ' FILTER ' + searchFilter }

            let executedQuery = this.queryOptions

            executedQuery['query'] = 'FOR p IN ' + this.tableName + searchFilter + ' SORT ' + dbIdentifier + this.sortField + ' ' + this.sortOrder + ' LIMIT ' + (this.perPage * (this.currentPage - 1)) + ', ' + this.perPage + ' RETURN p'
            console.log(executedQuery) */
            let queryString = ''
            queryString = (this.type.includes('?')) ? '&' : '?'
            if (this.perPage !== undefined || this.perPage.isInteger()) queryString += 'perPage=' + this.perPage
            if (this.currentPage !== undefined || this.currentPage.isInteger()) queryString += '&currentPage=' + this.currentPage
            if (this.sortField !== undefined || this.sortField !== '') queryString += '&mysort=' + this.sortField
            if (this.sortOrder !== undefined || this.sortOrder !== '') queryString += '&sortOrder=' + this.sortOrder
            if (this.attrSelected !== undefined || this.attrSelected !== '') queryString += '&attr=' + this.attrSelected
            if (this.opSelected !== undefined || this.opSelected !== '') queryString += '&op=' + this.opSelected
            if (this.message !== undefined || this.message !== '') queryString += '&val=' + this.message

            let searchFilter = ''
            for (let search in this.searches) {
              if (search !== 'undefined' && this.searches[search] !== '') searchFilter += '&' + search + '=' + this.searches[search]
            }
            if (this.customFilter !== undefined) {
              searchFilter += this.customFilter
            }
            queryString += searchFilter

            console.log(this.apiUrl + '/' + this.type + queryString)
            let data = await this.$axios.$get(this.apiUrl + '/admin/' + this.type + queryString, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            console.log(data)
            if (data['result']['_result'][0] instanceof Object) {
              this.data = data['result']['_result']
              this.total = data['result']['extra']['stats']['fullCount']
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

      async search () {
        if (this.attrSelected !== '' && this.opSelected !== '' && this.message !== '') { await this.loadAsyncData() } else { this.showDismissibleAlert = true }
      },
      /*
       * Handle page-change event
       */
      async onPageActionChange (page) {
        await this.loadAsyncData()
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
      async onActionChange (action) {
        switch (action) {
          case 'deleteSelected':
            if (this.checkedRows.length > 0) {
              this.$dialog.confirm({
                title: 'Verwijder ' + this.type,
                message: 'Weet u zeker dat u de ' + this.type + ' wilt <b>verwijderen</b>? Deze actie kan niet worden ongedaan',
                confirmText: 'Verwijder ' + this.type,
                cancelText: 'Annuleren',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => this.doDelete(true),
                onCancel: () => this.resetAction()
              })
            } else {
              await this.resetAction()
              this.$toast.open('No Data Selected')
            }
            break
          case 'addNew':
            this.newProduct()
            break
        }
      },
      async resetAction () {
        this.checkedRows = []
        this.actionChange = null
      },
      csvExport: function () {
        try {
          if (this.attrSelected !== '' && this.opSelected !== '' && this.message !== '') {
            let queryString = ''
            queryString = (this.type.includes('?')) ? '&' : '?'
            if (this.perPage !== undefined || this.perPage.isInteger()) queryString += 'perPage=' + 0
            if (this.currentPage !== undefined || this.currentPage.isInteger()) queryString += '&currentPage=' + this.currentPage
            if (this.sortField !== undefined || this.sortField !== '') queryString += '&mysort=' + this.sortField
            if (this.sortOrder !== undefined || this.sortOrder !== '') queryString += '&sortOrder=' + this.sortOrder
            if (this.attrSelected !== undefined || this.attrSelected !== '') queryString += '&attr=' + this.attrSelected
            if (this.opSelected !== undefined || this.opSelected !== '') queryString += '&op=' + this.opSelected
            if (this.message !== undefined || this.message !== '') queryString += '&val=' + this.message

            let searchFilter = ''
            for (let search in this.searches) {
              if (search !== 'undefined' && this.searches[search] !== '') searchFilter += '&' + search + '=' + this.searches[search]
            }
            if (this.customFilter !== undefined) {
              searchFilter += this.customFilter
            }
            queryString += searchFilter

            console.log(this.apiUrl + '/' + this.type + queryString)
            let data = this.$axios.$get(this.apiUrl + '/admin/' + this.type + queryString, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            console.log(data)
            if (data['result']['_result'][0] instanceof Object) {
              this.data = data['result']['_result']
              let csvContent = 'data:text/csv;charset=utf-8,'
              csvContent += [
                Object.keys(this.data[0]).join(','),
                ...this.data.map(item => Object.values(item).join(','))
              ]
                .join('\n')
                .replace(/(^\[)|(\]$)/gm, '')

              const csvdata = encodeURI(csvContent)
              const link = document.createElement('a')
              link.setAttribute('href', csvdata)
              link.setAttribute('download', 'export.csv')
              link.click()
            } else {
              this.data = []
            }
          } else { this.showDismissibleAlert = true }
        } catch (e) {
          this.data = []
          console.log(e)
        }
      },
      jsonExport: function () {
        try {
          if (this.attrSelected !== '' && this.opSelected !== '' && this.message !== '') {
            let queryString = ''
            queryString = (this.type.includes('?')) ? '&' : '?'
            if (this.perPage !== undefined || this.perPage.isInteger()) queryString += 'perPage=' + 0
            if (this.currentPage !== undefined || this.currentPage.isInteger()) queryString += '&currentPage=' + this.currentPage
            if (this.sortField !== undefined || this.sortField !== '') queryString += '&mysort=' + this.sortField
            if (this.sortOrder !== undefined || this.sortOrder !== '') queryString += '&sortOrder=' + this.sortOrder
            if (this.attrSelected !== undefined || this.attrSelected !== '') queryString += '&attr=' + this.attrSelected
            if (this.opSelected !== undefined || this.opSelected !== '') queryString += '&op=' + this.opSelected
            if (this.message !== undefined || this.message !== '') queryString += '&val=' + this.message

            let searchFilter = ''
            for (let search in this.searches) {
              if (search !== 'undefined' && this.searches[search] !== '') searchFilter += '&' + search + '=' + this.searches[search]
            }
            if (this.customFilter !== undefined) {
              searchFilter += this.customFilter
            }
            queryString += searchFilter

            console.log(this.apiUrl + '/' + this.type + queryString)
            let data = this.$axios.$get(this.apiUrl + '/admin/' + this.type + queryString, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            console.log(data)
            if (data['result']['_result'][0] instanceof Object) {
              this.data = data['result']['_result']
              let jsonContent = 'data:json;charset=utf-8,'
              jsonContent += JSON.stringify(this.data)
              const jsondata = encodeURI(jsonContent)
              const link = document.createElement('a')
              link.setAttribute('href', jsondata)
              link.setAttribute('download', 'export.json')
              link.click()
            } else {
              this.data = []
            }
          } else { this.showDismissibleAlert = true }
        } catch (e) {
          this.data = []
          console.log(e)
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
