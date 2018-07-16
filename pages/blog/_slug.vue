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
        }
      }
    },
    async asyncData ({ store, params, error, app: { $axios } }) {
      let content = {}
      let { data } = await $axios.get(store.state.apiUrl + '/blog/' + params.slug)
      console.log(data.result['_result'])
      if (data['result'] !== undefined && data['result']['_result'].length > 0) content = data['result']['_result'][0]
      if (data['result'] === undefined || data['result']['_result'].length <= 0) error({'statusCode': 404, 'message': 'Page Not Found'})
      return {
        content: content
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
