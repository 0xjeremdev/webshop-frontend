<template>
  <section>
    <form action="" v-on:submit.prevent="sendContact()">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Inquire</p>
        </header>
        <section class="modal-card-body">
          <p>Please leave your email, so we can send the price of product no. {{ productid }} to you</p><br/>
          <b-field label="Email">
            <b-input
              type="email"
              v-model="email"
              placeholder="Your email"
              required>
            </b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="$parent.close()">Close</button>
          <button class="button is-primary" type="button" @click="doSend()">Send</button>
        </footer>
      </div>
    </form>
  </section>
</template>

<script>
  export default {
    props: {
      productid: ''
    },
    data () {
      return {
        email: ''
      }
    },
    methods: {
      async doSend () {
        try {
          if (this.$store.dispatch('validation/validateMail', { email: this.email })) {
            await this.$axios.$post(this.$store.state.apiUrl + '/product/inquire', { email: this.email, product: this.productid })
          }
          this.$parent.close()
          this.$toast.open('Request send')
        } catch (e) {
          console.log(e)
          this.$toast.open('Failed to deliver email')
        }
      }
    }
  }
</script>
