<template>
  <section v-if="info instanceof Object">
    <table class="table is-fullwidth">
      <tbody>
        <tr><td class="my-title" colspan="4"><h1 class="subtitle my-white">Contact info {{ info.contact_name }}</h1></td></tr>
        <tr>
          <td class="th-wrap"><strong>Address:</strong></td>
          <td>
            {{ info.contact_street }} {{ info.contact_houseno }}<br />
            {{ info.contact_postcode }} {{ info.contact_city }} {{ info.contact_country }}
          </td>
          <td class="th-wrap"><strong>VAT No:<br/>COC No.:</strong></td>
          <td>{{ info.contact_vatno }}<br/>{{ info.contact_cocno }}</td>
        </tr>
        <tr>
          <td class="th-wrap"><strong>CALL US:</strong><br/>International:<br/><strong>Email:</strong></td>
          <td>{{ info.contact_phone }}<br/>{{ info.contact_phone_int }}<br/><a :href="'mailto:' + info.contact_email">{{ info.contact_email }}</a></td>
          <td class="th-wrap"><strong>Bank:<br/>IBAN:<br/>BIC:</strong></td>
          <td>{{ info.contact_bank }}<br/>{{ info.contact_IBAN }}<br/>{{ info.contact_BIC }}</td>
        </tr>
      </tbody>
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

<style scoped>
  .my-title {
    padding: 0.5rem;
    margin-top: 0.5rem;
    background-color: #025689;
    color: white;
    /* text-shadow: 2px 2px 4px #000000; */
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  .my-white {
    color: white;
  }
</style>
