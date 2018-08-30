<template>
  <div id="config">
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
            <b-taginput v-else-if="val.inputType === 'tagInput'"
              :placeholder="getLabel(val, fieldKey)"
              maxtags="5"
              :value="[]">
            </b-taginput>
            <!-- <div v-else-if="val.inputType === 'texteditor'">
            <div class="quill-editor"  :instanceName="val.ref" :id="val.ref" :ref="val.ref"
              :value="getValue(val, fieldKey, tabKey)"
              @input="setModel($event, fieldKey, tabKey)"
              v-quill="editorConfig"></div>
              <br />
            </div> -->
            <editor v-else-if="val.inputType === 'texteditor'" :id="val.ref" :ref="val.ref" @input="setModel($event, fieldKey, tabKey)" :initial-value="getValue(val, fieldKey, tabKey)"
            :init="{plugins: 'advlist autolink link image lists charmap print preview code wordcount'}"
            apiKey="ajmdvsyicmj4n08v4wb7rhojisjuhy7056o4nivhid3rv4ns"></editor>
            <b-switch v-else-if="val.inputType === 'switch'" v-model="productData[fieldKey]"></b-switch>
            <b-input v-else-if="val.inputType === 'email'" type="email" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <b-input v-else-if="val.inputType === 'text'" type="textarea" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <b-input v-else-if="val.inputType === 'password'" type="password" @input="setModel($event, fieldKey, tabKey)" password-reveal></b-input>
            <b-checkbox-button  v-else-if="val.inputType === 'checkbox'" :value="getValue(val, fieldKey, tabKey, 'checkbox')" @input="setCheckbox($event, fieldKey, tabKey)" type="is-success"><b-icon icon="check"></b-icon></b-checkbox-button>
            <!-- <froala v-else-if="val.inputType === 'text'" :tag="'textarea'" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)" :config="config">Init text</froala> -->
            <b-select v-else-if="val.inputType === 'dropdown'" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)">
              <option v-for="option in val.options" :key="option" :value="option">{{ option }}</option>
            </b-select>
            <b-select expanded v-else-if="val.inputType === 'dropdown_country'" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)">
              <option v-for="option in countryList" :key="option.code" :value="option.code">{{ option.name }}</option>
            </b-select>
            <imageControl v-else-if="val.inputType === 'imageUpload'" :image="productData[fieldKey]" :type="val.type"></imageControl>
            <div v-else-if="val.inputType === 'tableInput'">
              <table v-if="productData[fieldKey]" class="table">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>On/Off</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(opt, key) in productData[fieldKey]" :key="key">
                    <td>{{ key }}</td>
                    <td><b-switch v-model="productData[fieldKey][key]"></b-switch></td>
                  </tr>
                </tbody>
              </table>
            </div>
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
  import imageControl from '~/components/ui/Imagecontrol'
  import Editor from '@tinymce/tinymce-vue'

  export default {
    layout: 'admin',
    components: { imageControl, Editor },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Configuration',
        script: [
          { src: 'https://cloud.tinymce.com/stable/tinymce.min.js?apiKey=ajmdvsyicmj4n08v4wb7rhojisjuhy7056o4nivhid3rv4ns' }
        ]
      }
    },
    data () {
      return {
        myimages: ['Accus-Siezenis.png'],
        editorConfig: {},
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
        isLoading: false,
        productData: {},
        fields: {
          'General': {
            'maintenance': {
              'inputType': 'switch',
              'label': 'Maintenance Mode'
            },
            'cookie_wall': {
              'inputType': 'switch',
              'label': 'Cookie Wall'
            },
            'cookie_wall_text': {
              'inputType': 'texteditor',
              'label': 'Cookie Wall Text',
              'ref': 'cookie_wall_text'
            },
            icon: 'file-document'
          },
          'Banner': {
            'banner': {
              'inputType': 'imageUpload',
              'label': 'Banner',
              'type': 'banner'
            },
            'banner2': {
              'inputType': 'imageUpload',
              'label': 'Banner 2',
              'type': 'banner2'
            },
            icon: 'file-image'
          },
          'Contact': {
            'contact_email': {
              'inputType': 'email',
              'label': 'E-mail'
            },
            'contact_name': {
              'inputType': 'input',
              'label': 'Name'
            },
            'contact_street': {
              'inputType': 'input',
              'label': 'Street'
            },
            'contact_houseno': {
              'inputType': 'input',
              'label': 'House No.'
            },
            'contact_postcode': {
              'inputType': 'input',
              'label': 'Postcode'
            },
            'contact_city': {
              'inputType': 'input',
              'label': 'City'
            },
            'contact_country': {
              'inputType': 'dropdown_country',
              'label': 'Country',
              'options': []
            },
            'contact_phone': {
              'inputType': 'input',
              'label': 'Phone'
            },
            'contact_phone_int': {
              'inputType': 'input',
              'label': 'International Phone'
            },
            'contact_vatno': {
              'inputType': 'input',
              'label': 'VAT No.'
            },
            'contact_cocno': {
              'inputType': 'input',
              'label': 'COC No.'
            },
            'contact_bank': {
              'inputType': 'input',
              'label': 'Bank'
            },
            'contact_IBAN': {
              'inputType': 'input',
              'label': 'IBAN'
            },
            'contact_BIC': {
              'inputType': 'input',
              'label': 'BIC'
            },
            icon: 'contact-mail'
          },
          'Mail': {
            'order_email_text': {
              'inputType': 'texteditor',
              'label': 'Order E-mail Text',
              'ref': 'order_email_text'
            },
            'contact_email_text': {
              'inputType': 'texteditor',
              'label': 'Contact E-mail Text',
              'ref': 'contact_email_text'
            },
            'register_email_text': {
              'inputType': 'texteditor',
              'label': 'Registration E-mail Text',
              'ref': 'register_email_text'
            },
            'verify_email_text': {
              'inputType': 'texteditor',
              'label': 'Verify E-mail Text',
              'ref': 'verify_email_text'
            },
            'delete_customer_email_text': {
              'inputType': 'texteditor',
              'label': 'Delete Customer E-mail Text',
              'ref': 'delete_customer_email_text'
            },
            icon: 'email'
          },
          'Order': {
            'order_email': {
              'inputType': 'email',
              'label': 'Order E-mail'
            },
            'VAT': {
              'inputType': 'input',
              'label': 'VAT (in %)'
            },
            'order_prefix': {
              'inputType': 'input',
              'label': 'Order No Prefix'
            },
            'order_date': {
              'inputType': 'switch',
              'label': 'Order No Date Added'
            },
            'orderno_inc': {
              'inputType': 'input',
              'label': 'Order No Start Value'
            },
            'orderno_size': {
              'inputType': 'input',
              'label': 'Order No Size'
            },
            icon: 'cart'
          },
          'Payment': {
            'payment_testmode': {
              'inputType': 'switch',
              'label': 'Testmode'
            },
            'payment_link': {
              'inputType': 'input',
              'label': 'Buckaroo Live Link'
            },
            'payment_testlink': {
              'inputType': 'input',
              'label': 'Buckaroo Test Link'
            },
            'payment_secretKey': {
              'inputType': 'input',
              'label': 'Buckaroo Secret Key'
            },
            'payment_websiteKey': {
              'inputType': 'input',
              'label': 'Buckaroo Website Key'
            },
            'payment_options': {
              'inputType': 'tableInput',
              'label': 'Payment Options'
            },
            'payment_ReturnURL': {
              'inputType': 'input',
              'label': 'Return URL'
            },
            'payment_ReturnURLError': {
              'inputType': 'input',
              'label': 'Return Error URL'
            },
            'payment_ReturnURLReject': {
              'inputType': 'input',
              'label': 'Return Reject URL'
            },
            'payment_ReturnURLCancel': {
              'inputType': 'input',
              'label': 'Return Cancel URL'
            },
            'paymentlogos': {
              'inputType': 'imageUpload',
              'label': 'Payment Logos',
              'type': 'paymentlogos'
            },
            icon: 'credit-card'
          },
          'Social': {
            'facebook_link': {
              'inputType': 'input',
              'label': 'Facebook'
            },
            'linkedin_link': {
              'inputType': 'input',
              'label': 'LinkedIn'
            },
            icon: 'emoticon'
          }
        }
      }
    },
    async asyncData ({ store, app: { $axios } }) {
      try {
        if (!(store.state.authUser instanceof Object)) {
          this.$store.commit('SET_USER', this.$cookies.get('key2publish').authUser)
        }

        let data = await $axios.$get(store.state.apiUrl + '/admin/config')
        console.log(data)
        let countryList = await store.dispatch('order/getCountryList')
        return { productData: data.result._result[0], isNew: false, countryList: countryList }
      } catch (e) {
        // $toast.open('Could not load data')
        return { productData: {}, isNew: false, countryList: {} }
      }
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
            // console.log(fieldKey + ': ' + this.productData[fieldKey])
            if (this.productData[fieldKey] === 'true') { console.log('true') }
            return !this.productData[fieldKey]
          }
          return this.productData[fieldKey]
        }
        return null
      },
      setCheckbox (val, fieldKey, tabKey) {
        this.productData[fieldKey] = !val
      },
      async getData () {

      },
      async saveData () {
        try {
          this.isLoading = true
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', this.$cookies.get('key2publish').authUser)
          }
          let postData = {
            key: this.productData['_key'],
            maintenance: (this.productData.maintenance !== undefined) ? this.productData.maintenance : '',
            contact_email: (this.productData.contact_email !== undefined) ? this.productData.contact_email : '',
            order_email: (this.productData.order_email !== undefined) ? this.productData.order_email : new Date(),
            cookiewall: (this.productData.cookie_wall !== undefined) ? this.productData.cookie_wall : false,
            cookiewall_text: (this.productData.cookie_wall_text !== undefined) ? this.productData.cookie_wall_text : '',
            facebook_link: (this.productData.facebook_link !== undefined) ? this.productData.facebook_link : '',
            linkedin_link: (this.productData.linkedin_link !== undefined) ? this.productData.linkedin_link : '',
            VAT: (this.productData.VAT !== undefined) ? this.productData.VAT : '',
            orderno_inc: (this.productData.orderno_inc !== undefined) ? this.productData.orderno_inc : '',
            order_prefix: (this.productData.order_prefix !== undefined) ? this.productData.order_prefix : '',
            order_date: (this.productData.order_date !== undefined) ? this.productData.order_date : '',
            orderno_size: (this.productData.orderno_size !== undefined) ? this.productData.orderno_size : '',
            contact_name: (this.productData.contact_name !== undefined) ? this.productData.contact_name : '',
            contact_street: (this.productData.contact_street !== undefined) ? this.productData.contact_street : '',
            contact_houseno: (this.productData.contact_houseno !== undefined) ? this.productData.contact_houseno : '',
            contact_postcode: (this.productData.contact_postcode !== undefined) ? this.productData.contact_postcode : '',
            contact_city: (this.productData.contact_city !== undefined) ? this.productData.contact_city : '',
            contact_country: (this.productData.contact_country !== undefined) ? this.productData.contact_country : '',
            contact_phone: (this.productData.contact_phone !== undefined) ? this.productData.contact_phone : '',
            contact_phone_int: (this.productData.contact_phone_int !== undefined) ? this.productData.contact_phone_int : '',
            contact_vatno: (this.productData.contact_vatno !== undefined) ? this.productData.contact_vatno : '',
            contact_cocno: (this.productData.contact_cocno !== undefined) ? this.productData.contact_cocno : '',
            contact_bank: (this.productData.contact_bank !== undefined) ? this.productData.contact_bank : '',
            contact_IBAN: (this.productData.contact_IBAN !== undefined) ? this.productData.contact_IBAN : '',
            contact_BIC: (this.productData.contact_BIC !== undefined) ? this.productData.contact_BIC : '',
            order_email_text: (this.productData.order_email_text !== undefined) ? this.productData.order_email_text : '',
            contact_email_text: (this.productData.contact_email_text !== undefined) ? this.productData.contact_email_text : '',
            register_email_text: (this.productData.register_email_text !== undefined) ? this.productData.register_email_text : '',
            verify_email_text: (this.productData.verify_email_text !== undefined) ? this.productData.verify_email_text : '',
            delete_customer_email_text: (this.productData.delete_customer_email_text !== undefined) ? this.productData.delete_customer_email_text : '',
            payment_link: (this.productData.payment_link !== undefined) ? this.productData.payment_link : '',
            payment_testlink: (this.productData.payment_testlink !== undefined) ? this.productData.payment_testlink : '',
            payment_secretKey: (this.productData.payment_secretKey !== undefined) ? this.productData.payment_secretKey : '',
            payment_websiteKey: (this.productData.payment_websiteKey !== undefined) ? this.productData.payment_websiteKey : '',
            payment_testmode: (this.productData.payment_testmode !== undefined) ? this.productData.payment_testmode : false,
            payment_options: (this.productData.payment_options !== undefined) ? this.productData.payment_options : {},
            payment_ReturnURL: (this.productData.payment_ReturnURL !== undefined) ? this.productData.payment_ReturnURL : '',
            payment_ReturnURLError: (this.productData.payment_ReturnURLError !== undefined) ? this.productData.payment_ReturnURLError : '',
            payment_ReturnURLReject: (this.productData.payment_ReturnURLReject !== undefined) ? this.productData.payment_ReturnURLReject : '',
            payment_ReturnURLCancel: (this.productData.payment_ReturnURLCancel !== undefined) ? this.productData.payment_ReturnURLCancel : ''
          }
          let data = await this.$axios.$put(this.$store.state.apiUrl + '/admin/config', postData, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
          console.log(data)
          this.isLoading = false
          this.$toast.open('Saved')
          this.$router.push('/admin/dashboard')
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not save data, please try again')
          this.isLoading = false
        }
      },
      goBack () {
        this.$router.push('/admin/dashboard')
      }
    }
  }
</script>
