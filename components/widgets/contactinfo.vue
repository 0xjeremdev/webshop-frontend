<template>
  <section class="section">
    <h1 class="subtitle">{{ info.contact_name }}</h1>
    <table class="table">
      <tr>
        <td class="th-wrap"><strong>Address:</strong></td>
        <td>{{ info.contact_street }}</td>
      </tr>
    </table>
  </section>
</template>

<script>
  export default {
    template: '#grid-template',
    props: {
      info: Object
    }
  }
</script>
