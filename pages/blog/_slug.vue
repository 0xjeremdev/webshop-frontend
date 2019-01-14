<template>
  <section class="section">
    <div class="container">
      <h1 class="title">{{ content.title }}</h1><br />
      <div v-html="content.article"></div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        slug: this.$route.params.index,
        content: {
          title: '',
          article: '',
          author: '',
          publish_date: ''
        },
        info: {}
      }
    },
    head () {
      return {
        title: `${this.content.title} | LabNed.com - Exploring Possibilities`,
        meta: [
          { hid: 'description', name: 'description', content: `${this.content.seo.meta_description}` },
          { hid: 'web_author', name: 'web_author', content: `${this.content.seo.meta_author}` },
          { hid: 'keywords', name: 'keywords', content: `${this.content.seo.meta_keywords}` },
          { hid: 'robots', name: 'robots', content: 'index, follow' },
          { hid: 'revisit-after', name: 'revisit-after', content: '1 day' }
        ]
      }
    },
    async asyncData ({ store, params, error, app: { $axios } }) {
      let info = ''
      await store.dispatch('getSettings')
      info = store.state.settings
      if (info.maintenance === true) error({ statusCode: 503, message: 'Maintenance is under way. Please check our site at a later date.' })

      let content = {}
      let { data } = await $axios.get(store.state.apiUrl + '/blog/' + params.slug)
      console.log(data.result['_result'])
      if (data['result'] !== undefined && data['result']['_result'].length > 0) content = data['result']['_result'][0]
      if (data['result'] === undefined || data['result']['_result'].length <= 0) error({'statusCode': 404, 'message': 'Page Not Found'})
      return {
        content: content,
        info: info
      }
    },
    async mounted () {
      // await this.getPage()
    },
    methods: {
      async getPage () {
        try {
          // get page data here
          let data = await this.$axios.$get(this.$store.state.apiUrl + '/page/' + this.slug)
          console.log(data)
          if (data['result']['_result'].length > 0) this.content = data['result']['_result'][0]
          if (data['result']['_result'].length <= 0) this.$root.error({'statusCode': 404, 'message': 'Page Not Found'})
        } catch (e) {
          this.$root.error({'statusCode': 404, 'message': 'Page Not Found'})
          console.log(e)
        }
      }
    }
  }
</script>

<style scoped>
  .control ul li {
    list-style: disc;
  }

  ul {
    list-style: disc;
  }

  li {
    list-style: disc;
  }
</style>
