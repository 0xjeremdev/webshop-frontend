<template>
  <section id="dashboard" class="section">
    <div class="container">
      <h1>dashboard</h1>
      <button v-on:click="testMethod()">Test Button</button>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'admin',
  methods: {
    testMethod: function () {
      console.log(this.$route.path().startsWith('/admin'))
    }
  }
}
</script>
