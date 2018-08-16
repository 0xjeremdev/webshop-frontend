<template>
  <section class="section">
    <div class="columns">
      <div class="column"></div>
      <div class="column">
        <h1 class="title">Reset your password</h1>
        <b-message type="is-danger" has-icon title="An error has occured" :active.sync="showError">
          {{ formError }}
        </b-message>
        <form v-on:submit.prevent>
          <input type="hidden" id="username" name="username" autocomplete="username" value="username"/>
          <b-field label="Change Password"
          :type="(typeof message['password'] !== 'undefined' && message['password'] !== '') ? 'is-danger' : ''"
          :message="message['password']">
            <b-input v-model="password"type="password"
              autocomplete='new-password'
              placeholder="Password reveal input"
              password-reveal>
            </b-input>
          </b-field>
          <b-field label="Repeat Password"
            :type="(typeof message['repeatPassword'] !== 'undefined' && message['repeatPassword'] !== '') ? 'is-danger' : ''"
            :message="message['repeatPassword']">
            <b-input v-model="repeatPassword"
              type="password"
              autocomplete='repeat-password'
              placeholder="Password reveal input"
              password-reveal>
            </b-input>
          </b-field>
          <b-field>
            <p class="control">
              <button type="submit" v-on:click="resetPassword()" class="button is-info">
                  Reset Password
              </button>
            </p>
          </b-field>
        </form>
      </div>
      <div class="column"></div>
    </div>
    <b-loading :active.sync="isLoading" :canCancel="false"></b-loading>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        password: '',
        repeatPassword: '',
        message: { 'repeatPassword': '', password: '' },
        token: '',
        isLoading: false,
        formError: '',
        showError: false
      }
    },
    async asyncData ({ store, error, query }) {
      try {
        // verify token or fail
        let token = query.token
        let data = await store.dispatch('account/verifyPasswordByToken', { token: token })
        if (!data) {
          error({ 'statusCode': 404, 'message': 'Page not found' })
        }
        return { token: token }
      } catch (e) {
        console.log(e)
        error({ 'statusCode': 404, 'message': 'Page not found' })
      }
    },
    methods: {
      async validate (value, fld, type) {
        let messages = this.message
        switch (type) {
          case 'email':
            messages[fld] = await this.$store.dispatch('validation/validateMail', { value: value })
            break
          case 'password':
            if (value === undefined) value = ''
            messages[fld] = await this.$store.dispatch('validation/validatePassword', { value: value })
            break
          case 'repeatPassword':
            if (value === undefined) value = ''
            messages[fld] = await this.$store.dispatch('validation/validateRepeatPassword', { value: value, repeat: this.password })
            break
          default:
            messages[fld] = await this.$store.dispatch('validation/validateField', { value: value })
            break
        }

        this.message = '' // hack to let two way binding work if a key in an object has changed
        this.message = messages
        this[fld] = value
      },
      async resetPassword () {
        try {
          this.isLoading = true
          this.formError = 'There are errors, please correct them to save'
          // validate fields here
          await this.validate(this.password, 'password', 'password')
          await this.validate(this.repeatPassword, 'repeatPassword', 'repeatPassword')
          if (this.checkErrors) {
            this.showError = true
            this.isLoading = false
          }
          if (!this.checkErrors) {
            let result = await this.$store.dispatch('account/resetPasswordByToken', { token: this.token, password: this.password })
            if (result) {
              this.password = ''
              this.repeatPassword = ''
              this.isLoading = false
              this.showError = false
              this.$router.replace({ 'path': '/account/login', 'replace': true })
            }
            this.showError = true
            this.formError = 'Could not change your password, please verify your token is still valid or contact our support team.'
            this.isLoading = false
          }
        } catch (e) {
          console.log(e)
          this.showError = true
          this.isLoading = false
          this.formError = 'Could not change your password, please verify your token is still valid or contact our support team.'
        }
      }
    }
  }
</script>
