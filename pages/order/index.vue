<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Order - Select Delivery</h1>
      <orderMenu :step="step"></orderMenu>
      <div>
        <div class="columns">
          <div class="column">

          </div>
          <div class="column is-three-quarters">
            <b-message type="is-danger" has-icon title="An error has occured" :active.sync="hasErrors.length > 0">
              <div v-for="val in hasErrors">{{ val.message }}</div>
            </b-message>
            <div class="columns">
              <div class="column notification">
                <article v-if="address" class="tile is-child notification">
                  <b-field label="Select Delivery Address">
                    <b-select v-model="selectedAddress" expanded placeholder="Select a delivery address">
                        <option
                            v-for="option in address"
                            :value="option"
                            :key="option._key"
                            >
                            {{ option.name }} - {{ option.street }} {{ option.houseno }}, {{ option.postcode }} {{ option.city }}, {{ option.country }}
                        </option>
                    </b-select>
                  </b-field>
                  <p class="control" style="margin-top: 0.75rem; margin-bottom: 0.75rem;">
                    <button @click="addAddress()" class="button is-info">Add Address</button>
                  </p>

                  <b-field>
                    <b-checkbox v-model="differentAsDelivery">Billing address is different then Delivery Address</b-checkbox>
                  </b-field>
                  <b-field v-if="differentAsDelivery" label="Select Billing Address">
                    <b-select v-model="selectedBilling" expanded placeholder="Select a billing address">
                        <option
                            v-for="option in address"
                            :value="option"
                            :key="option._key"
                            >
                            {{ option.name }} - {{ option.street }} {{ option.houseno }}, {{ option.postcode }} {{ option.city }}, {{ option.country }}
                        </option>
                    </b-select>
                  </b-field>
                </article>
                <article v-if="selectedAddress" class="tile is-child notification">
                  <h2 class="subtitle">Your selected delivery address details:</h2>
                  <table class="table">
                    <tbody>
                      <tr><td>Name:</td><td>{{ selectedAddress.name }}</td></tr>
                      <tr><td>Street: </td><td>{{ selectedAddress.street }}</td></tr>
                      <tr><td>House No.: </td><td>{{ selectedAddress.houseno }}</td></tr>
                      <tr><td>Postcode: </td><td>{{ selectedAddress.postcode }}</td></tr>
                      <tr><td>City: </td><td>{{ selectedAddress.city }}</td></tr>
                      <tr><td>Country: </td><td>{{ selectedAddress.country }}</td></tr>
                    </tbody>
                  </table>
                </article>
              </div>
              <div class="column is-2">
              </div>
              <div class="column notification">
                <article class="tile is-child notification">
                  <h2 class="subtitle">Personal Details</h2>
                  <table class="table">
                    <tbody>
                      <tr><td>Name: </td><td>{{ customer.title }} {{ customer.firstname }} {{ customer.lastname }}</td></tr>
                      <tr><td>Company: </td><td>{{ customer.company }}</td></tr>
                      <tr><td>VAT No.: </td><td>{{ customer.VAT_No }}</td></tr>
                      <tr><td>Phone: </td><td>{{ customer.phone }}</td></tr>
                      <tr><td>Mobile: </td><td>{{ customer.mobile }}</td></tr>
                      <tr><td>Fax: </td><td>{{ customer.fax }}</td></tr>
                    </tbody>
                  </table>
                  <p class="control" style="margin-top: 0.75rem; margin-bottom: 0.75rem;">
                    <button @click="doChange()" class="button is-info">Change</button>
                  </p>
                </article>
                <article v-if="differentAsDelivery && selectedBilling" class="tile is-child notification">
                  <h2 class="subtitle">Your selected billing address details:</h2>
                  <table class="table">
                    <tbody>
                      <tr><td>Name:</td><td>{{ selectedBilling.name }}</td></tr>
                      <tr><td>Street: </td><td>{{ selectedBilling.street }}</td></tr>
                      <tr><td>House No.: </td><td>{{ selectedBilling.houseno }}</td></tr>
                      <tr><td>Postcode: </td><td>{{ selectedBilling.postcode }}</td></tr>
                      <tr><td>City: </td><td>{{ selectedBilling.city }}</td></tr>
                      <tr><td>Country: </td><td>{{ selectedBilling.country }}</td></tr>
                    </tbody>
                  </table>
                </article>
              </div>
            </div>
          </div>
          <div class="column">

          </div>
        </div>
      </div>
      <br />
      <br />
      <div class="columns">
        <div class="column is-one-fifth has-text-right">
          <nuxt-link to="/cart"><button class="button is-orange">Previous</button></nuxt-link>
        </div>
        <div class="column">
        </div>
        <div class="column is-one-fifth">
          <button @click="doNext" class="button is-orange">Next</button>
        </div>
      </div>
      <b-loading :active.sync="isFetching" :canCancel="true"></b-loading>
    </div>
  </section>
</template>

<script>
  import orderMenu from '~/components/ui/orderMenu.vue'

  export default {
    middleware: 'authCustomer',
    components: { orderMenu },
    data () {
      return {
        isFetching: false,
        step: '1',
        loggedIn: true,
        customer: {},
        address: {},
        selectedAddress: null,
        selectedBilling: null,
        differentAsDelivery: false,
        formNewsletter: false,
        hasErrors: [],
        data: {
          areaofinterest: ['Research Immunology', 'Cell Biology', 'Molecular Biology', 'Pathology'],
          title: ['Prof.', 'Drs.', 'Mr.', 'Ir.', 'Dr.', 'MD.', 'Ing.', 'Bsc.', 'Msc.', 'Mrs.']
        }
      }
    },
    async asyncData ({ store, axios }) {
      let data = await store.dispatch('account/getAuth')
      if (data.data.result.id !== undefined) {
        const customer = await store.dispatch('account/getCustomer', { id: data.data.result.id })
        const address = await store.dispatch('account/getAddresses')
        // console.log(address.data.result._result)
        // console.log(customer.data.result._result[0])
        let selectedAddress = null
        let selectedBilling = null
        for (var i = 0; i < address.data.result._result.length; i++) {
          if (address.data.result._result[i].isBilling) {
            selectedAddress = address.data.result._result[i]
            selectedBilling = address.data.result._result[i]
            break
          }
        }
        // if (address.data.result === undefined || address.data.result._result.length > 0)
        return { customer: customer.data.result._result[0], address: address.data.result._result, selectedAddress: selectedAddress, selectedBilling: selectedBilling }
      }
      return { customer: {}, address: null, selectedAddress: null, selectBilling: null }
    },
    methods: {
      doNext () {
        let hasErrors = []
        if (this.selectedAddress === undefined || this.selectedAddress === null || this.selectedAddress === '') {
          hasErrors.push({'error': 'noValidDeliveryAddress', 'message': 'Please select or create a valid delivery address'})
        }
        if (this.customer === undefined || this.customer === null || this.customer === '') {
          hasErrors.push({'error': 'noValidCustomer', 'message': 'Please select or create a valid customer'})
        }
        if (this.differentAsDelivery && (this.selectedBilling === undefined || this.selectedBilling === null || this.selectedBilling === '')) {
          hasErrors.push({'error': 'noValidBillingAddress', 'message': 'Please select or create a valid billing address'})
        }

        if (this.customer.gender === undefined || this.customer.gender === null || this.customer.gender === '') { hasErrors.push({'error': 'noValidGender', 'message': 'Please edit your Personal Details to add your gender'}) }
        if (this.customer.areaofinterest === undefined || this.customer.areaofinterest === null || this.customer.areaofinterest === '') { hasErrors.push({'error': 'noValidAreaOfInterest', 'message': 'Please edit your Personal Details to add your area of interest'}) }
        if (this.customer.company === undefined || this.customer.company === null || this.customer.company === '') { hasErrors.push({'error': 'noValidCompany', 'message': 'Please edit your Personal Details to add your Company Name'}) }
        if (this.customer.VAT_No === undefined || this.customer.VAT_No === null || this.customer.VAT_No === '') { hasErrors.push({'error': 'noValidVatNo', 'message': 'Please edit your Personal Details to add your VAT No'}) }
        if ((this.customer.phone === undefined || this.customer.phone === null || this.customer.phone === '') && (this.customer.mobile === undefined || this.customer.mobile === null || this.customer.mobile === '')) { hasErrors.push({'error': 'noValidPhone', 'message': 'Please edit your Personal Details to add your phone or mobile number'}) }
        console.log(hasErrors)
        if (hasErrors.length === 0) {
          this.$store.commit('order/SET_CUSTOMER', this.customer)
          this.$store.commit('order/SET_ADDRESS', this.selectedAddress)
          if (this.differentAsDelivery) { this.$store.commit('order/SET_BILLING', this.selectedBilling) } else { this.$store.commit('order/SET_BILLING', this.selectedAddress) }
          this.$router.replace({ path: '/order/overview', replace: true })
        } else {
          this.hasErrors = hasErrors
        }
      },
      doChange () {
        this.$router.replace({ path: '/account/personal', replace: true })
      },
      addAddress () {
        this.$router.replace({ path: '/account/delivery/new', replace: true })
      }
    }
  }
</script>
