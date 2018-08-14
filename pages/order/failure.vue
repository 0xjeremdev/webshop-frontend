<template>
  <section class="section">
    <div class="container">
      <h1 class="subtitle">{{ message }}</h1>
    </div>
  </section>
</template>

<script>
  export default {
    middleware: 'authCustomer',
    data () {
      return {
        message: 'Order was not placed succesfully, you may try again or contact us if you need any support purchasing.'
      }
    }
  }
</script>
