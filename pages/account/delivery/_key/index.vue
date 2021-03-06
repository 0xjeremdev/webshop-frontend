<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="delivery"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title"><span v-if="isNew">Add </span><span v-else>Edit </span>Delivery Address</h1>
          <form @submit.prevent="saveDelivery()">
            <b-field expanded label="Name"
            :type="(typeof message['name'] !== 'undefined' && message['name'] !== '') ? 'is-danger' : ''"
            :message="message['name']">
              <b-input v-model="address.name" autocomplete='name' placeholder="Name"></b-input>
            </b-field>
            <b-field expanded label="Company"
            :type="(typeof message['company'] !== 'undefined' && message['company'] !== '') ? 'is-danger' : ''"
            :message="message['company']">
              <b-input v-model="address.company" autocomplete='company' placeholder="company"></b-input>
            </b-field>
            <b-field expanded label="Department"
            :type="(typeof message['department'] !== 'undefined' && message['department'] !== '') ? 'is-danger' : ''"
            :message="message['department']">
              <b-input v-model="address.department" autocomplete='department' placeholder="Department"></b-input>
            </b-field>
            <b-field grouped>
              <b-field expanded label="Street"
              :type="(typeof message['street'] !== 'undefined' && message['street'] !== '') ? 'is-danger' : ''"
              :message="message['street']">
                <b-input v-model="address.street" autocomplete='street' placeholder="Street"></b-input>
              </b-field>
              <b-field label="No."
              :type="(typeof message['houseno'] !== 'undefined' && message['houseno'] !== '') ? 'is-danger' : ''"
              :message="message['houseno']">
                <b-input v-model="address.houseno" autocomplete='houseno' placeholder="House No."></b-input>
              </b-field>
            </b-field>
            <b-field grouped>
              <b-field label="Postal code"
              :type="(typeof message['postcode'] !== 'undefined' && message['postcode'] !== '') ? 'is-danger' : ''"
              :message="message['postcode']">
                <b-input v-model="address.postcode" autocomplete='postcode' placeholder="Postal code"></b-input>
              </b-field>
              <b-field expanded label="City"
              :type="(typeof message['city'] !== 'undefined' && message['city'] !== '') ? 'is-danger' : ''"
              :message="message['city']">
                <b-input v-model="address.city" autocomplete='city' placeholder="City"></b-input>
              </b-field>
            </b-field>
            <b-field label="Country"
              :type="(typeof message['country'] !== 'undefined' && message['country'] !== '') ? 'is-danger' : ''"
              :message="message['country']">
                <b-select v-model="address.country" expanded placeholder="Select a Country">
                    <option
                        v-for="option in countryList"
                        :value="option.code"
                        :key="option.code">
                        {{ option.name }}
                    </option>
                </b-select>
            </b-field>
            <b-field>
              <b-checkbox v-model="address.isBilling">This address is my primary address</b-checkbox>
            </b-field>
            <button type="submit" class="button is-primary">Save</button>
          </form>
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
        countryList: {},
        address: {
          name: '',
          street: '',
          houseno: '',
          postcode: '',
          city: '',
          company: '',
          department: '',
          country: null,
          isBilling: false,
          isPrimary: false
        },
        message: {
          name: ''
        }, // filled in one key so it also works when any of the values are untouched
        showError: false,
        formError: 'There are errors, please correct them to save',
        isNew: true,
        isLoading: false
      }
    },
    created () {
      const routeParams = this.$route.params
      this.isNew = (routeParams.key === 'new')
      this.getCountryList()
    },
    async asyncData ({ store, params }) {
      let data = params
      if (data.key !== undefined) {
        const address = await store.dispatch('account/getAddress', { id: data.key })
        // console.log(address)
        if (address.data.result._result.length > 0) {
          return { address: address.data.result._result[0] }
        }
        return {
          address: {
            name: '',
            street: '',
            houseno: '',
            postcode: '',
            city: '',
            company: '',
            department: '',
            country: '',
            isBilling: '',
            isPrimary: false
          }
        }
      }
      return {
        address: {
          name: '',
          street: '',
          houseno: '',
          postcode: '',
          city: '',
          company: '',
          department: '',
          country: '',
          isBilling: '',
          isPrimary: false
        }
      }
    },
    computed: {
      checkErrors: {
        cache: false,
        get () {
          try {
            let messages = this.message
            for (var mes in messages) {
              // console.log(mes + ' - ' + this.message[mes])
              if (this.message[mes] !== '') {
                return true
              }
            }
            return false
          } catch (e) {
            console.log(e)
          }
        }
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
            if (value === undefined) value = ''
            messages[fld] = await this.$store.dispatch('validation/validatePassword', { value: value })
            break
          case 'repeatPassword':
            if (value === undefined) value = ''
            messages[fld] = await this.$store.dispatch('validation/validateRepeatPassword', { value: value, repeat: this.customer.newPassword })
            break
          default:
            messages[fld] = await this.$store.dispatch('validation/validateField', { value: value })
            break
        }

        this.message = '' // hack to let two way binding work if a key in an object has changed
        this.message = messages
        this.address[fld] = value
      },
      async saveDelivery () {
        try {
          this.isLoading = true
          // validate fields here
          await this.validate(this.address.name, 'name')
          await this.validate(this.address.street, 'street')
          await this.validate(this.address.houseno, 'houseno')
          await this.validate(this.address.postcode, 'postcode')
          await this.validate(this.address.city, 'city')
          await this.validate(this.address.country, 'country', 'select')
          await this.validate(this.address.company, 'company')

          if (this.checkErrors) {
            this.showError = true
            this.isLoading = false
          }
          if (!this.checkErrors) {
            console.log('thyis.address', this.address)
            await this.$store.dispatch('account/saveAddress', { address: this.address })
            this.isLoading = false
            this.showError = false
            this.$toast.open({ message: 'Saved', type: 'is-success' })
            let myroute = '/account/delivery'
            if (this.$store.state.cart.cartContents.length > 0) {
              myroute = '/order'
            }
            this.$router.push(myroute)
          }
        } catch (e) {
          console.log(e)
          this.showError = true
          this.isLoading = false
          this.$toast.open({ message: 'Could not save data, please try again', type: 'is-danger' })
        }
      },
      async getCountryList () {
        let countryList = await this.$store.dispatch('order/getCountryList', {}, { root: true })
        this.countryList = countryList
      }
    }
  }
</script>
