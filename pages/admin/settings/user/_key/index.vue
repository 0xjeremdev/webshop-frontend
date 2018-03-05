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
        isLoading: true,
        isNew: true,
        productData: {},
        fields: {
          'User': {
            'lastname': {
              'inputType': 'input'
            },
            'firstname': {
              'inputType': 'input'
            },
            'company': {
              'inputType': 'input'
            },
            'street': {
              'inputType': 'input'
            },
            'housenr': {
              'inputType': 'input'
            },
            'postcode': {
              'inputType': 'input'
            },
            'city': {
              'inputType': 'input'
            },
            'country': {
              'inputType': 'input'
            },
            'email': {
              'inputType': 'input'
            },
            'phone': {
              'inputType': 'input'
            },
            'mobile': {
              'inputType': 'input'
            },
            'active': {
              'inputType': 'checkbox'
            },
            'username': {
              'inputType': 'input',
              'label': 'Username'
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
            console.log(fieldKey + ': ' + this.productData[fieldKey])
            if (this.productData[fieldKey] === 'true') { console.log('true') }
            return !this.productData[fieldKey]
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
          if (routeParams instanceof Object && routeParams.key !== 'new') {
            if (!(this.$store.state.authUser instanceof Object)) {
              this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
            }
            this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
            let query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p in User FILTER p._key == @key RETURN p', bindVars: { 'key': routeParams.key } }
            let data = await this.$axios.$post(this.$store.state.shopUrl + '/_api/cursor', query)
            console.log(data)
            this.productData = data['result'][0]
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
          console.log(this.productData)
          let query = {
            'options': {
              'fullCount': true
            },
            'count': true,
            'query': 'INSERT {  lastname: @lastname, firstname: @firstname, company: @company, street: @street, housenr: @housenr, postcode: @postcode, city: @city, country: @country, email: @email, phone: @phone, mobile: @mobile, active: @active, username: @username, password: @password } INTO User',
            'bindVars': {
              'lastname': this.productData.lastname,
              'firstname': this.productData.firstname,
              'company': this.productData.company,
              'street': this.productData.street,
              'housenr': this.productData.housenr,
              'postcode': this.productData.postcode,
              'city': this.productData.city,
              'country': this.productData.country,
              'email': this.productData.email,
              'phone': this.productData.phone,
              'mobile': this.productData.mobile,
              'active': this.productData.active,
              'username': this.productData.username,
              'password': this.productData.password
            }
          }
          if (!this.isNew) {
            query = {
              'options': {
                'fullCount': true
              },
              'count': true,
              'query': 'UPDATE { _key: \'' + this.productData['_key'] + '\' } WITH { lastname: @lastname, firstname: @firstname, company: @company, street: @street, housenr: @housenr, postcode: @postcode, city: @city, country: @country, email: @email, phone: @phone, mobile: @mobile, active: @active, username: @username, password: @password } IN User',
              'bindVars': {
                'lastname': this.productData.lastname,
                'firstname': this.productData.firstname,
                'company': this.productData.company,
                'street': this.productData.street,
                'housenr': this.productData.housenr,
                'postcode': this.productData.postcode,
                'city': this.productData.city,
                'country': this.productData.country,
                'email': this.productData.email,
                'phone': this.productData.phone,
                'mobile': this.productData.mobile,
                'active': this.productData.active,
                'username': this.productData.username,
                'password': this.productData.password
              }
            }
            console.log(query)
          }
          let data = await this.$axios.$post(this.$store.state.shopUrl + '/_api/cursor', query)
          console.log(data)
          this.isLoading = false
          this.$toast.open('Saved')
          this.$router.push('/admin/settings/user')
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
        this.$router.push('/admin/settings/user')
      }
    }
  }
</script>
