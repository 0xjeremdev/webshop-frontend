<template>
  <div>
    <br />
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
            v-if="fieldKey !== 'icon' && tabKey !== 'Items'"
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
            <b-checkbox-button  v-else-if="val.inputType === 'checkbox'" :value="getValue(val, fieldKey, tabKey, 'checkbox')" @input="setCheckbox($event, fieldKey, tabKey)" type="is-success"><b-icon icon="check"></b-icon></b-checkbox-button>
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
                :date-formatter="(date => formatDate(date, fieldKey))"
                :date-parser="(date => parseDate(date, fieldKey))"
                v-model="productData[fieldKey]"
                :readonly="false">
            </b-datepicker>
            <b-select v-else-if="val.inputType === 'dropdown'" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)">
                  <option v-for="option in val.options" :key="option" :value="option">{{ option }}</option>
            </b-select>
            <span v-else-if="val.inputType === 'readonly'">{{ productData[fieldKey] }}</span>
            <b-input v-else value="Could not load this type"></b-input>
          </b-field>
          <div v-else-if="tabKey === 'Items'" class="container">
            <table class="table">
              <thead>
                <tr>
                  <th v-for="(value, index) in val.gridColumns" class="th-wrap">{{ val.gridLabels[index] }}</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <td class="th-wrap">&nbsp;</td>
                  <td colspan="3" class="th-wrap has-text-right"><strong>Subtotal (ex. VAT):</strong></td>
                  <td class="th-wrap has-text-right"><strong>€ {{ productData.subtotal }}</strong></td>
                </tr>
                <tr>
                  <td class="th-wrap">&nbsp;</td>
                  <td colspan="3" class="th-wrap has-text-right">Shipping Costs (ex. VAT):</td>
                  <td class="th-wrap has-text-right">€ {{ productData.shippingcosts }}</td>
                </tr>
                <tr>
                  <td class="th-wrap">&nbsp;</td>
                  <td colspan="3" class="th-wrap has-text-right"><strong>Total (ex. VAT):</strong></td>
                  <td class="th-wrap has-text-right"><strong>€ {{ productData.shippingtotal }}</strong></td>
                </tr>
                <tr>
                  <td class="th-wrap">&nbsp;</td>
                  <td colspan="3" class="th-wrap has-text-right">VAT:</td>
                  <td class="th-wrap has-text-right">€ {{ productData.vat }}</td>
                </tr>
                <tr>
                  <td class="th-wrap">&nbsp;</td>
                  <td colspan="3" class="th-wrap has-text-right"><strong>Total (inc. VAT):</strong></td>
                  <td class="th-wrap has-text-right"><strong>€ {{ productData.total }}</strong></td>
                </tr>
              </tfoot>
              <tbody>
                <tr v-for="(prod, nr) in productData.items">
                  <td v-if="value !== 'price'" v-for="(value) in val.gridColumns">{{ productData.items[nr][value] }}</td>
                  <td v-if="value === 'price'" v-for="(value) in val.gridColumns">€ {{ (parseFloat(productData.items[nr][value]) * Number(productData.items[nr].amount)).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
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
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import { contains } from '~/utils/utils'
  import imageControl from '~/components/ui/Imagecontrol'

  export default {
    layout: 'admin',
    components: { imageControl },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Add/Edit Quote'
      }
    },
    data () {
      return {
        options: {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }], // custom button values
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
              [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
              [{ 'direction': 'rtl' }], // text direction
              [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean'] // remove formatting button
            ]
          }
        },
        isLoading: true,
        isNew: true,
        productData: {},
        fields: {
          'Orders': {
            'order_no': {
              'inputType': 'input',
              'label': 'Order No'
            },
            'order_date': {
              'inputType': 'date',
              'label': 'Order Date'
            },
            'from_quote': {
              'inputType': 'checkbox',
              'label': 'From Quote'
            },
            'is_quote': {
              'inputType': 'checkbox',
              'label': 'Is Quote?'
            },
            'quote_date': {
              'inputType': 'date',
              'label': 'Quote Date'
            },
            icon: 'file-document'
          },
          'Quote By': {
            'title': {
              'inputType': 'dropdown',
              'label': 'Title',
              'options': ['Prof.', 'Drs.', 'Mr.', 'Ir.', 'Dr.', 'MD.', 'Ing.', 'Bsc.', 'Msc.', 'Mrs.']
            },
            'firstname': {
              'inputType': 'input',
              'label': 'Firstname'
            },
            'lastname': {
              'inputType': 'input',
              'label': 'Lastname'
            },
            'email': {
              'inputType': 'input',
              'label': 'Email'
            },
            'company': {
              'inputType': 'input',
              'label': 'Company'
            },
            'VAT_No': {
              'inputType': 'input',
              'label': 'VAT No'
            },
            'phone': {
              'inputType': 'input',
              'label': 'Phone'
            },
            'fax': {
              'inputType': 'input',
              'label': 'Fax'
            },
            'mobile': {
              'inputType': 'input',
              'label': 'Mobile'
            }
          },
          'Items': {
            'gridOptions': {
              'gridColumns': [ 'id', 'name', 'shipping', 'amount', 'price' ],
              'gridLabels': [ 'LABNED ID', 'Description', 'Shipping', 'Amount', 'Price' ],
              'gridTypes': { 'id': 'string', 'name': 'string', 'shipping': 'string', 'amount': 'string', 'price': 'string' }
            }
          }
        },
        selectedDate: ''
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
      formatDate (val, fieldKey) {
        let newDate = new Date()
        let newHour = newDate.getHours()
        let newMinutes = newDate.getMinutes()
        let newSeconds = newDate.getSeconds()

        let year = val.getFullYear()
        let month = val.getMonth(-1)
        let day = val.getDate()
        let hour = val.getHours()
        let minutes = val.getMinutes()
        let seconds = val.getSeconds()

        if ((hour === 0) && (minutes === 0) && (seconds === 0)) {
          hour = newHour
          minutes = newMinutes
          seconds = newSeconds
        }

        return day + '-' + month + '-' + year + ' ' + hour + ':' + minutes + ':' + seconds
      },
      parseDate (val, fieldKey) {
        val = new Date(val)
        let newDate = new Date()
        let newHour = newDate.getHours()
        let newMinutes = newDate.getMinutes()
        let newSeconds = newDate.getSeconds()

        let year = val.getFullYear()
        let month = val.getMonth(-1)
        let day = val.getDate()
        let hour = val.getHours()
        let minutes = val.getMinutes()
        let seconds = val.getSeconds()

        if ((hour === 0) && (minutes === 0) && (seconds === 0)) {
          hour = newHour
          minutes = newMinutes
          seconds = newSeconds
        }

        let myDate = new Date(year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds)
        this.productData[fieldKey] = myDate
        return myDate
      },
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
          switch (tabKey) {
            case 'Orders':
              if (inputType === 'checkbox') {
                return !this.productData[fieldKey]
              } else if (inputType === 'date') {
                let d = new Date(this.productData[fieldKey])
                return d
              }
              return this.productData[fieldKey]
            case 'Customer':
              if (this.productData.customer !== undefined) {
                if (inputType === 'checkbox') {
                  return !this.productData.customer[fieldKey]
                } else if (inputType === 'date') {
                  let d = new Date(this.productData.customer[fieldKey])
                  return d
                }
                return this.productData.customer[fieldKey]
              }
              break
            case 'Quote By':
              if (this.productData.quote_by !== undefined) {
                if (inputType === 'checkbox') {
                  return !this.productData.quote_by[fieldKey]
                } else if (inputType === 'date') {
                  let d = new Date(this.productData.quote_by[fieldKey])
                  return d
                }
                return this.productData.quote_by[fieldKey]
              }
              break
            case 'Billing':
              if (this.productData.billing_address !== undefined) {
                if (inputType === 'checkbox') {
                  return !this.productData.billing_address[fieldKey]
                } else if (inputType === 'date') {
                  let d = new Date(this.productData.billing_address[fieldKey])
                  return d
                }
                return this.productData.billing_address[fieldKey]
              }
              break
            case 'Delivery':
              if (this.productData.delivery_address !== undefined) {
                if (inputType === 'checkbox') {
                  return !this.productData.delivery_address[fieldKey]
                } else if (inputType === 'date') {
                  let d = new Date(this.productData.delivery_address[fieldKey])
                  return d
                }
                return this.productData.delivery_address[fieldKey]
              }
              break
          }
        }
        return ''
      },
      setCheckbox (val, fieldKey, tabKey) {
        this.productData[fieldKey] = !val
      },
      async getData () {
        try {
          this.isLoading = true
          let routeParams = this.$route.params
          // console.log(routeParams)
          if (routeParams instanceof Object && routeParams.key !== 'newproduct') {
            if (!(this.$store.state.authUser instanceof Object)) {
              this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
            }
            let data = await this.$axios.$get(this.$store.state.apiUrl + '/admin/quote/' + routeParams.key, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            console.log(data)
            this.productData = data['result']['_result'][0]
            this.productData.order_date = new Date(this.productData.order_date)
            this.productData.quote_date = new Date(this.productData.quote_date)
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
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
          }
          // validation necessary
          let postData = this.productData
          let data = await this.$axios.$post(this.$store.state.apiUrl + '/admin/quote', postData, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
          console.log(data)
          // this.testData = data['result']
          this.isLoading = false
        } catch (e) {
          this.$toast.open('Could not save data, please try again')
        }
      },
      checkFields (col, arr) {
        return contains(col, arr)
      },
      goBack () {
        this.$router.push('/admin/order')
      }
    }
  }
</script>
