<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="account"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Account</h1>
          <form @submit.prevent="doSubmit()">
          <b-field label="E-mail">
            <b-input type="email" autocomplete='email' placeholder="example@labned.com"></b-input>
          </b-field>
          <b-field label="Old Password">
              <b-input type="password"
                autocomplete='current-password'
                placeholder="Password reveal input"
                password-reveal>
              </b-input>
          </b-field>
          <b-field label="Change Password">
              <b-input type="password"
                autocomplete='new-password'
                placeholder="Password reveal input"
                password-reveal>
              </b-input>
          </b-field>
          <b-field label="Repeat Password">
              <b-input type="password"
                autocomplete='new-password'
                placeholder="Password reveal input"
                password-reveal>
              </b-input>
          </b-field>
          <b-field>
            <b-checkbox v-model="newsletter">Signup for the monthly newsletter</b-checkbox>
          </b-field>
          <button type="submit" class="button is-primary">Change</button>
          <hr>
          <b-field>
            <p class="control">
              <nuxt-link to="/account/delete"><button type="button" class="button is-danger is-small">
                Request removal of my account
              </button></nuxt-link>
            </p>
          </b-field>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import accountMenu from '~/components/ui/accountMenu.vue'

  export default {
    components: { accountMenu },
    data () {
      return {
        newsletter: false
      }
    }
  }
</script>
