<template>
    <section class="section">
      <b-message type="is-danger" has-icon title="An error has occured" :active.sync="showError">
        {{ this.formError }}
      </b-message>
      <div class="columns">
        <div class="column"></div>
        <div class="column is-one-third">
          <h1 class="title">Login</h1>
          <form v-on:submit.prevent>
            <b-field label="Email"
                :type="email_type"
                :message="email_message">
                <b-input placeholder="Email"
                    icon="email"
                    :value="email"
                    v-model="formEmail">
                </b-input>
            </b-field>

            <b-field label="Password"
                :type="password_type"
                :message="password_message">
                <b-input placeholder="Password"
                  icon="lock"
                  :value="password"
                  type="password"
                  password-reveal
                  v-model="formPassword"></b-input>
            </b-field>

            <b-field>
              <p class="control">
                <button type="submit" v-on:click="login()" class="button is-primary">
                    Login
                </button>
              </p>
            </b-field>
            <hr>
            <b-field>
              <p class="control">
                <nuxt-link to="/account/forgotpassword"><button type="button" class="button is-info is-small">
                  I forgot my Password
                </button></nuxt-link>
              </p>
            </b-field>
          </form>
        </div>
        <div class="column"></div>
        <div class="column vl"></div>
        <div class="column"></div>
        <div class="column is-one-third">
          <h1 class="title">Register</h1>
          <b-field>
            <nuxt-link to="/account/signup">
              <button type="button" class="button is-info">Create an accountwa</button>
            </nuxt-link>
          </b-field>
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
        formEmail: '',
        formPassword: '',
        showError: false
      }
    },
    methods: {
      async login () {
        try {
          await this.$store.dispatch('account/login', {
            email: this.formEmail,
            password: this.formPassword
          })
          this.formEmail = ''
          this.formPassword = ''
          this.formError = null
          this.showError = false
          if (this.$store.state.account.token) {
            const link = (this.$store.state.rememberLink !== undefined && this.$store.state.rememberLink !== '') ? this.$store.state.rememberLink : '/account/personal'
            this.$router.replace({ path: link })
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

<style lang="scss">
  .vl {
      border-right: 1px solid #dbdbdb;
      height: 300px;
  }
</style>
