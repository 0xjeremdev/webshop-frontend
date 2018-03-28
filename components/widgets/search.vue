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
        @select="option => selectProduct(option)">
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
    methods: {
      async getProducts () {
        try {
          this.isFetching = true
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
          }
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
          let query = {
            'options': {
              'fullCount': true
            },
            'count': true,
            'query': 'FOR p in k2p_product FILTER LOWER(p.basic.name) LIKE @search OR LOWER(p.basic.description) LIKE @search RETURN { _key: p._key, _id: p._id, name: p.basic.name, description: p.basic.description }',
            'bindVars': {
              'search': this.productName.toLowerCase() + '%'
            }
          }
          // console.log(query)
          let mydata = await this.$axios.$post(this.$store.state.productUrl + '/_api/cursor', query)
          // console.log(mydata)
          this.productData = mydata.result
          this.isFetching = false
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not load data')
          this.isFetching = false
        }
      },
      selectProduct (option) {
        console.log(option)
      }
    }
  }
</script>

<style>
  .my_div {
    margin-bottom: 15px;
  }
</style>
