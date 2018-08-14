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
        message: 'You have cancelled the payment of your order. The order was not placed. We have preserved your cart, so you may continue your order.'
      }
    }
  }
</script>
