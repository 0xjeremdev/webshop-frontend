<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Request of account removal received</h1>
      <p>Request of removal of your account has been received. It may take up to five work days before your account has been removed of our system. You will receive an e-mail when your account has been succesfully removed.</p>
    </div>
  </section>
</template>

<script>
  export default {
    async asyncData ({ error, store }) {
      try {
        let data = await store.dispatch('account/deleteAccount')
        if (!data) {
          error({ 'statusCode': 500, 'message': 'Unexpected Error occured, please contact our support team to delete your account' })
        }
        if (data) {
          await store.dispatch('logout')
        }
      } catch (e) {
        console.log(e)
        error({ 'statusCode': 500, 'message': 'Unexpected Error occured, please contact our support team to delete your account' })
      }
    }
  }
</script>
