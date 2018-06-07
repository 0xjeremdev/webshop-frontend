<template>
  <div>
    <br />
    <form v-on:submit.prevent>
    <b-tabs position="is-centered" class="block" inputType="is-toggle-rounded">
      <b-tab-item v-for="(value, tabKey) in fields" :key="tabKey" :label="tabKey" :icon="fields[tabKey].icon">
        <div v-if="!isLoading">
          <b-field horizontal><!-- Label left empty for spacing -->
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
          <hr>
          <br />
          <b-field v-for="(val, fieldKey) in value"
            v-if="fieldKey !== 'icon'"
            horizontal
            :data="val"
            :key="fieldKey"
            :label="getLabel(val, fieldKey)">
            <b-input v-if="val.inputType === 'input'" :autocomplete="fieldKey" :value="getValue(val, fieldKey, tabKey)" :placeholder="getLabel(val, fieldKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <imageControl v-else-if="val.inputType === 'imageUpload'" image="/images/Accus-Siezenis.png"></imageControl>
            <b-taginput v-else-if="val.inputType === 'tagInput'"
              :placeholder="getLabel(val, fieldKey)"
              maxtags="5"
              :value="[]">
            </b-taginput>
            <b-input v-else-if="val.inputType === 'text'" type="textarea" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <b-input v-else-if="val.inputType === 'password'" type="password" @input="setModel($event, fieldKey, tabKey)" password-reveal></b-input>
            <b-checkbox-button  v-else-if="val.inputType === 'checkbox'" :value="getValue(val, fieldKey, tabKey, 'checkbox')" @input="setCheckbox($event, fieldKey, tabKey)" type="is-success"><b-icon icon="check"></b-icon></b-checkbox-button>
            <b-select v-else-if="val.inputType === 'dropdown'" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)">
                  <option v-for="option in val.options" :key="option" :value="option">{{ option }}</option>
            </b-select>
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
          <br />
          <hr>
          <b-field horizontal><!-- Label left empty for spacing -->
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
        </div>
      </b-tab-item>
    </b-tabs>
    </form>
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  </div>
</template>

<script>
  // import Cookies from 'js-cookie'
  import { contains } from '~/utils/utils'
  import imageControl from '~/components/ui/Imagecontrol'

  export default {
    layout: 'admin',
    components: { imageControl },
    data () {
      return {
        isLoading: true,
        isNew: true,
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
            'title': {
              'inputType': 'dropdown',
              'label': 'Title',
              'options': ['Mr.', 'Mrs.']
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
              'label': 'Vat No'
            },
            'email': {
              'inputType': 'input',
              'label': 'Email'
            },
            'phone': {
              'inputType': 'input',
              'label': 'Phone'
            },
            'mobile': {
              'inputType': 'input',
              'label': 'Mobile'
            },
            'fax': {
              'inputType': 'input',
              'label': 'Fax'
            },
            'state': {
              'inputType': 'input',
              'label': 'Active'
            },
            'newsletter': {
              'inputType': 'checkbox',
              'label': 'Newsletter Subscription'
            },
            'password': {
              'inputType': 'password',
              'label': 'User password'
            },
            'repeat_password': {
              'inputType': 'password',
              'label': 'Repeat password'
            },
            'your_password': {
              'inputType': 'password',
              'label': 'Your password'
            },
            icon: 'account'
          }
        }
      }
    },
    async created () {
      await this.getData()
    },
    validate ({ params }) {
      // can be validated
      return params
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
      },
      async getData () {
        try {
          this.isLoading = true
          let routeParams = this.$route.params
          // console.log(routeParams)
          if (routeParams instanceof Object && routeParams.key !== 'new') {
            /* if (!(this.$store.state.authUser instanceof Object)) {
              this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
            }
            this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
            let query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p in Customer FILTER p._key == @key RETURN p', bindVars: { 'key': routeParams.key } } */
            let data = await this.$axios.$get(this.$store.state.apiUrl + '/admin/customer/' + routeParams.key)
            console.log(data)
            this.productData = data['result']['_result'][0]
            // this.productData.birthdate = new Date(this.productData.birthdate)
            this.isNew = false
            this.isLoading = false
          } else {
            this.isNew = true
            this.productData = {}
            if (this.productData instanceof Object) {
              for (var tabKey in this.fields) {
                for (var fieldKey in this.fields[tabKey]) {
                  this.productData[fieldKey] = ''
                }
              }
            }
            console.log(this.productData)
            this.isLoading = false
          }
        } catch (e) {
          this.$toast.open('Could not load data')
          this.isLoading = false
        }
      },
      async saveData () {
        try {
          this.isLoading = true
          /* if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
          }
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
          // let query = {'options': {'fullCount': true}, 'count': true, 'query': 'FOR p in k2p_product FILTER p.code == \'' + this.$route.params.code + '\' RETURN p'}
          // console.log(this.productData)
          // TODO: CHECK IF this.productData complies with fields before saving (this is necessary when isNew is True)
          console.log(this.productData)
          let query = {
            'options': {
              'fullCount': true
            },
            'count': true,
            'query': 'INSERT { lastname: @lastname, firstname: @firstname, company: @company, VAT_No: @VAT_No, gender: @gender, birthdate: @birthdate, email: @email, phone: @phone, mobile: @mobile, password: @password, newsletter: @newsletter } INTO Customer',
            'bindVars': {
              'lastname': this.productData.lastname,
              'firstname': this.productData.firstname,
              'company': this.productData.company,
              'gender': this.productData.gender,
              'birthdate': this.productData.birthdate,
              'email': this.productData.email,
              'phone': this.productData.phone,
              'VAT_No': this.productData['VAT_No'],
              'mobile': this.productData.mobile,
              'password': this.productData.password,
              'newsletter': this.productData.newsletter
            }
          }
          if (!this.isNew) {
            query = {
              'options': {
                'fullCount': true
              },
              'count': true,
              'query': 'UPDATE { _key: \'' + this.productData['_key'] + '\' } WITH { lastname: @lastname, firstname: @firstname, company: @company, VAT_No: @VAT_No, gender: @gender, birthdate: @birthdate, email: @email, phone: @phone, mobile: @mobile, password: @password, newsletter: @newsletter } IN Customer',
              'bindVars': {
                'lastname': this.productData.lastname,
                'firstname': this.productData.firstname,
                'company': this.productData.company,
                'gender': this.productData.gender,
                'birthdate': this.productData.birthdate,
                'email': this.productData.email,
                'phone': this.productData.phone,
                'VAT_No': this.productData['VAT_No'],
                'mobile': this.productData.mobile,
                'password': this.productData.password,
                'newsletter': this.productData.newsletter
              }
            }
            console.log(query)
          } */
          console.log(this.productData)
          let postData = {
            'key': (this.productData._key !== undefined) ? this.productData._key : '',
            'lastname': (this.productData.lastname !== undefined) ? this.productData.lastname : '',
            'firstname': (this.productData.firstname !== undefined) ? this.productData.firstname : '',
            'company': (this.productData.company !== undefined) ? this.productData.company : '',
            'title': (this.productData.title !== undefined) ? this.productData.title : '',
            'gender': (this.productData.gender !== undefined) ? this.productData.gender : '',
            'email': (this.productData.email !== undefined) ? this.productData.email : '',
            'phone': (this.productData.phone !== undefined) ? this.productData.phone : '',
            'VAT_No': (this.productData['VAT_No'] !== undefined) ? this.productData['VAT_No'] : '',
            'mobile': (this.productData.mobile !== undefined) ? this.productData.mobile : '',
            'fax': (this.productData.fax !== undefined) ? this.productData.fax : '',
            'state': (this.productData.state !== undefined) ? this.productData.state : '',
            'password': (this.productData.password !== undefined) ? this.productData.password : '',
            'newsletter': (this.productData.newsletter !== undefined) ? this.productData.newsletter : ''
          }
          console.log(postData)
          let data = ''
          if (!this.isNew) {
            data = await this.$axios.$put(this.$store.state.apiUrl + '/admin/customer', postData)
          } else {
            data = await this.$axios.$post(this.$store.state.apiUrl + '/admin/customer', postData)
          }
          console.log(data)
          this.isLoading = false
          this.$toast.open('Saved')
          this.$router.push('/admin/customer')
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not save data, please try again')
          this.isLoading = false
        }
      },
      checkFields (col, arr) {
        return contains(col, arr)
      },
      goBack () {
        this.$router.push('/admin/customer')
      }
    }
  }
</script>
