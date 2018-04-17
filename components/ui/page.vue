<template>
  <section class="section">
    <div class="container">
      <h1 class="title"></h1><br />
      {{ page }}
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        page: ''
      }
    },
    created () {
      this.getPage()
    },
    methods: {
      async getPage () {
        // get page data here
      }
    }
  }
</script>
