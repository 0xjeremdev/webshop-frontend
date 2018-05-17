<template>
  <section>
    <div class="columns is-mobile">
      <div class="column">
        <br/>
      <Banner></Banner>
      </div>
      <div class="column is-one-third is-primary">
        <br />
        Other widgets
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
