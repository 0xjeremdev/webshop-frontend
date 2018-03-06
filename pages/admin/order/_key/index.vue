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
            <span v-else-if="val.inputType === 'readonly'">{{ productData[fieldKey] }}</span>
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
            'quote_date': {
              'inputType': 'date',
              'label': 'Quote Date'
            },
            icon: 'file-document'
          },
          'Items': {
            'items': {
              inputType: 'table'
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
      async getData () {
        try {
          this.isLoading = true
          let routeParams = this.$route.params
          // console.log(routeParams)
          if (routeParams instanceof Object && routeParams.key !== 'newproduct') {
            if (!(this.$store.state.authUser instanceof Object)) {
              this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
            }
            this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
            let query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p in Order FILTER p._key == @key RETURN p', bindVars: { 'key': routeParams.key } }
            console.log(query)
            let data = await this.$axios.$post(this.$store.state.shopUrl + '/_api/cursor', query)
            console.log(data)
            this.productData = data['result'][0]
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
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
          // let query = {'options': {'fullCount': true}, 'count': true, 'query': 'FOR p in k2p_product FILTER p.code == \'' + this.$route.params.code + '\' RETURN p'}
          // console.log(this.productData)
          // TODO: CHECK IF this.productData complies with fields before saving (this is necessary when isNew is True)
          let query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'UPDATE { _key: \'' + this.productData['_key'] + '\' } WITH { title: @title, article: @article, seo: @seo } IN Order', 'bindVars': { 'title': this.productData.title, 'article': this.productData.article, 'seo': this.productData.seo } }
          // console.log(query)
          let data = await this.$axios.$post(this.$store.state.shopUrl + '/_api/cursor', query)
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
