<template>
  <section class="section my_section">
    <div class="container">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li v-for="(val, key) in breadcrumb" :class="(key+1 === breadcrumb.length) ? 'is-active' : ''" :aria-current="(key+1 === breadcrumb.length) ? 'page' : ''">
            <nuxt-link :to="breadcrumbLinks[key]" :key="key">
              <!-- {{ val.charAt(0).toUpperCase() }}{{ val.slice(1) }} -->
              {{ val.charAt(0).toUpperCase() }}{{ val.slice(1).replace(/-+/g,' ') }}
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script>
  import search from '~/components/widgets/search.vue'

  export default {
    components: { search },
    props: {
      info: String
    },
    data () {
      return {
        breadcrumb: ['Home'],
        breadcrumbLinks: ['/']
      }
    },
    created () {
      this.getBreadCrumb()
    },
    methods: {
      getBreadCrumb () {
        let myPath = this.$route.path.split('/') // '/product/test/4/aog/55'.split('/')
        let before = []
        myPath.forEach(x => {
          if (x !== '') {
            this.breadcrumb.push(x)
            this.breadcrumbLinks.push(before.join('/') + '/' + x)
            before.push(x)
          }
        })
        if (this.info !== undefined && this.info !== null && this.info !== '') {
          this.breadcrumb.pop()
          this.breadcrumbLinks.pop()
          before.pop()
          this.breadcrumb.push(this.info)
          this.breadcrumbLinks.push(before.join('/') + '/' + this.info)
          before.push(this.info)
        }
      }
    }
  }
</script>

<style>
  .my_section {
    padding-bottom: 0px;
    padding-top: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .my_crumb {
    font-size: 10px;
  }
</style>
