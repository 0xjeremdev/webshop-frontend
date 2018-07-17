<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Order - Select Delivery</h1>
      <orderMenu :step="step"></orderMenu>
      <!-- step 2: if logged in show dropdown boxes with billing and delivery address go to step 4 -->
      <!-- <div v-if="loggedIn" class="container">
        <b-field grouped>
          <b-field label="Title">
              <b-select v-model="customer.title" placeholder="Title">
                <option
                    v-for="option in data.title"
                    :value="option"
                    :key="option">
                    {{ option }}
                </option>
              </b-select>
          </b-field>
            <b-field label="Firstname" expanded>
                <b-input v-model="customer.firstname" placeholder="Firstname"></b-input>
            </b-field>
            <b-field label="Lastname" expanded>
                <b-input v-model="customer.lastname" placeholder="Lastname"></b-input>
            </b-field>
        </b-field>
        <b-field label="Area of Interest">
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
          <b-field label="Company" expanded>
            <b-input v-model="customer.company" placeholder="eg. LabNed"></b-input>
          </b-field>
          <b-field label="VAT No" expanded>
            <b-input v-model="customer.vatno" placeholder="VAT No"></b-input>
          </b-field>
        </b-field>
        <b-field grouped>
          <b-field label="Phone" expanded>
            <b-input v-model="customer.phone" placeholder="Phone"></b-input>
          </b-field>
          <b-field label="Mobile" expanded>
            <b-input v-model="customer.mobile" placeholder="Mobile"></b-input>
          </b-field>
          <b-field label="Fax" expanded>
            <b-input v-model="customer.fax" placeholder="Fax"></b-input>
          </b-field>
        </b-field>
        <b-field>
          <b-checkbox v-model="customer.newsletter">Signup for the monthly newsletter</b-checkbox>
        </b-field>
      </div> -->
      <!-- step 2: if not logged in show billing address form go to step 3
      // step 3: show delivery address
      // step 4: show payment OPTIONS
      // step 5: overview of the order and confirmation to place the order -->
      <div class="container">
        <div class="columns">
          <div class="column">

          </div>
          <div class="column is-three-quarters">
            <div class="tile is-ancestor">
              <div class="tile">
                <div class="tile is-parent is-vertical">
                  <article class="tile is-child notification">
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
                  <article class="tile is-child notification">
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
              </div>
              <div class="tile">
                <div class="tile is-parent is-vertical">
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
                  <article v-if="differentAsDelivery" class="tile is-child notification">
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

        return { customer: customer.data.result._result[0], address: address.data.result._result, selectedAddress: selectedAddress, selectedBilling: selectedBilling }
      }
      return { customer: '' }
    },
    methods: {
      doNext () {
        this.$store.commit('order/SET_CUSTOMER', this.customer)
        this.$store.commit('order/SET_ADDRESS', this.selectedAddress.country)
        if (this.differentAsDelivery) { this.$store.commit('order/SET_BILLING', this.selectedBilling.country) } else { this.$store.commit('order/SET_BILLING', this.selectedAddress.country) }
        this.$router.push('/order/overview')
      },
      doChange () {
        this.$router.push('/account/personal')
      },
      addAddress () {
        this.$router.push('/account/delivery/new')
      }
    }
  }
</script>
