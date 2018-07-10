<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="delivery"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Delivery</h1>
          <form @submit.prevent="saveDelivery()">
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
              <b-checkbox v-model="customer.newsletter">Signup for the monthly newsletter</b-checkbox>
            </b-field>
            <button type="submit" class="button is-primary">Save</button>
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
        newsletter: false,
        customer: {},
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
      async saveDelivery () {
        console.log('saved')
      }
    }
  }
</script>
