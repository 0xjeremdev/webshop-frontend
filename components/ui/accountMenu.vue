<template>
  <aside class="menu">
    <p class="menu-label">
      Account
    </p>
    <ul class="menu-list">
      <li><nuxt-link to="/account" :class="(link === 'account') ? 'is-active' : ''">Account</nuxt-link></li>
      <li><nuxt-link to="/account/personal" :class="(link === 'personal') ? 'is-active' : ''">Personal Info</nuxt-link></li>
      <li><nuxt-link to="/account/delivery" :class="(link === 'delivery') ? 'is-active' : ''">Delivery Address</nuxt-link></li>
      <li><nuxt-link to="/account/order" :class="(link === 'orders') ? 'is-active' : ''">Orders</nuxt-link></li>
      <li><nuxt-link to="/account/quote" :class="(link === 'quotes') ? 'is-active' : ''">Quotes</nuxt-link></li>
    </ul>
  </aside>
</template>

<script>
  export default {
    props: ['link']
  }
</script>
