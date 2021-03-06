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
              <b-select multiple v-else-if="val.inputType === 'dropdownmulti'" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)">
                    <option v-for="option in val.options" :key="option.code" :value="option.code">{{ option.name }}</option>
              </b-select>
              <div v-else-if="val.inputType === 'tableInput'">
                <table v-if="temperatures" class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="temp in temperatures" :key="temp._key">
                      <td>{{ temp.temperatureDescription }}</td>
                      <td><b-input @input="setPrice($event, temp)" :value="getPrice(temp)"></b-input></td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Add/Edit Zone'
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
        showError: false,
        temperatures: {},
        formError: 'There are errors, please correct them to save',
        fields: {
          'Zones': {
            'zoneName': {
              'inputType': 'input',
              'label': 'Zone Name'
            },
            'zoneDescription': {
              'inputType': 'input',
              'label': 'Description'
            },
            'price': {
              'inputType': 'tableInput',
              'label': 'Price'
            },
            'mysort': {
              'inputType': 'input',
              'label': 'Sort'
            },
            'countryList': {
              'inputType': 'dropdownmulti',
              'label': 'Select your Country',
              'options': []
            },
            'active': {
              'inputType': 'checkbox',
              'label': 'Active'
            },
            icon: 'account'
          }
        }
      }
    },
    async created () {
      await this.getTemperatures()
      await this.getCountryList()
      await this.getData()
    },
    validate ({ params }) {
      // can be validated
      return params
    },
    methods: {
      setModel (val, fieldKey, tabKey) {
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
            return !this.productData[fieldKey]
          }
          if ((inputType === 'dropdownmulti')) return []
          return this.productData[fieldKey]
        }
        if (fieldKey === 'countryList') return []
        return ''
      },
      setCheckbox (val, fieldKey, tabKey) {
        this.productData[fieldKey] = !val
      },
      getPrice (temp) {
        if (this.productData['price'][temp.temperatureName] === undefined) {
          return temp.price
        }
        return this.productData['price'][temp.temperatureName]
      },
      setPrice (val, temp) {
        console.log(val)
        console.log(this.productData['price'][temp.temperatureName])
        console.log(this.productData['price'])
        this.productData['price'][temp.temperatureName] = val
      },
      async getTemperatures () {
        try {
          let temperatures = await this.$axios.$get(this.$store.state.apiUrl + '/admin/temperature', { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
          // console.log(temperatures)
          this.temperatures = temperatures.result._result
        } catch (e) {
          console.log(e)
        }
      },
      async getCountryList () {
        try {
          let countryList = await this.$store.dispatch('order/getCountryList')
          this.fields.Zones.countryList.options = countryList
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not load country list data')
        }
      },

      async getData () {
        try {
          this.isLoading = true
          let routeParams = this.$route.params
          // console.log(routeParams)
          if (routeParams instanceof Object && routeParams.key !== 'new') {
            // this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')

            let data = await this.$axios.$get(this.$store.state.apiUrl + '/admin/zones/' + routeParams.key, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            // console.log(data)
            this.productData = data['result']['_result'][0]
            this.isNew = false
            this.isLoading = false
          } else {
            this.isNew = true
            this.productData = {}
            if (this.productData instanceof Object) {
              for (var tabKey in this.fields) {
                for (var fieldKey in this.fields[tabKey]) {
                  if (fieldKey === 'countryList') {
                    this.productData[fieldKey] = []
                    continue
                  }
                  if (fieldKey === 'price') {
                    this.productData[fieldKey] = {}
                    continue
                  }
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
          case 'select':
            messages[fld] = await this.$store.dispatch('validation/validateSelect', { value: value })
            break
          default:
            messages[fld] = await this.$store.dispatch('validation/validateField', { value: value })
            break
        }

        this.message = '' // hack to let two way binding work if a key in an object has changed
        this.message = messages
        this.productData[fld] = value
      },
      async saveData () {
        try {
          this.isLoading = true
          this.validate(this.productData.zoneName, 'zoneName', 'field')
          this.validate(this.productData.zoneDescription, 'zoneDescription', 'field')
          // this.validate(this.productData.price, 'price', 'field')
          // this.validate(this.productData['mysort'], 'mysort', 'field')
          // this.validate(this.productData.countryList, 'countryList', 'field')
          // this.productData
          if (this.checkErrors) {
            this.showError = true
            this.isLoading = false
          }
          if (!this.checkErrors) {
            // console.log(this.productData)
            console.log(this.temperatures)
            for (let temp in this.temperatures) {
              if (this.productData['price'][temp.temperatureName] === undefined) {
                this.productData['price'][temp.temperatureName] = temp.price
              }
            }
            console.log(this.productData)
            let postData = {
              'key': (this.productData._key !== undefined) ? this.productData._key : '',
              'zoneName': (this.productData.zoneName !== undefined) ? this.productData.zoneName : '',
              'zoneDescription': (this.productData.zoneDescription !== undefined) ? this.productData.zoneDescription : '',
              'price': (this.productData.price !== undefined) ? this.productData.price : {},
              'mysort': (this.productData['mysort'] !== undefined) ? this.productData.mysort : '',
              'countryList': (this.productData.countryList !== undefined) ? this.productData.countryList : '',
              'active': (this.productData.active !== undefined) ? this.productData.active : ''
            }
            console.log(postData)
            /* this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer') */
            // let query = {'options': {'fullCount': true}, 'count': true, 'query': 'FOR p in k2p_product FILTER p.code == \'' + this.$route.params.code + '\' RETURN p'}
            // console.log(this.productData)
            // TODO: CHECK IF this.productData complies with fields before saving (this is necessary when isNew is True)
            let data = ''
            if (!this.isNew) {
              data = await this.$axios.$put(this.$store.state.apiUrl + '/admin/zones', postData, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            } else {
              data = await this.$axios.$post(this.$store.state.apiUrl + '/admin/zones', postData, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            }
            console.log(data)
            this.isLoading = false
            this.$toast.open('Saved')
            this.$router.push('/admin/settings/zones')
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
        this.$router.push('/admin/settings/zones')
      }
    }
  }
</script>
