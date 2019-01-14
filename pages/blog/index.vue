<template>
  <section class="section">
    <h1 class="title">Blog List</h1>
    <article class="media" v-for="(value, index) in blogList">
      <div class="media-content">
        <div class="content">
          <h2 class="subtitle"><nuxt-link :to="'/blog/' + value.seo.url_slug">{{ value.title }}</nuxt-link></h2></div>
          <div><em>Published on: {{ value.publish_date }}</em></div>
          <div>{{ value.article }}</div>
        </div>
      </div>
    </article>
    <b-pagination
      :total="total"
      :simple="isSimple"
      :rounded="isRounded"
      :current.sync="current"
      :per-page="perPage"
      @change="nextBlog">
    </b-pagination>
  </section>
</template>

<script>
  import { timeConverter, limitContent } from '~/utils/utils'
  import striptags from 'striptags'

  export default {
    head () {
      return {
        title: 'Blog | LabNed.com - Exploring Possibilities',
        meta: [
          { hid: 'web_author', name: 'web_author', content: `${this.info.seo_author}` },
          { hid: 'keywords', name: 'keywords', content: `${this.info.seo_keywords}` },
          { hid: 'robots', name: 'robots', content: 'index, follow' },
          { hid: 'revisit-after', name: 'revisit-after', content: '1 day' }
        ]
      }
    },
    data () {
      return {
        blogList: {},
        current: 1,
        perPage: 10,
        total: 0,
        isSimple: false,
        isRounded: false
      }
    },
    async asyncData ({ store, route, error, app: { $axios } }) {
      let info = ''
      await store.dispatch('getSettings')
      info = store.state.settings
      if (info.maintenance === true) error({ statusCode: 503, message: 'Maintenance is under way. Please check our site at a later date.' })

      let blogList
      let page = (route.query.page !== undefined) ? route.query.page : 1
      let { data } = await $axios.get(store.state.apiUrl + '/blog?page=' + page + '&limit=10')
      if (data['result'] !== undefined && data['result']['_result'].length > 0) {
        blogList = data['result']['_result']
        for (let v = 0; v < blogList.length; v++) {
          blogList[v].publish_date = timeConverter(blogList[v].publish_date)
          blogList[v].article = limitContent(striptags(blogList[v].article))
        }
      }
      let total = data.result.extra.stats.fullCount

      if (data['result'] === undefined || data['result']['_result'].length <= 0) error({'statusCode': 404, 'message': 'Page Not Found'})

      return {
        blogList: blogList,
        total: total,
        perPage: 10,
        current: 1,
        info: info
      }
    },
    methods: {
      async nextBlog (number) {
        // console.log(number)
        this.current = number
        // console.log(this.$route.path)
        // let params = this.$route.query
        let newRoute = this.$route.path + '?page=' + number
        this.$router.push(newRoute)
        // this.$route.query.page = number
        await this.getBlog(number)
      },
      async getBlog (number) {
        try {
          let blogList
          let { data } = await this.$axios.get(this.$store.state.apiUrl + '/blog?page=' + number.toString() + '&limit=' + this.perPage)

          if (data['result'] !== undefined && data['result']['_result'].length > 0) {
            blogList = data['result']['_result']
            for (let v = 0; v < blogList.length; v++) {
              blogList[v].publish_date = timeConverter(blogList[v].publish_date)
              blogList[v].article = limitContent(striptags(blogList[v].article))
            }
          }

          if (data['result'] === undefined || data['result']['_result'].length <= 0) this.$root.error({'statusCode': 404, 'message': 'Page Not Found'})
          this.blogList = blogList
        } catch (e) {
          console.log(e)
          this.$root.error({'statusCode': 404, 'message': 'Page Not Found'})
        }
      }
    }
  }
</script>
