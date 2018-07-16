<template>
  <section class="section">
    <h1 class="title">Blog List</h1>
    <article class="media" v-for="(value, index) in blogList">
      <figure class="media-left">
        <div class="image is-64x64">
          <img src="https://bulma.io/images/placeholders/128x128.png">
        </div>
      </figure>
      <div class="media-content">
        <div class="content">
          <h2 class="subtitle">{{ value.title }}</h2>
          <em>Published on: {{ value.publish_date }}</em>
          <div>{{ value.article }}</div>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
  import { timeConverter, limitContent } from '~/utils/utils'
  import striptags from 'striptags'

  export default {
    data () {
      return {
        blogList: {}
      }
    },
    async asyncData ({ store, error, app: { $axios } }) {
      let blogList
      let { data } = await $axios.get(store.state.apiUrl + '/blog')
      if (data['result'] !== undefined && data['result']['_result'].length > 0) {
        blogList = data['result']['_result']
        for (let v = 0; v < blogList.length; v++) {
          console.log(v)
          blogList[v].publish_date = timeConverter(blogList[v].publish_date)
          blogList[v].article = limitContent(striptags(blogList[v].article))
        }
      }
      if (data['result'] === undefined || data['result']['_result'].length <= 0) error({'statusCode': 404, 'message': 'Page Not Found'})
      return {
        blogList: blogList
      }
    }
  }
</script>
