<template>
  <section id="search">
    <!-- <hr class="navbar-divider my_div"> -->
    <br />
    <b-field custom-class="is-medium">
      <p class="control is-medium">
        <button class="button is-orange is-medium" @click="doSubmit()">
            Search
        </button>
      </p>
      <b-autocomplete size="is-medium"
        v-model.lazy="productName"
        icon="microscope"
        :data="autocomplete"
        placeholder="Search for products/clone/LabNed No. ... e.g. CD3 or 2C8F1 or LN0110026"
        :loading="isFetching"
        @select="option => selectProduct(option)"
        v-on:keyup.13.native="doSubmit()"
        :expanded="expanded"
        >
        <!-- <template slot="header">
          <span style="font-weight:bold;font-style:italic">Suggestions:</span>
        </template> -->
        <template slot="empty">{{ message }}</template>
      </b-autocomplete>
    </b-field>
  </section>
</template>

<script>
  import Cookies from 'js-cookie'
  import _ from 'lodash'

  export default {
    props: {
      expanded: Boolean
    },
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
    created () {
      let route = this.$route.path
      // this.productName = ''
      let searchFiltersReset = { 'Product Type': {}, 'Reactivity': {}, 'Host': {}, 'Clone': {}, 'Applications': {}, Conjugate: {} }
      this.$store.commit('product/SET_SEARCH_FILTERS', searchFiltersReset)
      if (route === '/search') {
        // console.log('benhier')
        // console.log(this.$store.state.product)
        if ((this.$store.state.product === undefined)) {
          this.$store.commit('product/SET_SEARCHVAL', (typeof (Cookies.getJSON('key2publish').product) !== 'undefined') ? Cookies.getJSON('key2publish').product.searchVal : '')
          console.log('help:' + this.$store.state.product.searchVal)
        }

        let searchVal = this.$store.state.product.searchVal
        // console.log(searchVal)
        if (searchVal === null) searchVal = ''
        this.productName = searchVal
        /* if (searchVal.name !== searchVal.description && searchVal.name !== '' && searchVal.description !== '') {
          this.productName = searchVal.name
        } */
      } else {
        this.$store.commit('product/SET_SEARCHVAL', '')
        // this.productName = ''
      }
    },
    computed: {
      autocomplete () {
        let names = []
        for (let prod in this.productData) {
          let searchNames = this.productData[prod].description.split(',')
          for (let name in searchNames) {
            let myName = searchNames[name].trim()
            if (!names.indexOf(myName) !== -1) {
              names.push(myName)
            }
          }
        }
        return names
      }
    },
    methods: {
      doSubmit () {
        let route = this.$route.path
        if (route !== '/search') { this.$router.replace({ path: '/search' }) }
      },
      async getProducts () {
        try {
          console.log('iktrigger2')
          this.isFetching = true
          this.$store.commit('SET_ISLOADING', true)
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser, { root: true })
          }
          // let searchFiltersReset = { 'Product category LabNed': {}, 'Reactivity': {}, 'Host': {}, 'Clone': {}, 'Applications': {}, Conjugate: {} }
          // this.$store.commit('product/SET_SEARCH_FILTERS', searchFiltersReset)
          let page = 1
          let option = ''
          if (typeof this.productName !== 'undefined' && this.productName !== null) {
            option = this.productName.replace(/[^a-zA-Z0-9]+/gmi, '')
          }
          // console.log(option)
          this.$store.commit('product/SET_SEARCHVAL', option)
          let params = { search: '' }
          if (this.$route.path === '/search') {
            params = this.$route.query

            await this.$store.dispatch('product/getFilters', {
              field: 'Product category LabNed',
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
          this.$store.commit('SET_ISLOADING', false)
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not load data')
          this.isFetching = false
          this.$store.commit('SET_ISLOADING', false)
        }
      },
      selectProduct (option) {
        this.$store.commit('product/SET_SEARCHVAL', option)
        console.log('iktrigger')
        // let route = this.$route.path
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
