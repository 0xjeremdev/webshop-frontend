<template>
  <section id="search">
    <b-field>
      <b-autocomplete
        v-model.lazy="productName"
        icon="magnify"
        :data="productData"
        placeholder="Search for products ... e.g. CD3"
        field="name"
        :loading="isFetching"
        @select="option => selectProduct(option)"
        v-on:keyup.13.native="doSubmit()"
        >
        <template slot="empty">{{ message }}</template>
      </b-autocomplete>
    </b-field>
    <hr class="navbar-divider my_div">
  </section>
</template>

<script>
  import Cookies from 'js-cookie'
  import _ from 'lodash'

  export default {
    data () {
      return {
        productName: '',
        productData: [],
        isFetching: false,
        selected: '',
        delay: 500,
        message: 'Waiting for user to stop typing ...'
      }
    },
    watch: {
      productName: _.debounce(function (e) {
        // Do something with search term after it debounced
        this.getProducts()
      }, 500)
    },
    mounted () {
      let route = this.$route.path
      this.productName = ''

      if (route === '/search') {
        if (!(this.$store.state.product.searchVal instanceof Object)) {
          this.$store.commit('product/SET_SEARCHVAL', (typeof (Cookies.getJSON('key2publish').product) !== 'undefined') ? Cookies.getJSON('key2publish').product.searchVal : '')
        }

        let searchVal = this.$store.state.product.searchVal
        this.productName = searchVal.name
        if (searchVal.name !== searchVal.description && searchVal.name !== '' && searchVal.description !== '') {
          this.productName = searchVal.name
        }
      } else {
        this.$store.commit('product/SET_SEARCHVAL', '')
      }
    },
    methods: {
      doSubmit () {
        this.$router.replace({ path: '/search' })
      },
      async getProducts () {
        try {
          this.isFetching = true
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser, { root: true })
          }
          let searchFiltersReset = { 'Product Type': [], 'Reactivity': [], 'Host': [], 'Clone': [], 'Applications': [], Conjugate: [] }
          this.$store.commit('product/SET_SEARCH_FILTERS', searchFiltersReset)
          let page = 1
          let option = { name: this.productName.replace(/[^-a-zA-Z0-9-]+/gmi, ''), description: this.productName.replace(/[^-a-zA-Z0-9-]+/gmi, '') }
          this.$store.commit('product/SET_SEARCHVAL', option)
          let params = { search: '' }
          if (this.$route.path === '/search') {
            params = this.$route.query

            await this.$store.dispatch('product/getFilters', {
              field: 'Product Type',
              params: params
            },
            {
              root: true
            })
            await this.$store.dispatch('product/getFilters', {
              field: 'Reactivity',
              params: params
            },
            {
              root: true
            })
            await this.$store.dispatch('product/getFilters', {
              field: 'Host',
              params: params
            },
            {
              root: true
            })
            await this.$store.dispatch('product/getFilters', {
              field: 'Clone',
              params: params
            },
            {
              root: true
            })
            await this.$store.dispatch('product/getFilters', {
              field: 'Applications',
              params: params
            },
            {
              root: true
            })
            await this.$store.dispatch('product/getFilters', {
              field: 'Conjugate',
              params: params
            },
            {
              root: true
            })
          }
          await this.$store.dispatch('product/getProducts', {
            page: page,
            params: params
          },
          {
            root: true
          })

          // console.log(mydata)
          this.productData = this.$store.state.product.data
          this.message = ''
          this.isFetching = false
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not load data')
          this.isFetching = false
        }
      },
      selectProduct (option) {
        console.log(option)
        this.$store.commit('product/SET_SEARCHVAL', option)
        this.$router.push('/search')
      }
    }
  }
</script>

<style>
  .my_div {
    margin-bottom: 15px;
  }
</style>
