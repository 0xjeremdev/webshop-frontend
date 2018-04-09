<template>
  <section>
    <b-collapse class="card" v-for="( val, key ) in searchColumns" :key="key" :open="(val === 'Product Type')">
        <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">
                {{ val }} [{{getFilters[val].length}}]
            </p>
            <a class="card-header-icon">
                <b-icon
                    :icon="props.open ? 'menu-down' : 'menu-up'">
                </b-icon>
            </a>
        </div>
        <div class="card-content">
            <div class="content">
              <b-field v-for="( svVal, svKey ) in getFilters[val]" :key="svKey">
                <b-checkbox :value="getSearchFilters(val, svKey, svVal)" @input="setSearch(val, svKey, svVal)">{{ svVal[val] }}</b-checkbox>
              </b-field>
            </div>
        </div>
    </b-collapse>
    <b-loading :is-full-page="true" :active.sync="isFetching" :canCancel="true"></b-loading>
  </section>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    data () {
      return {
        searchColumns: [ 'Product Type', 'Reactivity', 'Host', 'Clone', 'Application', 'Conjugate' ],
        // searchValues: { 'Product Type': [], 'Reactivity': [], 'Host': [], 'Clone': [], 'Application': [], Conjugate: [] },
        isFetching: false
      }
    },
    created () {
      this.isFetching = true
      this.getData('Product Type')
      this.getData('Reactivity')
      this.getData('Host')
      this.getData('Clone')
      this.getData('Application')
      this.getData('Conjugate')
      if (!(this.$store.state.product.searchFilters instanceof Object)) {
        this.$store.commit('product/SET_SEARCH_FILTERS', (typeof (Cookies.getJSON('key2publish').product) !== 'undefined') ? Cookies.getJSON('key2publish').product.searchFilters : '')
      }
      this.isFetching = false
    },
    computed: {
      getFilters () {
        return this.$store.state.product.filters
      }
    },
    methods: {
      getSearchFilters (type, key, value) {
        return (typeof this.$store.state.product.searchFilters.product !== 'undefined') ? (typeof this.$store.state.product.searchFilters.product[type] !== 'undefined') ? (typeof this.$store.state.product.searchFilters.product[type][key] !== 'undefined') ? (typeof this.$store.state.product.searchFilters.product[type][key] !== 'undefined') ? this.$store.state.product.searchFilters.product[type][key]['checked'] : false : false : false : false
      },
      async setSearch (type, key, value) {
        console.log(type)
        console.log(key)
        console.log(value[type])
        let checked = (typeof this.$store.state.product.searchFilters.product !== 'undefined') ? (typeof this.$store.state.product.searchFilters.product[type] !== 'undefined') ? (typeof this.$store.state.product.searchFilters.product[type][key] !== 'undefined') ? (typeof this.$store.state.product.searchFilters.product[type][key] !== 'undefined') ? this.$store.state.product.searchFilters.product[type][key]['checked'] : false : false : false : false
        let myVal = []
        myVal[type] = []
        myVal[type][key] = {}
        myVal[type][key]['value'] = value[type]
        myVal[type][key]['checked'] = !checked
        this.$store.commit('product/SET_SEARCH_FILTERS', myVal)
      },
      async getData (type) {
        try {
          this.isFetching = true
          let params = this.$route.query
          let field = type
          await this.$store.dispatch('product/getFilters', {
            field: field,
            params: params
          },
          {
            root: true
          })
          this.isFetching = false
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not load data')
          this.isFetching = false
        }
      }
    }
  }
</script>
