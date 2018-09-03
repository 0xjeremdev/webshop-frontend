<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="quotes"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Quote No: {{ quote.order_no }}</h1>
          <div>Quote Date: {{ dates.quote_date }}</div>
          <div>Quote is valid untill {{ dates.end_date }}</div>
          <div>You have {{ dates.differenceDays }} days till this quote expires</div>
          <br />
          <div class="columns">
            <div class="column is-one-third">
              <h2 class="subtitle">Quote send by</h2>
              <table class="table">
                <tbody>
                  <tr>
                    <th class="th-wrap">Name:</th>
                    <td>{{ quote.quote_by.title }} {{ quote.quote_by.firstname }} {{ quote.quote_by.lastname}}</td>
                  </tr>
                  <tr>
                    <th class="th-wrap">Gender:</th>
                    <td>{{ quote.quote_by.gender }}</td>
                  </tr>
                  <tr>
                    <th class="th-wrap">Company:</th>
                    <td>{{ quote.quote_by.company }}</td>
                  </tr>
                  <tr>
                    <th class="th-wrap">Phone:</th>
                    <td>{{ quote.quote_by.phone }} </td>
                  </tr>
                  <tr>
                    <th class="th-wrap">Mobile:</th>
                    <td>{{ quote.quote_by.mobile }}</td>
                  </tr>
                  <tr>
                    <th class="th-wrap">Fax:</th>
                    <td>{{ quote.quote_by.fax }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="column">
              <h2 class="subtitle">Products</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th class="th-wrap">ID</th>
                    <th class="th-wrap">Name</th>
                    <th class="th-wrap">Amount</th>
                    <th class="th-wrap">Price</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <td class="th-wrap"></td>
                    <td colspan="2" class="th-wrap has-text-right"><strong>Subtotal (ex. VAT):</strong></td>
                    <td class="th-wrap"><strong>€ {{ parseFloat(subtotal).toFixed(2) }}</strong></td>
                  </tr>
                </tfoot>
                <tbody>
                  <tr v-for="(value, index) in quote.items">
                    <td>{{ value.id }}</td>
                    <td>{{ value.name }}</td>
                    <td>{{ value.amount }}</td>
                    <td>€ {{ (parseFloat(value.price) * Number(value.amount)).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <button class="button is-primary" @click="doOrderQuote()">Order Quote</button>
        </div>
      </div>
    </div>
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  </section>
</template>

<script>
  import accountMenu from '~/components/ui/accountMenu.vue'

  export default {
    middleware: 'authCustomer',
    components: { accountMenu },
    data () {
      return {
        quote: {},
        isLoading: false
      }
    },
    async asyncData ({ store, params, app: { $axios, $cookies } }) {
      try {
        if (params.key !== undefined) {
          let quote = await $axios.$get(store.state.apiUrl + '/quote/' + params.key, { headers: { Authorization: `Bearer ${store.state.account.token.jwt}` } })
          let quoteResult = quote.result._result[0]
          var subtotal = 0
          for (let v = 0; v < quoteResult.items.length; v++) {
            console.log(quoteResult.items)
            subtotal += (parseFloat(quoteResult.items[v].price) * Number(quoteResult.items[v].amount))
          }
          let quoteDate = new Date(quoteResult.quote_date)
          var monthNums = [
            '01', '02', '03',
            '04', '05', '06', '07',
            '08', '09', '10',
            '11', '12'
          ]
          let endDate = new Date(quoteDate)
          endDate.setDate(endDate.getDate() + 30)
          var msDay = 60 * 60 * 24 * 1000
          var differenceDays = Math.floor((endDate - quoteDate) / msDay)

          var day = quoteDate.getDate()
          var monthIndex = monthNums[quoteDate.getMonth()]
          var year = quoteDate.getFullYear()
          quoteDate = year + '-' + monthIndex + '-' + day

          day = endDate.getDate()
          monthIndex = monthNums[endDate.getMonth()]
          year = endDate.getFullYear()
          endDate = year + '-' + monthIndex + '-' + day

          return { quote: quote.result._result[0], subtotal: subtotal, dates: { quote_date: quoteDate, end_date: endDate, differenceDays: differenceDays } }
        }

        return { quote: {}, subtotal: 0 }
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      doOrderQuote () {
        this.$store.commit('cart/SET_CART', this.quote.items)
        this.$store.commit('order/SET_ORDERNO', this.quote.order_no)
        this.$store.commit('order/SET_FROMQUOTE', true)
        this.$router.push('/order')
      }
    }
  }
</script>
