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
          article: ''
        }
      }
    },
    head () {
      return {
        title: `${this.content.title} | LabNed.com - Exploring Possibilities`
      }
    },
    async asyncData ({ store, params, error, app: { $axios } }) {
      try {
        let data = await $axios.$get(store.state.apiUrl + '/page/' + params.index)
        console.log(data)
        if (data['result']['_result'].length > 0) return { content: data['result']['_result'][0] }
        if (data['result']['_result'].length <= 0) error({'statusCode': 404, 'message': 'Page Not Found'})
      } catch (e) {
        console.log(e)
        error({ 'statusCode': 404, 'message': 'Page Not Found' })
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

  h1 {
    display: block;
    font-size: 2em;
    -webkit-margin-before: 0.67em;
    -webkit-margin-after: 0.67em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    font-weight: bold;
  }

  h2 {
      display: block;
      font-size: 1.5em;
      -webkit-margin-before: 0.83em;
      -webkit-margin-after: 0.83em;
      -webkit-margin-start: 0px;
      -webkit-margin-end: 0px;
      font-weight: bold;
  }

  h3 {
    display: block;
    font-size: 1.17em;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    font-weight: bold;
  }

  h4 {
      display: block;
      -webkit-margin-before: 1.33em;
      -webkit-margin-after: 1.33em;
      -webkit-margin-start: 0px;
      -webkit-margin-end: 0px;
      font-weight: bold;
  }

  h5 {
    display: block;
    font-size: 0.83em;
    -webkit-margin-before: 1.67em;
    -webkit-margin-after: 1.67em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    font-weight: bold;
  }

  h6 {
    display: block;
    font-size: 0.67em;
    -webkit-margin-before: 2.33em;
    -webkit-margin-after: 2.33em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    font-weight: bold;
  }

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
