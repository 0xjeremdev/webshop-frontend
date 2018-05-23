<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
        </div>
        <div class="column">
          <b-message type="is-danger" has-icon title="An error has occured" :active.sync="showError">
            {{ formError }}
          </b-message>
          <h1 class="title">Signup for LabNed.com</h1>
          <form v-on:submit.prevent="doRegister()">
            <b-field grouped>
              <b-field label="Title" :type="(typeof message.formTitle !== 'undefined' && message.formTitle !== '') ? 'is-danger' : ''" :message="message.formTitle">
                  <b-select placeholder="Title" v-model="formTitle">
                      <option key="M" value="M">Mr.</option>
                      <option key="F" value="F">Ms.</option>
                  </b-select>
              </b-field>
                <b-field label="Lastname" expanded :type="(typeof message.formLastname !== 'undefined' && message.formLastname !== '') ? 'is-danger' : ''" :message="message.formLastname">
                    <b-input autocomplete="lastname" placeholder="Lastname" @blur="validate($event.srcElement.value, 'formLastname', 'field')"></b-input>
                </b-field>
                <b-field label="Firstname" expanded :type="(typeof message.formFirstname !== 'undefined' && message.formFirstname !== '') ? 'is-danger' : ''" :message="message.formFirstname">
                    <b-input autocomplete="firstname" placeholder="Firstname" @blur="validate($event.srcElement.value, 'formFirstname', 'field')"></b-input>
                </b-field>
            </b-field>
            <b-field label="E-mail" :type="(typeof message.formEmail !== 'undefined' && message.formEmail !== '') ? 'is-danger' : ''" :message="message.formEmail">
              <b-input type="email" :value="formEmail" autocomplete="email" @blur="validate($event.srcElement.value, 'formEmail', 'email')" placeholder="example@labned.com"></b-input>
            </b-field>
            <b-field label="Password" :type="(typeof message.formPassword !== 'undefined' && message.formPassword !== '') ? 'is-danger' : ''" :message="message.formPassword">
                <b-input type="password"
                    placeholder="Password reveal input"
                    password-reveal
                    @blur="validate($event.srcElement.value, 'formPassword', 'password')">
                </b-input>
            </b-field>
            <b-field label="Repeat Password" :type="(typeof message.formRepeatPassword !== 'undefined' && message.formRepeatPassword !== '') ? 'is-danger' : ''" :message="message.formRepeatPassword">
                <b-input type="password"
                    placeholder="Password reveal input"
                    password-reveal
                    @blur="validate($event.srcElement.value, 'formRepeatPassword', 'repeatPassword')">
                </b-input>
            </b-field>
            <b-field>
              <b-checkbox v-model="formNewsletter">Signup for the newsletter</b-checkbox>
            </b-field>
            <button type="submit" class="button is-primary">Submit</button>
          </form>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        showError: false,
        formError: 'There are errors, please correct them to register',
        formNewsletter: false,
        formRepeatPassword: '',
        formPassword: '',
        formEmail: '',
        formTitle: null,
        formLastname: '',
        formFirstname: '',
        message: {}
      }
    },
    computed: {
      checkErrors () {
        for (let message in this.message) {
          if (this.message[message] !== '') {
            return true
          }
        }
        return false
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
      async doRegister () {
        try {
          this.validate(this.formTitle, 'formTitle', 'select')
          this.validate(this.formLastname, 'formLastname', 'field')
          this.validate(this.formFirstname, 'formFirstname', 'field')
          this.validate(this.formEmail, 'formEmail', 'email')
          this.validate(this.formPassword, 'formPassword', 'password')
          this.validate(this.formRepeatPassword, 'formRepeatPassword', 'repeatPassword')
          console.log(this.message)
          if (this.checkErrors) this.showError = true
          if (!this.checkErrors) {
            this.showError = false
            await this.$store.dispatch('account/register', {
              email: this.formEmail,
              password: this.formPassword,
              title: this.formTitle,
              firstname: this.formFirstname,
              lastname: this.formLastname,
              newsletter: this.formNewsletter
            })
            this.formTitle = ''
            this.formLastname = ''
            this.formFirstname = ''
            this.formEmail = ''
            this.formPassword = ''
            this.formRepeatPassword = ''
            this.formNewsletter = false
            this.showError = false
            if (this.$store.state.account.token) {
              this.$router.replace({ path: '/' })
            } else {
              this.formError = 'Could not register'
              this.showError = true
            }
          }
        } catch (e) {
          this.formError = e.message
          this.showError = true
        }
      }
    }
  }
</script>
