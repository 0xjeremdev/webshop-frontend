<template>
    <div class="container">
      <div class="content has-text-centered">
        <b-icon
            icon="alert"
            size="is-large">
        </b-icon>
        <h1 v-if="error.statusCode === 404">Page not found</h1>
        <h1 v-else>An error occurred</h1>
        <nuxt-link to="/">Home</nuxt-link>
      </div>
    </div>
</template>

<script>
  export default {
    head () {
      return {
        title: 'Error page',
        meta: [
          { hid: 'error-description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    props: ['error'],
    layout: 'temperror'
  }
</script>
