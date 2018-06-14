<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title">Contact Us</h1>
          <form v-on:submit.prevent="sendContact()">
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
        formMessage: '',
        formEmail: '',
        formFirstname: '',
        formLastname: '',
        formTitle: null,
        message: {},
        formError: '',
        showError: false,
        titles: ['Prof.', 'Drs.', 'Mr.', 'Ir.', 'Dr.', 'MD.', 'Ing.', 'Bsc.', 'Msc.', 'Mrs.']
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
        this.validate(this.formTitle, 'formTitle', 'select')
        this.validate(this.formLastname, 'formLastname', 'field')
        this.validate(this.formFirstname, 'formFirstname', 'field')
        this.validate(this.formEmail, 'formEmail', 'email')
        this.validate(this.formPassword, 'formMessage', 'field')
        console.log(this.message)
      }
    }
  }
</script>
