<template>
  <section class="section">
    <div class="container">
      <h1 class="title">{{ content.title }}</h1><br />
      <p class="control" v-html="content.article"></p>
    </div>
  </section>
</template>

<script>
  export default {
    props: [
      'slug'
    ],
    data () {
      return {
        content: {
          title: '',
          article: ''
        }
      }
    },
    mounted () {
      this.getPage()
    },
    methods: {
      async getPage () {
        try {
          // get page data here
          let data = await this.$axios.$get(this.$store.state.apiUrl + '/page/' + this.slug)
          if (data['result']['_result'].length > 0) this.content = data['result']['_result'][0]
        } catch (e) {
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
