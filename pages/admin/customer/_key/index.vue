<template>
  <div>
    <br />
    <form v-on:submit.prevent>
      <b-message type="is-danger" has-icon title="An error has occured" :active.sync="showError">
        {{ formError }}
      </b-message>
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
              :label="getLabel(val, fieldKey)"
              :type="(typeof message[fieldKey] !== 'undefined' && message[fieldKey] !== '') ? 'is-danger' : ''"
              :message="message[fieldKey]">
              <b-input v-if="val.inputType === 'input'" :autocomplete="fieldKey" @blur="validate($event.srcElement.value, fieldKey, val.type)" :value="getValue(val, fieldKey, tabKey)" :placeholder="getLabel(val, fieldKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
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
                  v-model="gender"
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
              <div v-else-if="tabKey === 'Address'" class="container">
                <datagrid :data="val.gridData" :columns="val.gridColumns" :labels="val.gridLabels" :types="val.gridTypes" :tableName="val.tableName" :apiUrl="val.apiUrl" :type="val.type" :customSortField="val.customSortField"></datagrid>
              </div>
              <!-- <b-input v-else value="Could not load this type"></b-input> -->
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
  import Datagrid from '~/components/ui/Datagrid'

  export default {
    layout: 'admin',
    components: { imageControl, Datagrid },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Add/Edit Customer'
      }
    },
    data () {
      return {
        isLoading: true,
        isNew: true,
        productData: {},
        message: {
          lastname: ''
        }, // filled in one key so it also works when any of the values are untouched
        gender: 'M',
        showError: false,
        formError: 'There are errors, please correct them to save',
        fields: {
          'Customer': {
            'lastname': {
              'inputType': 'input',
              'label': 'Lastname',
              'required': true
            },
            'firstname': {
              'inputType': 'input',
              'label': 'Firstname',
              'required': true
            },
            'title': {
              'inputType': 'dropdown',
              'label': 'Title',
              'options': ['Prof.', 'Drs.', 'Mr.', 'Ir.', 'Dr.', 'MD.', 'Ing.', 'Bsc.', 'Msc.', 'Mrs.'],
              'required': true
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
              'label': 'Email',
              'required': true
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
            'discount': {
              'inputType': 'input',
              'label': 'Discount (%)'
            },
            'allow_banktransfer': {
              'inputType': 'checkbox',
              'label': 'Allow Bank Transfer'
            },
            'state': {
              'inputType': 'dropdown',
              'label': 'Active',
              'options': ['verified', 'pending-verification'],
              'required': true
            },
            'newsletter': {
              'inputType': 'checkbox',
              'label': 'Newsletter Subscription'
            },
            'password': {
              'inputType': 'password',
              'label': 'User password',
              'required': true
            },
            'repeat_password': {
              'inputType': 'password',
              'label': 'Repeat password',
              'required': true
            },
            'your_password': {
              'inputType': 'password',
              'label': 'Your password',
              'required': true
            },
            icon: 'account'
          },
          'Address': {
            'gridOptions': {
              gridColumns: ['name', 'street', 'houseno', 'postcode', 'city', 'country'],
              gridLabels: ['Name', 'Street', 'HouseNo', 'Postcode', 'City', 'Country'],
              gridTypes: { 'name': 'string', 'street': 'string', 'houseno': 'string', 'postcode': 'string', 'city': 'string', 'country': 'string' },
              gridData: [],
              apiUrl: this.$store.state.apiUrl,
              type: 'address/?customerid=Customer/' + this.$route.params.key,
              customSortField: 'name',
              customSortDir: 'DESC',
              label: ' '
            }
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
      async setModel (val, fieldKey, tabKey, inputType) {
        console.log(val)
        if (inputType === 'date') {
          val = ''
        }
        let myData = this.productData
        myData[fieldKey] = val
        this.productData = myData
      },
      getLabel (val, fieldKey) {
        if (val.label) {
          if (val.required) return '* ' + val.label
          return val.label
        }
        if (val.required) return '* ' + fieldKey
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
          // console.log(d)
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
            let data = await this.$axios.$get(this.$store.state.apiUrl + '/admin/customer/' + routeParams.key, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            // console.log(data)
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
            // console.log(this.productData)
            this.isLoading = false
          }
        } catch (e) {
          this.$toast.open('Could not load data')
          this.isLoading = false
        }
      },
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
            messages[fld] = await this.$store.dispatch('validation/validateRepeatPassword', { value: value, repeat: this.productData.password })
            break
          case 'userPassword':
            if (value === undefined) value = ''
            messages[fld] = await this.$store.dispatch('validation/validateUserPassword', { password: value })
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
        // console.log(this.message)
        this.productData[fld] = value
      },
      async saveData () {
        try {
          this.isLoading = true
          await this.validate(this.productData.lastname, 'lastname', 'field')
          await this.validate(this.productData.firstname, 'firstname', 'field')
          await this.validate(this.productData.title, 'title', 'select')
          await this.validate(this.productData.company, 'company', 'field')
          await this.validate(this.productData.email, 'email', 'email')
          await this.validate(this.productData.phone, 'phone', 'field')
          await this.validate(this.productData.fax, 'fax', 'field')
          await this.validate(this.productData.mobile, 'mobile', 'field')
          await this.validate(this.productData.state, 'state', 'select')

          if (this.productData.password !== undefined && this.productData.password !== '') this.validate(this.productData.password, 'password', 'password')
          if (this.productData.repeat_password !== undefined && this.productData.repeat_password !== '') this.validate(this.productData.repeat_password, 'repeat_password', 'repeatPassword')
          if (this.productData.your_password !== undefined && this.productData.your_password !== '') {
            this.validate(this.productData.your_password, 'your_password', 'userPassword')
          } else {
            this.message['your_password'] = 'Bad Credentials'
          }
          console.log(this.message)
          console.log(this.checkErrors)
          if (this.checkErrors) {
            this.showError = true
            this.isLoading = false
          }
          if (!this.checkErrors) {
            // console.log(this.productData)
            let postData = {
              'key': (this.productData._key !== undefined) ? this.productData._key : '',
              'lastname': (this.productData.lastname !== undefined) ? this.productData.lastname : '',
              'firstname': (this.productData.firstname !== undefined) ? this.productData.firstname : '',
              'company': (this.productData.company !== undefined) ? this.productData.company : '',
              'title': (this.productData.title !== undefined) ? this.productData.title : '',
              'gender': (this.productData.gender !== undefined) ? this.productData.gender : '',
              'email': (this.productData.email !== undefined) ? this.productData.email : '',
              'phone': (this.productData.phone !== undefined) ? this.productData.phone : '',
              'vatno': (this.productData['VAT_No'] !== undefined) ? this.productData['VAT_No'] : '',
              'mobile': (this.productData.mobile !== undefined) ? this.productData.mobile : '',
              'fax': (this.productData.fax !== undefined) ? this.productData.fax : '',
              'discount': (this.productData.discount !== undefined) ? this.productData.discount : '',
              'allow_banktransfer': (this.productData.allow_banktransfer !== undefined) ? this.productData.allow_banktransfer : false,
              'state': (this.productData.state !== undefined) ? this.productData.state : '',
              'password': (this.productData.password !== undefined) ? this.productData.password : '',
              'user_password': (this.productData.user_password) ? this.productData.user_password : '',
              'newsletter': (this.productData.newsletter !== undefined) ? this.productData.newsletter : false,
              'active': (this.productData.active !== undefined) ? this.productData.active : ''
            }
            console.log(postData)
            let data = ''
            if (!this.isNew) {
              data = await this.$axios.$put(this.$store.state.apiUrl + '/admin/customer', postData, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            } else {
              data = await this.$axios.$post(this.$store.state.apiUrl + '/admin/customer', postData, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            }
            console.log(data)
            this.isLoading = false
            this.$toast.open('Saved')
            this.$router.push('/admin/customer')
          }
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
