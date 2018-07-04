<template>
  <b-notification :active.sync="isActive" type="is-info" has-icon closable @close="doClose()">
    <b>Cookie-Wall</b><br />
    {{ cookiewall_text }}<br />
    <br />
    <button @click="doAccept()" class="button is-success">Accept Cookies</button>
  </b-notification>
</template>

<script>
  export default {
    data () {
      return {
        'cookiewall_text': 'Text Here'
      }
    },
    computed: {
      isActive () {
        return !this.$store.state.cookieAccepted
      }
    },
    created () {
      if (this.$cookies.get('key2publish') !== undefined) this.$store.commit('SET_COOKIEACCEPT', this.$cookies.get('key2publish').cookieAccepted)
    },
    methods: {
      doAccept () {
        this.$store.commit('SET_COOKIEACCEPT', true)
      },
      doClose () {
        this.$store.commit('SET_COOKIEACCEPT', false)
        // this.$router.push('cookie_not_accepted')
        // throw error({'statusCode': 200, 'message': 'Cannot Continue Cookies Not Accepted'})
      }
    }
  }
</script>
