<template>
  <section>
    <div class="columns">
      <div class="column">
        <br/>
      <Banner></Banner>
      </div>
      <div class="column">
        <search :expanded="true"></search>
      </div>
    </div>
  </section>
</template>

<script>
  import Banner from '~/components/widgets/banner.vue'
  import Search from '~/components/widgets/search.vue'

  export default {
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities'
      }
    },
    components: { Banner, Search },
    data () {
      return {

      }
    }
  }
</script>
