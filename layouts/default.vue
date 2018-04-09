<template>
  <div id="#itkdiagnostics" class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">
          <img src="http://www.labned.com/images/I/xLabNed,P20logo,P202.0.fw.png.pagespeed.ic.lNHYz6ertB.webp" alt="ITK Diagnostics B.V." width="auto" height="28px">
        </nuxt-link>
        <button v-on:click="collapse" class="button navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div id="navBarAdmin" class="navbar-menu" :class="{ 'is-active': showNav }">
        <div class="navbar-start">
          <nuxt-link class="navbar-item" to="/admin/dashboard">
            Home
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/product">
            Products
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/product">
            Protocols
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/product">
            About Us
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/product">
            Downloads
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/product">
            Distributors
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/product">
            Contact Us
          </nuxt-link>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <cartWidgets></cartWidgets>
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
  export default {
    created () {
      this.$store.dispatch('connectDB')
    },
    components: { cartWidgets, breadCrumb, search },
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
      }
    }
  }
</script>
