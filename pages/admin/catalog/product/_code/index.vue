<template>
  <div>
    Test {{ $route.params.code }}
  </div>
</template>

<script>
  export default {
    layout: 'admin',
    validate ({ params }) {
      // Must be a number
      console.log(params)
      return params.code
    }
  }
</script>
