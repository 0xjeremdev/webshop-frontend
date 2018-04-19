<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="quotes"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Quotes</h1>
          <DataGridForOrder></DataGridForOrder>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import accountMenu from '~/components/ui/accountMenu.vue'
  import DataGridForOrder from '~/components/ui/DataGridForOrder.vue'

  export default {
    components: { accountMenu, DataGridForOrder },
    data () {
      return {
        newsletter: false
      }
    }
  }
</script>
