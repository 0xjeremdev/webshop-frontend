<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Order - Personal Info</h1>
      <orderMenu :step="step"></orderMenu>
      <!-- step 2: if logged in show dropdown boxes with billing and delivery address go to step 4 -->
      <div v-if="loggedIn" class="container">
        <div v-if="!isFetching" v-for="(value, tabKey) in fields" :key="tabKey">
          <!-- <b-field horizontal>
            <p class="control">
              <button class="button is-primary" @click="saveData">
                <b-icon icon="content-save"></b-icon>
                <span> Bewaren</span>
              </button>
              <button class="button is-outlined" @click="goBack">
                <b-icon icon="arrow-left"></b-icon>
                <span> Terug</span>
              </button>
            </p>
          </b-field>
          <hr> -->
          <br />
          <b-field v-for="(val, fieldKey) in value"
            v-if="fieldKey !== 'icon'"
            horizontal
            :data="val"
            :key="fieldKey"
            :label="getLabel(val, fieldKey)">
            <b-input v-if="val.inputType === 'input'" :value="getValue(val, fieldKey, tabKey)" :placeholder="getLabel(val, fieldKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <imageControl v-else-if="val.inputType === 'imageUpload'" image="/images/Accus-Siezenis.png"></imageControl>
            <b-taginput v-else-if="val.inputType === 'tagInput'"
              :placeholder="getLabel(val, fieldKey)"
              maxtags="5"
              :value="[]">
            </b-taginput>
            <b-input v-else-if="val.inputType === 'text'" type="textarea" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <b-input v-else-if="val.inputType === 'password'" type="password" @input="setModel($event, fieldKey, tabKey)" password-reveal></b-input>
            <b-checkbox  v-else-if="val.inputType === 'checkbox'" :value="getValue(val, fieldKey, tabKey, 'checkbox')" @input="setCheckbox($event, fieldKey, tabKey)" type="is-success"></b-checkbox>
            <div v-else-if="val.inputType === 'radio'">
              <b-radio v-for="ro in val.options"
                :key="ro"
                :native-value="ro"
                :value="getValue(val, fieldKey, tabKey)"
                @input="setModel($event, fieldKey, tabKey)">
                {{ ro }}
              </b-radio>
            </div>
            <b-datepicker v-else-if="val.inputType === 'date'"
                placeholder="Type or select a date..."
                icon="calendar-today"
                v-model="productData[fieldKey]"
                :readonly="false">
            </b-datepicker>
            <b-input v-else value="Could not load this type"></b-input>
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
        fields: {
          'Customer': {
            'lastname': {
              'inputType': 'input',
              'label': 'Lastname'
            },
            'firstname': {
              'inputType': 'input',
              'label': 'Firstname'
            },
            'gender': {
              'inputType': 'radio',
              'label': 'Gender',
              'options': ['M', 'F']
            },
            'company': {
              'inputType': 'input',
              'label': 'Company'
            },
            'VAT_No': {
              'inputType': 'input',
              'label': 'VAT No.'
            },
            'email': {
              'inputType': 'input',
              'label': 'E-mail'
            },
            'phone': {
              'inputType': 'input',
              'label': 'Phone'
            },
            'mobile': {
              'inputType': 'input',
              'label': 'Mobile'
            },
            'newsletter': {
              'inputType': 'checkbox',
              'label': 'Monthly Newsletter Subscription'
            }
          }
        }
      }
    },
    methods: {
      setModel (val, fieldKey, tabKey, inputType) {
        console.log(val)
        if (inputType === 'date') {
          val = ''
        }
        this.productData[fieldKey] = val
      },
      getLabel (val, fieldKey) {
        if (val.label) {
          return val.label
        }
        return fieldKey
      },
      getValue (val, fieldKey, tabKey, inputType) {
        if (this.productData instanceof Object) {
          if (inputType === 'checkbox') {
            if (this.productData[fieldKey] === 'true') { console.log('true') }
            return !this.productData[fieldKey]
          } else if (inputType === 'date') {
            let d = new Date(this.productData[fieldKey])
            return d
          }
          return this.productData[fieldKey]
        }
        return ''
      },
      setCheckbox (val, fieldKey, tabKey) {
        this.productData[fieldKey] = !val
      },
      setDate (val, fieldKey, tabKey) {
        try {
          let d = new Date(val)
          console.log(d)
          // let date = d.getFullYear() + '-' + (d.getMonth() - 1) + '-' + d.getDate()
          this.productData[fieldKey] = d
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>
