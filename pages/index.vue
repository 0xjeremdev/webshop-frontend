<template>
  <section>
    <div class="columns">
      <div class="column">
        <br/>
      <Banner type="banner"></Banner>
      </div>
      <div class="column">
        <div class="columns">
          <div class="column is-three-quarters">
            <search :expanded="true"></search>
          </div>
          <div class="column">
            <social></social>
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
  import social from '~/components/widgets/social.vue'

  export default {
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities'
      }
    },
    components: { Banner, Search, Contactinfo, social },
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
