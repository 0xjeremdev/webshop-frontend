<template>
  <section class="section">
    <div class="container">
      <br />
      <div class="columns">
        <div class="column"></div>
        <div class="column">
          <form v-on:submit.prevent>
            <b-message :class="email_type">
              {{ formEmail }}
            </b-message>
            <b-field label="Email"
                :type="email_type"
                :message="email_message">
                <b-input placeholder="Email"
                    icon="email"
                    :value="email"
                    v-model="email">
                </b-input>
            </b-field>
            <b-field>
              <p class="control">
                <button type="submit" v-on:click="forgotPassword()" class="button is-info">
                    Reset Password
                </button>
              </p>
            </b-field>
          </form>
        </div>
        <div class="column"></div>
      </div>
      <br />
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
        formError: null,
        formEmail: 'Please type your E-mail below to get a link to restore your password',
        showError: false
      }
    },
    methods: {
      async forgotPassword () {
        // console.log(this.email)
        let err = await this.$store.dispatch('validation/validateMail', { value: this.email })
        if (err !== '') {
          this.email_type = 'is-danger'
          this.email_message = err
          return
        }
        this.email_type = ''
        this.email_message = ''
        let forgotPassword = await this.$store.dispatch('account/forgotPassword', {
          email: this.email
        })
        if (forgotPassword) {
          this.email_type = ''
          this.formEmail = 'An email was send with the password reset link to ' + this.email
          this.showError = true
          this.email = ''
        } else {
          this.email_type = 'is-danger'
          this.formEmail = 'Unexpected error: Could not send password reset link'
          this.showError = true
        }
      }
    }
  }
</script>
