<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Order - Billing Address</h1>
      <orderMenu :step="step"></orderMenu>
      <!-- step 2: if logged in show dropdown boxes with billing and delivery address go to step 4 -->
      <div v-if="loggedIn" class="container">
        <br />
        <b-field>
          <b-checkbox v-model="deliverySame" :native-value="!deliverySame" class.native="is-success">
            <!--<b-icon :icon="(deliverySame) ? 'check' :'close'"></b-icon>-->
            <span>Billing address is the same as Delivery Address</span>
          </b-checkbox>
        </b-field>
        <b-field grouped>
          <b-field label="Street" expanded :type="(typeof message.formStreet !== 'undefined' && message.formStreet !== '') ? 'is-danger' : ''" :message="message.formStreet">
              <b-input v-model="formStreet" autocomplete="street" placeholder="Street" @blur="validate($event.srcElement.value, 'formStreet', 'field')"></b-input>
          </b-field>
          <b-field label="House No." :type="(typeof message.formHouseNo !== 'undefined' && message.formHouseNo !== '') ? 'is-danger' : ''" :message="message.formHouseNo">
              <b-input v-model="formHouseNo" autocomplete="houseno" placeholder="House No." @blur="validate($event.srcElement.value, 'formHouseNo', 'field')"></b-input>
          </b-field>
        </b-field>
        <b-field grouped>
          <b-field label="Postcode" :type="(typeof message.formPostcode !== 'undefined' && message.formPostcode !== '') ? 'is-danger' : ''" :message="message.formPostcode">
              <b-input v-model="formPostcode" autocomplete="postcode" placeholder="Postcode" @blur="validate($event.srcElement.value, 'formPostcode', 'field')"></b-input>
          </b-field>
          <b-field label="City" expanded :type="(typeof message.formCity !== 'undefined' && message.formCity !== '') ? 'is-danger' : ''" :message="message.formCity">
              <b-input v-model="formCity" autocomplete="city" placeholder="City" @blur="validate($event.srcElement.value, 'formCity', 'field')"></b-input>
          </b-field>
        </b-field>
        <b-field label="Country" :type="(typeof message.formCountry !== 'undefined' && message.formCountry !== '') ? 'is-danger' : ''" :message="message.formCountry">
          <b-select expanded placeholder="Select your Country">
            <option
              v-for="option in countryList"
              :value="option.name"
              :key="option.code"
              v-model="formCountry">
              {{ option.name }}
            </option>
          </b-select>
        </b-field>
        <div v-if="!deliverySame">
          <hr/>
          <h1 class="title">Delivery Address</h1>
          <b-field grouped>
            <b-field label="Street" expanded :type="(typeof message.formDeliveryStreet !== 'undefined' && message.formDeliveryStreet !== '') ? 'is-danger' : ''" :message="message.formDeliveryStreet">
                <b-input v-model="formDeliveryStreet" autocomplete="street" placeholder="Street" @blur="validate($event.srcElement.value, 'formDeliveryStreet', 'field')"></b-input>
            </b-field>
            <b-field label="House No." :type="(typeof message.formDeliveryHouseNo !== 'undefined' && message.formDeliveryHouseNo !== '') ? 'is-danger' : ''" :message="message.formDeliveryHouseNo">
                <b-input v-model="formDeliveryHouseNo" autocomplete="houseno" placeholder="House No." @blur="validate($event.srcElement.value, 'formDeliveryHouseNo', 'field')"></b-input>
            </b-field>
          </b-field>
          <b-field grouped>
            <b-field label="Postcode" :type="(typeof message.formDeliveryPostcode !== 'undefined' && message.formDeliveryPostcode !== '') ? 'is-danger' : ''" :message="message.formDeliveryPostcode">
                <b-input v-model="formDeliveryPostcode" autocomplete="postcode" placeholder="Postcode" @blur="validate($event.srcElement.value, 'formDeliveryPostcode', 'field')"></b-input>
            </b-field>
            <b-field label="City" expanded :type="(typeof message.formDeliveryCity !== 'undefined' && message.formDeliveryCity !== '') ? 'is-danger' : ''" :message="message.formDeliveryCity">
                <b-input v-model="formDeliveryCity" autocomplete="city" placeholder="City" @blur="validate($event.srcElement.value, 'formDeliveryCity', 'field')"></b-input>
            </b-field>
          </b-field>
          <b-field label="Country" :type="(typeof message.formCountry !== 'undefined' && message.formCountry !== '') ? 'is-danger' : ''" :message="message.formCountry">
            <b-select expanded placeholder="Select your Country">
              <option
                v-for="option in countryList"
                :value="option.name"
                :key="option.code"
                v-model="formCountry">
                {{ option.name }}
              </option>
            </b-select>
          </b-field>
        </div>
      </div>
      <!-- step 2: if not logged in show billing address form go to step 3
      // step 3: show delivery address
      // step 4: show payment OPTIONS
      // step 5: overview of the order and confirmation to place the order -->
      <div v-else class="container">

      </div>
      <br />
      <br />
      <div class="columns">
        <div class="column is-one-fifth has-text-right">
          <nuxt-link to="/order"><button class="button is-orange">Previous</button></nuxt-link>
        </div>
        <div class="column">
        </div>
        <div class="column is-one-fifth">
          <nuxt-link to="/order/step3"><button class="button is-orange">Next</button></nuxt-link>
        </div>
      </div>
      <b-loading :active.sync="isFetching" :canCancel="true"></b-loading>
    </div>
  </section>
</template>

<script>
  import orderMenu from '~/components/ui/orderMenu.vue'

  export default {
    components: { orderMenu },
    created () {
      this.getCountryList()
    },
    data () {
      return {
        isFetching: false,
        step: '2',
        loggedIn: true,
        deliverySame: true,
        formStreet: '',
        formHouseNo: '',
        formPostcode: '',
        formCity: '',
        formCountry: '',
        formDeliveryStreet: '',
        formDeliveryHouseNo: '',
        formDeliveryPostcode: '',
        formDeliveryCity: '',
        formDeliveryCountry: '',
        countryList: {},
        message: {}
      }
    },
    methods: {
      async validate (value, fld, type) {
        let messages = this.message
        switch (type) {
          case 'email':
            messages[fld] = await this.$store.dispatch('validation/validateMail', { value: value })
            break
          case 'password':
            messages[fld] = await this.$store.dispatch('validation/validatePassword', { value: value })
            break
          case 'repeatPassword':
            messages[fld] = await this.$store.dispatch('validation/validateRepeatPassword', { value: value, repeat: this.formPassword })
            break
          case 'select':
            messages[fld] = await this.$store.dispatch('validation/validateSelect', { value: value })
            break
          default:
            messages[fld] = await this.$store.dispatch('validation/validateField', { value: value })
            break
        }

        this.message = '' // hack to let two way binding work if a key in an object has changed
        this.message = messages
        this[fld] = value
      },
      async getCountryList () {
        let countryList = await this.$store.dispatch('order/getCountryList', {}, { root: true })
        // console.log(countryList)
        this.countryList = countryList
      }
    }
  }
</script>
