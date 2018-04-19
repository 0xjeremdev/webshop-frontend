<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="delivery"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Delivery</h1>
          <DataGrid></DataGrid>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import accountMenu from '~/components/ui/accountMenu.vue'
  import DataGrid from '~/components/ui/Datagrid'

  export default {
    components: { accountMenu, DataGrid },
    data () {
      return {
        newsletter: false
      }
    }
  }
</script>
