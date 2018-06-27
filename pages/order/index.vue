<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Order - Personal Info</h1>
      <orderMenu :step="step"></orderMenu>
      <!-- step 2: if logged in show dropdown boxes with billing and delivery address go to step 4 -->
      <div v-if="loggedIn" class="container">
        <b-field grouped>
          <b-field label="Title">
              <b-select placeholder="Title">
                <option
                    v-for="option in data.title"
                    :value="option"
                    :key="option">
                    {{ option }}
                </option>
              </b-select>
          </b-field>
            <b-field label="Firstname" expanded>
                <b-input placeholder="Firstname"></b-input>
            </b-field>
            <b-field label="Lastname" expanded>
                <b-input placeholder="Lastname"></b-input>
            </b-field>
        </b-field>
        <b-field label="Area of Interest">
            <b-select expanded placeholder="Select an Area of Interest">
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
            <b-input placeholder="eg. LabNed"></b-input>
          </b-field>
          <b-field label="VAT No" expanded>
            <b-input placeholder="VAT No"></b-input>
          </b-field>
        </b-field>
        <b-field grouped>
          <b-field label="Phone" expanded>
            <b-input placeholder="Phone"></b-input>
          </b-field>
          <b-field label="Mobile" expanded>
            <b-input placeholder="Mobile"></b-input>
          </b-field>
          <b-field label="Fax" expanded>
            <b-input placeholder="Fax"></b-input>
          </b-field>
        </b-field>
        <b-field>
          <b-checkbox v-model="formNewsletter">Signup for the monthly newsletter</b-checkbox>
        </b-field>
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
          <nuxt-link to="/cart"><button class="button is-orange">Previous</button></nuxt-link>
        </div>
        <div class="column">
        </div>
        <div class="column is-one-fifth">
          <nuxt-link to="/order/step2"><button class="button is-orange">Next</button></nuxt-link>
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
    data () {
      return {
        isFetching: false,
        step: '1',
        loggedIn: true,
        productData: {},
        data: {
          areaofinterest: ['Research Immunology', 'Cell Biology', 'Molecular Biology', 'Pathology'],
          title: ['Prof.', 'Drs.', 'Mr.', 'Ir.', 'Dr.', 'MD.', 'Ing.', 'Bsc.', 'Msc.', 'Mrs.']
        },
        newsletter: false
      }
    },
    methods: {
    }
  }
</script>
