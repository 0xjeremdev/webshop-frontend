<template>
  <section>
    <div class="columns">
      <div class="column">
        <br/>
      <Banner></Banner>
      </div>
      <div class="column">
        <search :expanded="true"></search>
        <br/>
        <contactinfo :info="info"></contactinfo>
        <social></social>
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
