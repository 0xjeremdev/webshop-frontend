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
    created () {
      this.$router.replace({ path: '/order/success', replace: true })
    },
    async asyncData ({ store, route, app: { $cookies } }) {
      try {
        store.commit('order/SET_ADDRESS', $cookies.get('key2publish').order.address)
        store.commit('order/SET_BILLING', $cookies.get('key2publish').order.billing)
        store.commit('order/SET_CUSTOMER', $cookies.get('key2publish').order.customer)
        store.dispatch('getSettings')
        console.log(store.state.order.address)
        let cart = store.state.cart.cartContents
        await store.dispatch('cart/getProductForCart', { cart: cart }, { root: true })
        let condition = 'RT'
        cart = store.state.cart.cartContents
        for (let v = 0; v < cart.length; v++) {
          if (cart[v]['shipping'] === 'DRY ICE') {
            condition = cart[v]['shipping']
            break
          }
          if (cart[v]['shipping'] === 'ICE') {
            condition = cart[v]['shipping']
          }
        }
        // let costs = await store.dispatch('order/getShippingCosts', { condition: condition }, { root: true })
        let zonecosts = await store.dispatch('order/getZoneCosts', { cc: store.state.order.address.country }, { root: true })
        // console.log(zonecosts['result']['_result'])
        zonecosts = zonecosts['result']['_result'][0]['price'][condition]
        // console.log(parseFloat(zonecosts))
        // if (zonecosts['result'] !== undefined && zonecosts['result']['_result'].length > 0) zonecosts = zonecosts['result']['_result'][0]
        // if (zonecosts['result'] === undefined || zonecosts['result']['_result'].length <= 0) error({ 'statusCode': 500, 'message': 'An unexpected error occured' })
        var subtotal = 0
        for (let key in cart) {
          subtotal += parseFloat(cart[key].price) * Number(cart[key].amount)
        }
        let shippingcosts = parseFloat(zonecosts)
        let shippingtotal = subtotal + shippingcosts
        let vatamount = (store.state.settings.VAT / 100) * shippingtotal
        let total = shippingtotal + vatamount
        let orderData = {
          status: 'Payment Received',
          total: total,
          vatamount: vatamount,
          shippingtotal: shippingtotal,
          shippingcosts: shippingcosts,
          subtotal: subtotal,
          vat: store.state.settings.VAT
        }
        console.log(orderData)
        store.dispatch('order/placeOrder', { orderData: orderData }, { root: true })
        store.commit('cart/SET_CART', [])
        return { message: 'ORDER PLACED SUCCESFULLY' }
      } catch (e) {
        console.log(e)
        return { message: 'Failed to place your order, please contact our support' }
      }
    }
  }
</script>
