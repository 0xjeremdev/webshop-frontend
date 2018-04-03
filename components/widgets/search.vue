<template>
  <section id="search">
    <b-field>
      <b-autocomplete
        v-model="productName"
        icon="magnify"
        :data="productData"
        placeholder="Search for products ... e.g. CD3"
        field="name"
        :loading="isFetching"
        @input="getProducts()"
        @select="option => selectProduct(option)"
        v-on:keyup.13.native="doSubmit()">
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
    <hr class="navbar-divider my_div">
  </section>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    data () {
      return {
        productName: '',
        productData: [],
        isFetching: false,
        selected: ''
      }
    },
    created () {
      if (!(this.$store.state.product.searchVal instanceof Object)) {
        this.$store.commit('product/SET_SEARCHVAL', Cookies.getJSON('key2publish').product.searchVal)
      }
    },
    mounted () {
      let route = this.$route.path
      this.productName = ''

      if (route === '/product') {
        let searchVal = this.$store.state.product.searchVal
        this.productName = searchVal.name
        if (searchVal.name !== searchVal.description && searchVal.name !== '' && searchVal.description !== '') {
          this.productName = searchVal.name + ' a.k.a. ' + searchVal.description
        }
      } else {
        this.$store.commit('product/SET_SEARCHVAL', '')
      }
    },
    methods: {
      doSubmit () {
        this.$router.replace({ path: '/product' })
      },
      async getProducts () {
        try {
          this.isFetching = true
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser, { root: true })
          }

          let page = 1
          let option = { name: this.productName, description: this.productName }
          this.$store.commit('product/SET_SEARCHVAL', option)
          let params = { search: '' }
          if (this.$route.path === '/product') {
            params = this.$route.query
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
          this.isFetching = false
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not load data')
          this.isFetching = false
        }
      },
      selectProduct (option) {
        this.$store.commit('product/SET_SEARCHVAL', option)
        this.$router.replace({ path: '/product' })
      }
    }
  }
</script>

<style>
  .my_div {
    margin-bottom: 15px;
  }
</style>
