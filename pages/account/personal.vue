<template>
  <section class="section">
    <b-message type="is-danger" has-icon title="An error has occured" :active.sync="showError">
      {{ formError }}
    </b-message>
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="personal"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Personal Info</h1>
          <form v-on:submit.prevent="saveCustomer">
            <b-field grouped>
              <b-field label="Title"
                :type="(typeof message['title'] !== 'undefined' && message['title'] !== '') ? 'is-danger' : ''"
                :message="message['title']">
                  <b-select v-model="customer.title" placeholder="Title">
                    <option
                        v-for="option in data.title"
                        :value="option"
                        :key="option">
                        {{ option }}
                    </option>
                  </b-select>
              </b-field>
                <b-field label="Firstname"
                  expanded
                  :type="(typeof message['firstname'] !== 'undefined' && message['firstname'] !== '') ? 'is-danger' : ''"
                  :message="message['firstname']">
                    <b-input autocomplete="firstname" v-model="customer.firstname" placeholder="Firstname"></b-input>
                </b-field>
                <b-field label="Lastname"
                  expanded
                  :type="(typeof message['lastname'] !== 'undefined' && message['lastname'] !== '') ? 'is-danger' : ''"
                  :message="message['lastname']">
                    <b-input autocomplete="lastname" v-model="customer.lastname" placeholder="Lastname"></b-input>
                </b-field>
            </b-field>
            <!-- <b-field label="Gender">
            </b-field> -->
            <!-- <b-field :type="(typeof message['gender'] !== 'undefined' && message['gender'] !== '') ? 'is-danger' : ''"
            :message="message['gender']">
              <b-radio v-model="customer.gender"
                  native-value="M">
                  Male
              </b-radio>
              <b-radio v-model="customer.gender"
                  native-value="F">
                  Female
              </b-radio>
            </b-field> -->
            <b-field label="Area of Interest"
              :type="(typeof message['areaofinterest'] !== 'undefined' && message['areaofinterest'] !== '') ? 'is-danger' : ''"
              :message="message['areaofinterest']">
                <b-select v-model="customer.areaofinterest" expanded placeholder="Select an Area of Interest">
                    <option
                        v-for="option in data.areaofinterest"
                        :value="option"
                        :key="option">
                        {{ option }}
                    </option>
                </b-select>
            </b-field>
            <b-field grouped>
              <b-field label="Company"
                expanded
                :type="(typeof message['company'] !== 'undefined' && message['company'] !== '') ? 'is-danger' : ''"
                :message="message['company']">
                <b-input autocomplete="company" v-model="customer.company" placeholder="eg. LabNed"></b-input>
              </b-field>
              <b-field label="VAT No"
                expanded
                :type="(typeof message['VAT_No'] !== 'undefined' && message['VAT_No'] !== '') ? 'is-danger' : ''"
                :message="message['VAT_No']">
                <b-input autocomplete="VAT_No" v-model="customer.VAT_No" placeholder="VAT No"></b-input>
              </b-field>
            </b-field>
            <b-field grouped>
              <b-field label="Phone"
                expanded
                :type="(typeof message['phone'] !== 'undefined' && message['phone'] !== '') ? 'is-danger' : ''"
                :message="message['phone']">
                <b-input autocomplete="phone" v-model="customer.phone" placeholder="Phone"></b-input>
              </b-field>
              <b-field label="Mobile"
                expanded
                :type="(typeof message['mobile'] !== 'undefined' && message['mobile'] !== '') ? 'is-danger' : ''"
                :message="message['mobile']">
                <b-input autocomplete="mobile" v-model="customer.mobile" placeholder="Mobile"></b-input>
              </b-field>
              <b-field label="Fax"
                expanded
                :type="(typeof message['fax'] !== 'undefined' && message['fax'] !== '') ? 'is-danger' : ''"
                :message="message['fax']">
                <b-input autocomplete="fax" v-model="customer.fax" placeholder="Fax"></b-input>
              </b-field>
            </b-field>
            <b-field v-show="false" expanded label="Name"
            :type="(typeof message['name'] !== 'undefined' && message['name'] !== '') ? 'is-danger' : ''"
            :message="message['name']">
              <b-input v-model="address.name" autocomplete='name' placeholder="Name"></b-input>
            </b-field>
            <b-field grouped>
              <b-field expanded label="Street"
              :type="(typeof message['street'] !== 'undefined' && message['street'] !== '') ? 'is-danger' : ''"
              :message="message['street']">
                <b-input v-model="address.street" autocomplete='street' placeholder="Street"></b-input>
              </b-field>
              <b-field label="House No."
              :type="(typeof message['houseno'] !== 'undefined' && message['houseno'] !== '') ? 'is-danger' : ''"
              :message="message['houseno']">
                <b-input v-model="address.houseno" autocomplete='houseno' placeholder="House No."></b-input>
              </b-field>
            </b-field>
            <b-field grouped>
              <b-field label="Postcode"
              :type="(typeof message['postcode'] !== 'undefined' && message['postcode'] !== '') ? 'is-danger' : ''"
              :message="message['postcode']">
                <b-input v-model="address.postcode" autocomplete='postcode' placeholder="Postcode"></b-input>
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
              <b-checkbox v-model="customer.newsletter">Sign-up for the monthly newsletter</b-checkbox>
            </b-field>
            <p class="control">
              <button type="submit" class="button is-primary">Change</button>
            </p>
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
    components: { accountMenu },
    data () {
      return {
        data: {
          areaofinterest: ['Research Immunology', 'Cell Biology', 'Molecular Biology', 'Pathology'],
          title: ['Prof.', 'Drs.', 'Mr.', 'Ir.', 'Dr.', 'MD.', 'Ing.', 'Bsc.', 'Msc.', 'Mrs.']
        },
        countryList: {},
        customer: {},
        message: {
          lastname: ''
        }, // filled in one key so it also works when any of the values are untouched
        showError: false,
        formError: 'There are errors, please correct them to save',
        isLoading: false,
        address: {
          name: 'Primary',
          street: '',
          houseno: '',
          postcode: '',
          city: '',
          country: null,
          isBilling: true
        }
      }
    },
    async asyncData ({ store }) {
      let data = await store.dispatch('account/getAuth')
      let customerData = ''
      let addressData = {
        name: 'Primary',
        street: '',
        houseno: '',
        postcode: '',
        city: '',
        country: null,
        isBilling: true
      }
      if (data.data.result.id !== undefined) {
        const customer = await store.dispatch('account/getCustomer', { id: data.data.result.id })
        customerData = customer.data.result._result[0]
        // get the address
        let addressResp = await store.dispatch('account/getAddress', { id: customerData.addressKey })
        if (addressResp.data.result._result[0]) {
          addressData = addressResp.data.result._result[0]
        }
      }
      // console.log('addressDta', addressData)
      console.log('customerData', customerData)
      return { customer: customerData, address: addressData }
    },
    created () {
      this.getCountryList()
    },
    computed: {
      checkErrors: {
        cache: false,
        get () {
          try {
            let messages = this.message
            for (var mes in messages) {
              console.log(mes + ' - ' + this.message[mes])
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
          case 'select':
            messages[fld] = await this.$store.dispatch('validation/validateSelect', { value: value })
            break
          default:
            messages[fld] = await this.$store.dispatch('validation/validateField', { value: value })
            break
        }

        this.message = '' // hack to let two way binding work if a key in an object has changed
        this.message = messages
        this.customer[fld] = value
      },
      async saveCustomer () {
        try {
          this.isLoading = true
          // validate fields here
          await this.validate(this.customer.lastname, 'lastname')
          await this.validate(this.customer.firstname, 'firstname')
          await this.validate(this.customer.title, 'title', 'select')
          await this.validate(this.customer.company, 'company')
          await this.validate(this.customer.phone, 'phone')
          // await this.validate(this.customer.areaofinterest, 'areaofinterest', 'select')
          // console.log(this.checkErrors)
          // console.log(this.message)
          if (this.checkErrors) {
            this.showError = true
            this.isLoading = false
          }
          if (!this.checkErrors) {
            // console.log(this.customer)
            let data = await this.$store.dispatch('account/saveAddress', { address: this.address })
            if (data.data.result._result[0]) {
              this.customer.addressKey = data.data.result._result[0]
            }
            console.log('this.customer', this.customer)
            await this.$store.dispatch('account/saveCustomer', { customer: this.customer })

            this.isLoading = false
            this.showError = false
            this.$toast.open({ message: 'Saved', type: 'is-success' })
            if (this.$store.state.cart.cartContents.length > 0) {
              this.$router.push('/order')
            }
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
