<template>
  <section class="section">
    <breadCrumb></breadCrumb>
    <page :slug="url_slug"></page>
  </section>
</template>

<script>
  import page from '~/components/ui/page.vue'
  import breadCrumb from '~/components/widgets/breadcrumb.vue'

  export default {
    components: { page, breadCrumb },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Protocols'
      }
    },
    data () {
      return {
        url_slug: 'protocols'
      }
    }
  }
</script>
