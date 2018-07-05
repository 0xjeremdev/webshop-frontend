<template>
    <section>
      <div v-if="access">
        <div class="container">
          <div class="columns">
            <div class="column">
            </div>
            <div class="column">
              <br />
              <b-message type="is-success" has-icon title="Activated Successfully" :closable="false">
                Your account has been succesfully activated! You can login by going by clicking <nuxt-link to="/account/login">here</nuxt-link>.
              </b-message>
              <br />
            </div>
            <div class="column">
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <br />
        <div class="container">
          <div class="content has-text-centered">
            <b-icon
                icon="alert"
                size="is-large">
            </b-icon>
            <h1>Page not found</h1>
          </div>
        </div>
        <br />
      </div>
    </section>
</template>

<script>
  // import axios from 'axios'

  export default {
    data () {
      return {
        verification: null,
        email: null,
        access: false,
        text: null,
        rValue: null
      }
    },
    /* validate ({query, store}) {
      try {
        this.verification = query.token
        this.email = query.email
        const isMail = (this.email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g).length > 0)
        const isToken = (this.verification.match(/[.]/g).length > 0)
        this.access = (this.verification !== undefined && this.email !== undefined && isMail && isToken)
        return this.access
      } catch (e) {
        console.log(e)
        return false
      }
    }, */
    async mounted () {
      // Redo of code since validate clears this variables again
      try {
        this.verification = this.$route.query.token
        this.email = this.$route.query.email
        // const isMail = (this.email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g).length > 0)
        const isMail = true
        const isToken = (this.verification.match(/[.]/g).length > 0)
        this.access = (this.verification !== undefined && this.email !== undefined && isMail && isToken)
        if (this.access) this.access = await this.getData()
        // if (!this.access) console.log(this)
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      async getData () {
        try {
          const post = { email: this.email, token: this.verification }
          await this.$axios.$post(this.$store.state.apiUrl + '/verification/verify', post)
          return true
        } catch (e) {
          return false
        }
      }
    }
  }
</script>
