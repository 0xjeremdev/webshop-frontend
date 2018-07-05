<template>
  <div id="#labned" class="container">
    <div class="is-flex-mobile">
      <div class="columns">
        <div class="column">
          <nuxt-link to="/">
            <img src="https://www.labned.com/images/I/xLabNed,P20logo,P202.0.fw.png.pagespeed.ic.lNHYz6ertB.webp" alt="LabNed.com" width="auto" height="74px">
          </nuxt-link>
        </div>
        <div class="column">
          <div class="field is-grouped is-pulled-right my-margins">
            <cartWidgets></cartWidgets>
            <b-dropdown hoverable position="is-bottom-left" v-if="getAuth">
              <button class="button is-info" @click="account()" style="border: 1px solid white;" slot="trigger">
                <b-icon icon="account-circle"></b-icon>
                <span>Account</span>
              </button>
              <b-dropdown-item v-on:click="account()">Account info</b-dropdown-item>
              <b-dropdown-item v-on:click="logout()">Logout</b-dropdown-item>
            </b-dropdown>
            <b-dropdown hoverable position="is-bottom-left" v-else>
              <button class="button is-info" slot="trigger">
                <b-icon icon="account-circle"></b-icon>
                <span>Account</span>
              </button>
              <b-dropdown-item v-on:click="signup()">Register Account</b-dropdown-item>
              <b-dropdown-item v-on:click="login()">Login</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </div>
    <nav class="navbar rounded is-info my-zindex" role="navigation" aria-label="main navigation">
      <div class="navbar-item">
        <button v-on:click="collapse" class="button navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div id="navbarFront" class="navbar-menu" :class="{ 'is-active': showNav }">
        <div class="navbar-start">
          <nuxt-link class="navbar-item" to="/search">
            Products
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/protocols">
            Protocols
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/about-us">
            About Us
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/downloads">
            Downloads
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/distributors">
            Distributors
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/contact">
            Contact Us
          </nuxt-link>
        </div>
      </div>
    </nav>
    <main role="main">
      <cookiewall></cookiewall>
      <search v-if="$route.path !== '/'" :expanded="true"></search>
      <nuxt/>
    </main>
    <footer class="footer">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h3 class="subtitle">Social Media</h3>
            <social></social>
          </div>
          <div class="column is-2">
            <h3 class="subtitle">Payment Options</h3>

          </div>
          <div class="column is-2">
            <h3 class="subtitle">Help &amp; Support</h3>
            <p v-for="value in supportLinks">
              <nuxt-link :to="value.link">{{ value.name }}</nuxt-link>
            </p>
          </div>
          <div class="column is-2">
            <h3 class="subtitle">Company</h3>
            <p v-for="value in companyLinks">
              <nuxt-link :to="value.link">{{ value.name }}</nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  import cartWidgets from '~/components/widgets/cart.vue'
  import cookiewall from '~/components/widgets/cookiewall.vue'
  import search from '~/components/widgets/search.vue'
  import social from '~/components/widgets/social.vue'

  export default {
    created () {
      this.$store.dispatch('getSettings')
    },
    middleware: [ 'reloadCookie' ],
    components: { cartWidgets, cookiewall, search, social },
    data () {
      return {
        showNav: false,
        supportLinks: [
          { 'name': 'Terms & Conditions', 'link': '/cms/terms-conditions' },
          { 'name': 'Cookie Statement', 'link': '/cms/cookie-statement' },
          { 'name': 'Privacy Statement', 'link': '/cms/privacy-statement' },
          { 'name': 'Disclaimer', 'link': '/cms/disclaimer' }
        ],
        companyLinks: [
          { 'name': 'Protocols', 'link': '/protocols' },
          { 'name': 'Technical Faqs', 'link': '/cms/technical-faqs' },
          { 'name': 'LabNews', 'link': '/blog' }
        ]
      }
    },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities'
      }
    },
    methods: {
      collapse () {
        this.showNav = !this.showNav
      },
      account () {
        this.$router.push('/account')
      },
      async logout () {
        try {
          await this.$store.dispatch('account/logout')
          this.$router.replace({ path: '/' })
        } catch (e) {
          this.formError = e.message
        }
      },
      signup () {
        this.$router.push('/account/signup')
      },
      login () {
        this.$router.push('/account/login')
      }
    },
    computed: {
      getAuth: function () {
        return this.$store.state.account.token
      }
    }
  }
</script>

<style>
  .my-margins {
    margin: 1.5rem;
    float: right;
  }

  .my-paddings {
    padding: 2rem;
  }

  .my-zindex {
    z-index: 1
  }

  .button.is-primary {
    background-color: #ee7600;
  }

  a {
    color: #ee7600;
  }

  .has-text-primary {
    color: #ee7600 !important;
  }
  .input:focus, .taginput .taginput-container.is-focusable:focus, .input.is-focused, .taginput .is-focused.taginput-container.is-focusable, .input:active, .taginput .taginput-container.is-focusable:active, .input.is-active, .taginput .is-active.taginput-container.is-focusable,
  .textarea:focus,
  .textarea.is-focused,
  .textarea:active,
  .textarea.is-active {
    border-color: #aaa;
    -webkit-box-shadow: 0 0 0 0.125em rgba(125, 125, 125, 0.25);
            box-shadow: 0 0 0 0.125em rgba(125, 125, 125, 0.25);
  }

  .control ul {
    list-style: disc;
  }
</style>
