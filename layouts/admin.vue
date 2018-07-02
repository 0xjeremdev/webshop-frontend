<template>
  <div id="#labned" class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">
          <img src="https://www.labned.com/images/I/xLabNed,P20logo,P202.0.fw.png.pagespeed.ic.lNHYz6ertB.webp" alt="ITK Diagnostics B.V. - Admin Page" width="auto" height="28px">
        </nuxt-link>
        <button v-on:click="collapse" class="button navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div id="navBarAdmin" class="navbar-menu" :class="{ 'is-active': showNav }">
        <div class="navbar-start" v-if="getAuth">
          <nuxt-link class="navbar-item" to="/admin/dashboard">
            Home
          </nuxt-link>
          <div class="navbar-item has-dropdown is-hoverable">
            <!--<nuxt-link class="navbar-link" to="/admin/catalog">-->
            <p class="navbar-link">Catalog</p>
            <!--</nuxt-link>-->
            <div class="navbar-dropdown is-boxed">
              <nuxt-link class="navbar-item" to="/admin/catalog/product">
                Products
              </nuxt-link>
              <!-- <nuxt-link class="navbar-item" to="/admin/catalog/category">
                Categories
              </nuxt-link> -->
            </div>
          </div>
          <nuxt-link class="navbar-item" to="/admin/order">
            Orders
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/admin/quote">
            Quotes
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/admin/customer">
            Customers
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/admin/cms">
            CMS
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/admin/blog">
            Blog
          </nuxt-link>
          <div class="navbar-item has-dropdown is-hoverable">
            <!--<nuxt-link class="navbar-link" to="/admin/catalog">-->
            <p class="navbar-link">Settings</p>
            <!--</nuxt-link>-->
            <div class="navbar-dropdown is-boxed">
              <nuxt-link class="navbar-item" to="/admin/settings/user">
                Users
              </nuxt-link>
              <nuxt-link class="navbar-item" to="/admin/settings/temperatures">
                Shipping Temperatures
              </nuxt-link>
              <nuxt-link class="navbar-item" to="/admin/settings/zones">
                Shipping Zones
              </nuxt-link>
              <nuxt-link class="navbar-item" to="/admin/settings/config">
                Configuration
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>

      <div class="navbar-end" v-if="getAuth">
        <div class="navbar-item">
          <div class="field is-grouped">
            <b-dropdown hoverable>
              <button class="button is-info" slot="trigger">
                <b-icon icon="account-circle"></b-icon>
                <span>Account</span>
              </button>
              <b-dropdown-item>Account info</b-dropdown-item>
              <b-dropdown-item v-on:click="logout()">Logout</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </nav>
    <main role="main">
      <nuxt/>
    </main>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>Key2Publish Webshop made for ITK Diagnostics B.V. </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  // import Cookies from 'js-cookie'

  export default {
    middleware: [ 'reloadCookie', 'auth' ],
    data () {
      return {
        showNav: false
      }
    },
    methods: {
      collapse () {
        this.showNav = !this.showNav
      },
      async logout () {
        try {
          await this.$store.dispatch('logout')
          this.$router.replace({ path: '/admin' })
        } catch (e) {
          this.formError = e.message
        }
      },
      async checkJWT () {
        await this.$store.dispatch('checkJWT', {
          token: this.$store.state.authUser.jwt
        })
      }
    },
    computed: {
      getAuth: function () {
        return this.$store.state.authUser
      }
    }
  }
</script>

<style>

</style>
