<template>
  <div>
    Test {{ $route.params.code }}
    <button @click="getData">Press me</button>
    <b-field v-for="key in testData" v-bind:data="key"
       v-bind:key="key.text" :label="key">
       <p>{{ key }}</p>
      <b-input></b-input>
    </b-field>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    layout: 'admin',
    data () {
      return {
        testData: {}
      }
    },
    async created () {
      await this.getData()
    },
    validate ({ params }) {
      // Must be a number
      return params
    },
    methods: {
      async getData () {
        if (!(this.$store.state.authUser instanceof Object)) {
          this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
        }
        this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
        let query = {'options': {'fullCount': true}, 'count': true, 'query': 'FOR p in k2p_product FILTER p.code == \'' + this.$route.params.code + '\' RETURN p'}
        let data = await this.$axios.$post('http://localhost:8529/_db/key2publish/_api/cursor', query)
        // console.log(data)
        this.testData = data['result']
      }
    }
  }
</script>
