<template>
  <section class="section">
    <b-message type="is-danger" has-icon title="An error has occured" :active.sync="showError">
      {{ formError }}
    </b-message>
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="account"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Account</h1>
          <form @submit.prevent="saveCustomer()">
          <b-field label="E-mail"
          :type="(typeof message['email'] !== 'undefined' && message['email'] !== '') ? 'is-danger' : ''"
          :message="message['email']">
            <b-input v-model="customer.email" type="email" autocomplete='email' placeholder="example@labned.com"></b-input>
          </b-field>
          <b-field label="Current Password"
          :type="(typeof message['oldPassword'] !== 'undefined' && message['oldPassword'] !== '') ? 'is-danger' : ''"
          :message="message['oldPassword']">
              <b-input v-model="customer.oldPassword" type="password"
                autocomplete='current-password'
                placeholder="Password reveal input"
                password-reveal>
              </b-input>
          </b-field>
          <b-field label="Change Password"
          :type="(typeof message['newPassword'] !== 'undefined' && message['newPassword'] !== '') ? 'is-danger' : ''"
          :message="message['newPassword']">
              <b-input v-model="customer.newPassword"type="password"
                autocomplete='new-password'
                placeholder="Password reveal input"
                password-reveal>
              </b-input>
          </b-field>
          <b-field label="Repeat Password"
          :type="(typeof message['repeatPassword'] !== 'undefined' && message['repeatPassword'] !== '') ? 'is-danger' : ''"
          :message="message['repeatPassword']">
              <b-input v-model="customer.repeatPassword"
                type="password"
                autocomplete='new-password'
                placeholder="Password reveal input"
                password-reveal>
              </b-input>
          </b-field>
          <b-field>
            <b-checkbox v-model="customer.newsletter">Sign-up for the monthly newsletter</b-checkbox>
          </b-field>
          <button type="submit" class="button is-primary">Change</button>
          <hr>
          <b-field>
            <p class="control">
              <nuxt-link to="/account/delete"><button type="button" class="button is-info is-small">
                Request removal of my account
              </button></nuxt-link>
            </p>
          </b-field>
          </form>
        </div>
      </div>
    </div>
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  </section>
</template>

<script>
  import accountMenu from '~/components/ui/accountMenu.vue'

  export default {
    middleware: 'authCustomer',
    components: { accountMenu },
    data () {
      return {
        address: {},
        message: {
          email: ''
        }, // filled in one key so it also works when any of the values are untouched
        showError: false,
        formError: 'There are errors, please correct them to save',
        isLoading: false
      }
    },
    async asyncData ({ store }) {
      let data = await store.dispatch('account/getAuth')
      if (data.data.result.id !== undefined) {
        const customer = await store.dispatch('account/getCustomer', { id: data.data.result.id })
        return { customer: customer.data.result._result[0] }
      }
      return { customer: '' }
    },
    computed: {
      checkErrors: {
        cache: false,
        get () {
          try {
            let messages = this.message
            for (var mes in messages) {
              console.log(mes + ' - ' + this.message[mes])
              if (this.message[mes] !== '') {
                return true
              }
            }
            return false
          } catch (e) {
            console.log(e)
          }
        }
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
            messages[fld] = await this.$store.dispatch('validation/validateRepeatPassword', { value: value, repeat: this.customer.newPassword })
            break
          default:
            messages[fld] = await this.$store.dispatch('validation/validateField', { value: value })
            break
        }

        this.message = '' // hack to let two way binding work if a key in an object has changed
        this.message = messages
        this.customer[fld] = value
      },
      async deleteCustomer () {
        try {
          this.isLoading = true
        } catch (e) {
          console.log(e)
          this.isLoading = false
        }
      },
      async saveCustomer () {
        try {
          this.isLoading = true
          this.formError = 'There are errors, please correct them to save'
          // validate fields here
          await this.validate(this.customer.email, 'email', 'email')
          await this.validate(this.customer.oldPassword, 'oldPassword', 'password')
          await this.validate(this.customer.newPassword, 'newPassword', 'password')
          await this.validate(this.customer.repeatPassword, 'repeatPassword', 'repeatPassword')
          if (this.checkErrors) {
            this.showError = true
            this.isLoading = false
          }
          if (!this.checkErrors) {
            let result = await this.$store.dispatch('account/changePassword', { customer: this.customer })
            if (result) {
              this.customer.oldPassword = ''
              this.customer.newPassword = ''
              this.customer.repeatPassword = ''
              this.isLoading = false
              this.showError = false
              this.$toast.open({ message: 'Saved', type: 'is-success' })
            }
            this.showError = true
            this.formError = 'Could not change your login credentials, please provide either the same e-mail or an e-mail that has not been registered yet. Also check you have inserted your current password correctly'
            this.isLoading = false
            this.$toast.open({ message: 'Could not save data, please try again', type: 'is-danger' })
          }
        } catch (e) {
          console.log(e)
          this.showError = true
          this.isLoading = false
          this.$toast.open({ message: 'Could not save data, please try again', type: 'is-danger' })
        }
      }
    }
  }
</script>
