<template>
  <section>
    <div class="columns">
      <div class="column">
        <br/>
      <Banner></Banner>
      </div>
      <div class="column">
        <search :expanded="true"></search>
        <contactinfo :info="info"></contactinfo>
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
    async asyncData () {
      let info = ''
      return { info: info }
    }
  }
</script>
