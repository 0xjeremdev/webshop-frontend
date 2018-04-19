<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Order</h1>
      <orderMenu step="2"></orderMenu>
    </div>
  </section>
</template>

<script>
  import orderMenu from '~/components/ui/orderMenu.vue'

  export default {
    components: { orderMenu }
  }
</script>
