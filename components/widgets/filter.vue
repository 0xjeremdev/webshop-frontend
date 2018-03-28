<template>
  <section>
    <button @click="doToggle()"></button>
    <b-collapse class="card" v-for="( val, key ) in searchColumns" :key="key" :open="(val === 'Product Type')">
        <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">
                {{ val }}
            </p>
            <a class="card-header-icon">
                <b-icon
                    :icon="props.open ? 'menu-down' : 'menu-up'">
                </b-icon>
            </a>
        </div>
        <div class="card-content">
            <div class="content">
              <b-field>
                <b-checkbox></b-checkbox>
              </b-field>
            </div>
        </div>
    </b-collapse>
  </section>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    data () {
      return {
        searchColumns: [ 'Product Type', 'Reactivity', 'Host', 'Clone', 'Application', 'Conjugate' ],
        searchValues: { 'Product Type': [], 'Reactivity': [], 'Host': [], 'Clone': [], 'Application': [], Conjugate: [] },
        isFetching: false
      }
    },
    methods: {
      async getData (type) {
        console.log(type)
        try {
          this.isFetching = true
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
          }
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
          let search = this.$store.state.product.searchVal
          console.log(search)
          let query = {
            'options': {
              'fullCount': true
            },
            'count': true,
            'query': 'FOR p in k2p_product FILTER LOWER(p.basic.name) LIKE @search OR LOWER(p.basic.description) LIKE @search RETURN { p.basic[' + type + '] }',
            'bindVars': {
              'search': search.toLowerCase() + '%'
            }
          }
          let mydata = await this.$axios.$post(this.$store.state.productUrl + '/_api/cursor', query)
          console.log(query)
          console.log(mydata)
          this.productData = mydata.result
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
