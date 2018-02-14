<template>
    <section class="section">
      <div class="columns">
        <div class="column"></div>
        <div class="column is-one-third">
          <b-message type="is-danger" has-icon title="An error has occured" :active.sync="showError">
            {{ this.formError }}
          </b-message>
          <form v-on:submit.prevent>
            <b-field label="Email"
                :type="email_type"
                :message="email_message">
                <b-input placeholder="Email"
                    icon="email"
                    :value="email"
                    v-model="formUsername">
                </b-input>
            </b-field>

            <b-field label="Password"
                :type="password_type"
                :message="password_message">
                <b-input placeholder="Password"
                  icon="lock"
                  :value="password"
                  type="password"
                  v-model="formPassword"></b-input>
            </b-field>

            <b-field>
              <p class="control">
                <button type="submit" v-on:click="login()" class="button is-primary">
                    Login
                </button>
              </p>
            </b-field>
          </form>
        </div>
        <div class="column"></div>
      </div>
    </section>
</template>

<script>
  export default {
    data () {
      return {
        email_type: '',
        email_message: '',
        email: '',
        password_type: '',
        password_message: '',
        password: '',
        formError: null,
        formUsername: '',
        formPassword: '',
        showError: false
      }
    },
    methods: {
      async login () {
        try {
          await this.$store.dispatch('login', {
            username: this.formUsername,
            password: this.formPassword
          })
          this.formUsername = ''
          this.formPassword = ''
          this.formError = null
          this.showError = false
          if (this.$store.state.authUser) {
            this.$router.replace({ path: '/admin/dashboard' })
          } else {
            this.formError = 'Could not login'
            this.showError = true
          }
        } catch (e) {
          this.formError = e.message
          this.showError = true
        }
        // console.log(this.$store.state.authUser.jwt)
      },
      async logout () {
        try {
          /* await this.$store.dispatch('logout', {
            userid: this.$store.state.authUser.user.id
          }) */
          this.$router.replace({ path: '/admin' })
        } catch (e) {
          this.formError = e.message
        }
      }
    }
  }
</script>
