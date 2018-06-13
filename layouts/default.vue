<template>
  <div id="#labned" class="container">
    <section>
      <div class="columns">
        <div class="column is-one-quarter">

      <nuxt-link to="/">
        <img src="http://www.labned.com/images/I/xLabNed,P20logo,P202.0.fw.png.pagespeed.ic.lNHYz6ertB.webp" alt="LabNed.com" width="auto" height="74px">
      </nuxt-link>
    </div>
    <div class="column">
      <search>
      </search>
    </div>
  </div>
    </section>
    <nav class="navbar is-info rounded" role="navigation" aria-label="main navigation">
      <div class="navbar-item">
        <!-- <nuxt-link class="navbar-item" to="/">
          <img src="http://www.labned.com/images/I/xLabNed,P20logo,P202.0.fw.png.pagespeed.ic.lNHYz6ertB.webp" alt="ITK Diagnostics B.V." width="auto" height="28px">
        </nuxt-link> -->
        <button v-on:click="collapse" class="button navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div id="navBarAdmin" class="navbar-menu" :class="{ 'is-active': showNav }">
        <div class="navbar-start">
          <nuxt-link class="navbar-item" to="/search">
            Products
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/protocols">
            Protocols
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/aboutus">
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

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <cartWidgets></cartWidgets>
            <b-dropdown hoverable position="is-bottom-left" v-if="getAuth">
              <button class="button is-info" style="border: 1px solid white;" slot="trigger">
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
    </nav>
    <main role="main">
      <cookiewall></cookiewall>
      <nuxt/>
    </main>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>Footer</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  import cartWidgets from '~/components/widgets/cart.vue'
  import breadCrumb from '~/components/widgets/breadcrumb.vue'
  import search from '~/components/widgets/search.vue'
  import cookiewall from '~/components/widgets/cookiewall.vue'

  export default {
    created () {
      // this.$store.dispatch('connectDB')
    },
    components: { cartWidgets, breadCrumb, search, cookiewall },
    data () {
      return {
        showNav: false
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
