<template>
  <div id="#labned" class="container">
    <div class="is-flex-mobile">
      <div class="columns">
        <div class="column">
          <nuxt-link to="/">
            <img src="/images/xLabNed,P20logo,P202.0.fw.png.pagespeed.ic.1gJ-QNfrLx.png" alt="LabNed.com" width="auto" height="74px">
          </nuxt-link>
        </div>
        <div class="column">
          <div class="field is-grouped is-pulled-right my-margins">
            <social></social>
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
          <nuxt-link class="navbar-item" to="/">
            <span class="icon">
              <i class="mdi mdi-home-outline"></i>
            </span>
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/search">
            Products
          </nuxt-link>

          <nuxt-link class="navbar-item" v-for="value in navbarLinks" :key="value.seo.url_slug" :to="'/cms/' + value.seo.url_slug">
            {{ value.title }}
          </nuxt-link>
          <!--
          <nuxt-link class="navbar-item" to="/about-us">
            About Us
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/downloads">
            Downloads
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/distributors">
            Distributors
          </nuxt-link> -->
          <nuxt-link class="navbar-item" to="/blog">
            Blog
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/contact">
            Contact
          </nuxt-link>
        </div>
      </div>
    </nav>
    <main role="main">
      <cookiewall></cookiewall>
      <br/>
      <search v-if="$route.path !== '/'" :expanded="true"></search>
      <nuxt/>
    </main>
    <footer class="footer my-paddings">
      <div class="columns">
        <div class="column">© LabNed.com {{ new Date().getFullYear() }}</div>

        <div v-if="footerLinks.length > 0" class="column is-two-thirds has-text-centered">
          <span>
            <div class="navbar-item has-dropdown is-hoverable footer-item">
              <div class="navbar-dropdown is-boxed" :class="{ 'displayed': showAssortimant }">
                <nuxt-link v-for="c in category" :key="c.basic.name" class="navbar-item" :to="'/category/' + c.basic.name" v-if="c.basic.name == 'Primary Antibodies'">
                  {{ c.basic.name }}
                </nuxt-link>
                <nuxt-link v-for="c in category" :key="c.basic.name" class="navbar-item" :to="'/category/' + c.basic.name" v-if="c.basic.name == 'Secondary Antibodies'">
                  {{ c.basic.name }}
                </nuxt-link>
                <nuxt-link v-for="c in category" :key="c.basic.name" class="navbar-item" :to="'/category/' + c.basic.name" v-if="c.basic.name == 'Immunoassays'">
                  {{ c.basic.name }}
                </nuxt-link>
                <nuxt-link v-for="c in category" :key="c.basic.name" class="navbar-item" :to="'/category/' + c.basic.name" v-if="c.basic.name == 'DNA & RNA Purification Kitss'">
                  {{ c.basic.name }}
                </nuxt-link>
                <nuxt-link v-for="c in category" :key="c.basic.name" class="navbar-item" :to="'/category/' + c.basic.name" v-if="c.basic.name == 'Peptides & (rec.) Proteins'">
                  {{ c.basic.name }}
                </nuxt-link>
                <nuxt-link v-for="c in category" :key="c.basic.name" class="navbar-item" :to="'/category/' + c.basic.name" v-if="c.basic.name == 'Controls, Slides & Lysates'">
                  {{ c.basic.name }}
                </nuxt-link>
                <nuxt-link v-for="c in category" :key="c.basic.name" class="navbar-item" :to="'/category/' + c.basic.name" v-if="c.basic.name == 'Consumables & Misc.'">
                  {{ c.basic.name }}
                </nuxt-link>
                <nuxt-link v-for="c in category" :key="c.basic.name" class="navbar-item" :to="'/category/' + c.basic.name" v-if="checkIncludes(c.basic.name)">
                  {{ c.basic.name }}
                </nuxt-link>
              </div>
              <nuxt-link to="/search" v-if="category" class="has-dropdown is-hoverable">Product range
              </nuxt-link>
              <button class="button navbar-burger footer-burger" v-on:click="footerBurgerClicked()">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </span>

          <span v-for="value in footerLinks" :key="value.seo.url_slug">
            | <nuxt-link :to="'/cms/' + value.seo.url_slug">{{ value.title }}</nuxt-link>
          </span>
        </div>
        <div class="column has-text-right">Powered by <a href="https://www.key2publish.com/" target="_new">Key2Publish</a></div>
      </div>
    </footer>
  </div>
</template>

<script>
  import cartWidgets from '~/components/widgets/cart.vue'
  import cookiewall from '~/components/widgets/cookiewall.vue'
  import search from '~/components/widgets/search.vue'
  import social from '~/components/widgets/social.vue'
  import _ from 'lodash'

  export default {
    data () {
      return {
        showNav: false,
        footerLinks: this.$store.state.footerLinks,
        navbarLinks: this.$store.state.navbarLinks,
        category: this.$store.state.categories,
        categoryOrder: [ 'Primary Antibodies', 'Secondary Antibodies', 'Immunoassays', 'DNA & RNA Purification Kits', 'Peptides & (rec.) Proteins', 'Controls, Slides & Lysates', 'Consumables & Misc.' ],
        showAssortimant: false
      }
    },
    async asyncData ({ store, error, app: { $axios } }) {
      try {
        await store.dispatch('getSettings')
        if (store.state.settings.maintenance === true) error({ statusCode: 503, message: 'Maintenance is under way. Please check our site at a later date.' })

        return { settings: store.state.settings, footerLinks: store.state.footerLinks, navbarLinks: store.state.navbarLinks, category: store.state.categories }
      } catch (e) {
        console.log(e)
        error({ statusCode: 503, message: 'Maintenance is under way. Please check our site at a later date.' })
      }
    },
    scrollToTop: true,
    middleware: [ 'reloadCookie' ],
    components: { cartWidgets, cookiewall, search, social },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities'
      }
    },
    methods: {
      checkIncludes (value) {
        return !_.includes(this.categoryOrder, value)
      },
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
      },
      footerBurgerClicked () {
        this.showAssortimant = !this.showAssortimant
      }
    },
    computed: {
      getAuth: function () {
        return this.$store.state.account.token
      }
    },
    watch: {
      '$route.path': function () {
        this.showAssortimant = false
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

  .button.is-disabled {
    background-color: #d8c6b5;
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

  .footer-item {
    display: inline;
  }

  @media screen and (max-width: 1025px) {
    .navbar-dropdown.is-boxed {
      display: none;
    }

    .footer-burger, .footer-burger:hover, button.footer-burger:active {
      width: 10px;
      height: 10px;
      display: inline;
      padding-top: 10px;
      padding-bottom: 10px;
      top: 3px;
      border: 0;
      background-color: transparent;
    }

    .navbar-dropdown.is-boxed.displayed {
      display: block;
      transition: visibility 0s, opacity 0.5s linear;
    }

  }

  @media screen and (min-width: 1025px) {
    .navbar-dropdown.is-boxed {
      top: calc(100% + (-230px));
    }

    .footer-burger {
      display: none;
    }
  }
</style>
