<template>
  <page :slug="url_slug"></page>
</template>

<script>
  import page from '~/components/ui/page.vue'

  export default {
    components: { page },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Downloads'
      }
    },
    data () {
      return {
        url_slug: 'downloads'
      }
    }
  }
</script>
