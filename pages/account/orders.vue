<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="orders"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Orders</h1>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import accountMenu from '~/components/ui/accountMenu.vue'

  export default {
    components: { accountMenu },
    data () {
      return {
        newsletter: false
      }
    }
  }
</script>
