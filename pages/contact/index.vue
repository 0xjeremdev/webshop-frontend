<template>
  <section class="section">
      <breadCrumb></breadCrumb>
      <div class="columns">
        <div class="column">
          <h1 class="title">Contact Us</h1>
          <b-message :type="(wasSend) ? 'is-success' : 'is-danger'" has-icon :title="(wasSend) ? 'Success' : 'An error has occured'" :active.sync="showError">
            {{ formError }}
          </b-message>
          <form v-if="!wasSend" v-on:submit.prevent="sendContact()">
            <b-field grouped>
              <b-field label="Title" :type="(typeof message.formTitle !== 'undefined' && message.formTitle !== '') ? 'is-danger' : ''" :message="message.formTitle">
                <b-select placeholder="Title" v-model="formTitle">
                  <option v-for="title in titles" :key="title" :value="title">{{ title }}</option>
                </b-select>
              </b-field>
              <b-field label="Firstname" expanded :type="(typeof message.formFirstname !== 'undefined' && message.formFirstname !== '') ? 'is-danger' : ''" :message="message.formFirstname">
                  <b-input autocomplete="firstname" placeholder="Firstname" @blur="validate($event.srcElement.value, 'formFirstname', 'field')"></b-input>
              </b-field>
              <b-field label="Lastname" expanded :type="(typeof message.formLastname !== 'undefined' && message.formLastname !== '') ? 'is-danger' : ''" :message="message.formLastname">
                  <b-input autocomplete="lastname" placeholder="Lastname" @blur="validate($event.srcElement.value, 'formLastname', 'field')"></b-input>
              </b-field>
            </b-field>
            <b-field label="E-mail" :type="(typeof message.formEmail !== 'undefined' && message.formEmail !== '') ? 'is-danger' : ''" :message="message.formEmail">
              <b-input type="email" :value="formEmail" autocomplete="email" @blur="validate($event.srcElement.value, 'formEmail', 'email')" placeholder="example@labned.com"></b-input>
            </b-field>
            <b-field label="Message" :type="(typeof message.formMessage !== 'undefined' && message.formMessage !== '') ? 'is-danger' : ''" :message="message.formMessage">
              <b-input type="textarea" :value="formMessage" autocomplete="message" @blur="validate($event.srcElement.value, 'formMessage', 'field')" placeholder="Type your question/message"></b-input>
            </b-field>
            <b-field>
              <b-checkbox v-model="formNewsletter">Sign-up for the monthly newsletter</b-checkbox>
            </b-field>
            <vue-recaptcha ref="recaptcha"
              @verify="onVerify"
              sitekey="6Lf0WGQUAAAAAIuDsIZZ1yfdTduM1YcX5nglDyjZ">
            </vue-recaptcha>
            <br />
            <button type="submit" class="button is-orange">Submit</button>
          </form>
        </div>
        <div class="column">
          <contactinfo :info="info"></contactinfo>
        </div>
      </div>
  </section>
</template>

<script>
  import VueRecaptcha from 'vue-recaptcha'
  import breadCrumb from '~/components/widgets/breadcrumb.vue'
  import contactinfo from '~/components/widgets/contactinfo.vue'

  export default {
    head () {
      return {
        script: [
          { src: 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit', async: true, defer: true }
        ]
      }
    },
    components: { VueRecaptcha, breadCrumb, contactinfo },
    data () {
      return {
        wasSend: false,
        formMessage: '',
        formEmail: '',
        formFirstname: '',
        formLastname: '',
        formTitle: null,
        formNewsletter: false,
        message: {},
        formError: 'There are errors, please correct them to contact us',
        showError: false,
        isLoading: false,
        recaptchaToken: null,
        titles: ['Prof.', 'Drs.', 'Mr.', 'Ir.', 'Dr.', 'MD.', 'Ing.', 'Bsc.', 'Msc.', 'Mrs.']
      }
    },
    async asyncData ({ store }) {
      let info = ''
      await store.dispatch('getSettings')
      info = store.state.settings
      return { info: info }
    },
    computed: {
      checkErrors: {
        cache: false,
        get () {
          try {
            let messages = this.message
            for (var mes in messages) {
              // console.log(mes + ' - ' + this.message[mes])
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
            messages[fld] = await this.$store.dispatch('validation/validatePassword', { value: value })
            break
          case 'repeatPassword':
            messages[fld] = await this.$store.dispatch('validation/validateRepeatPassword', { value: value, repeat: this.formPassword })
            break
          case 'select':
            messages[fld] = await this.$store.dispatch('validation/validateSelect', { value: value })
            break
          default:
            messages[fld] = await this.$store.dispatch('validation/validateField', { value: value })
            break
        }

        this.message = '' // hack to let two way binding work if a key in an object has changed
        this.message = messages
        this[fld] = value
      },
      async sendContact () {
        this.isLoading = true
        this.validate(this.formTitle, 'formTitle', 'select')
        this.validate(this.formLastname, 'formLastname', 'field')
        this.validate(this.formFirstname, 'formFirstname', 'field')
        this.validate(this.formEmail, 'formEmail', 'email')
        this.validate(this.formMessage, 'formMessage', 'field')
        if (this.checkErrors) {
          this.formError = 'There are errors, please correct them to contact us'
          this.showError = true
          this.isLoading = false
          return
        }
        if (this.recaptchaToken === null) {
          this.formError = 'Please verify your are a human by pressing the I am not a Robot checkbox'
          this.showError = true
          this.isLoading = false
          return
        }

        // this.showError = false
        // this.isLoading = false
        try {
          const data = {
            title: (this.formTitle !== undefined) ? this.formTitle : '',
            firstname: (this.formFirstname !== undefined) ? this.formFirstname : '',
            lastname: (this.formLastname !== undefined) ? this.formLastname : '',
            email: (this.formEmail !== undefined) ? this.formEmail : '',
            message: (this.formMessage !== undefined) ? this.formMessage : '',
            newsletter: (this.formNewsletter !== undefined) ? this.formNewsletter : false,
            recaptchaToken: (this.recaptchaToken !== undefined) ? this.recaptchaToken : ''
          }
          await this.$axios.$post(this.$store.state.apiUrl + '/contact', data)
          this.wasSend = true
          this.formError = 'We have received your contact form successfully, it may take up to two working days before your receive an answer'
          this.isLoading = false
          this.showError = true
        } catch (e) {
          this.formError = 'Unexpected Error occured'
          this.showError = true
          this.isLoading = false
        }
      },
      onVerify (response) {
        this.recaptchaToken = response
      }
    }
  }
</script>
