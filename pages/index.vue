<template>
  <section class="section-alt">
    <div class="columns">
      <div class="column my-column">
        <Banner type="banner"></Banner>
      </div>
      <div class="column my-column">
        <div class="columns section-alt">
          <div class="column notification is-orange">
            <search :expanded="true" :size="'is-medium'"></search>
          </div>
        </div>
        <Banner type="banner2"></Banner>
        <Banner type="paymentlogos"></Banner>
      </div>
    </div>
  </section>
</template>

<script>
  import Banner from '~/components/widgets/banner.vue'
  import Search from '~/components/widgets/search.vue'
  import Contactinfo from '~/components/widgets/contactinfo.vue'

  export default {
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities'
      }
    },
    components: { Banner, Search, Contactinfo },
    data () {
      return {

      }
    },
    async asyncData ({ store, error }) {
      let info = ''
      await store.dispatch('getSettings')
      info = store.state.settings
      if (info.maintenance === true) error({ statusCode: 503, message: 'Maintenance is under way. Please check our site at a later date.' })
      return { info: info }
    }
  }
</script>

<style scoped>
  .section-alt {
    padding: 0.75em;
  }

  .my-column {
    padding: 0em;
  }
</style>
