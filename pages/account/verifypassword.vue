<template>
  <div class="container">
    <h1 class="subtitle">Reset your password</h1>
    <div>
      <form v-on:submit.prevent>
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
              autocomplete='new-password'
              placeholder="Password reveal input"
              password-reveal>
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        password: '',
        repeatPassword: '',
        message: { 'repeatPassword': '', password: '' }
      }
    },
    async asyncData ({ store, params }) {

    },
    methods: {
      async forgotPassword () {

      }
    }
  }
</script>
