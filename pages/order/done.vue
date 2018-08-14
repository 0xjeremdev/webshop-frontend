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
        message: 'ORDER PLACED SUCCESFULLY'
      }
    },
    asyncData ({ store, route, params }) {
      try {
        console.log(params)
        store.dispatch('order/placeOrder', { status: 'Payment Received' }, { root: true })
        store.commit('cart/SET_CART', [])
        return { message: 'ORDER PLACED SUCCESFULLY' }
      } catch (e) {
        console.log(e)
        return { message: 'Failed to place your order, please contact our support' }
      }
    }
  }
</script>
