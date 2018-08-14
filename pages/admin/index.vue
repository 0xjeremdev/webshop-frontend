<template>
  <div>
    <login v-if="!authUser"></login>
    <div v-else class="container">
      Logging in ....
    </div>
  </div>
</template>

<script>
import Login from '~/components/auth/Login.vue'

export default {
  layout: 'admin',
  components: { Login },
  computed: {
    authUser () {
      return this.$store.state.authUser
    }
  },
  head () {
    return {
      title: 'LabNed.com - Exploring Possibilities - Login'
    }
  },
  created () {
    if (this.$store.state.authUser) {
      this.$router.replace({ path: '/admin/dashboard' })
    }
  }
}
</script>
