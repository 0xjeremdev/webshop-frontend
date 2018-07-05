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
            <imageControl v-else-if="val.inputType === 'imageUpload'" image="/images/Accus-Siezenis.png"></imageControl>
            <b-taginput v-else-if="val.inputType === 'tagInput'"
              :placeholder="getLabel(val, fieldKey)"
              maxtags="5"
              :value="[]">
            </b-taginput>
            <div class="quill-editor" v-else-if="val.inputType === 'texteditor'" ref="myTextEditor"
              :value="getValue(val, fieldKey, tabKey)"
              @input="setModel($event, fieldKey, tabKey)"
              v-quill:myQuillEditor="editorConfig"></div>
            <b-switch v-else-if="val.inputType === 'switch'" v-model="productData[fieldKey]"></b-switch>
            <b-input v-else-if="val.inputType === 'email'" type="email" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <b-input v-else-if="val.inputType === 'text'" type="textarea" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <b-input v-else-if="val.inputType === 'password'" type="password" @input="setModel($event, fieldKey, tabKey)" password-reveal></b-input>
            <b-checkbox-button  v-else-if="val.inputType === 'checkbox'" :value="getValue(val, fieldKey, tabKey, 'checkbox')" @input="setCheckbox($event, fieldKey, tabKey)" type="is-success"><b-icon icon="check"></b-icon></b-checkbox-button>
            <!-- <froala v-else-if="val.inputType === 'text'" :tag="'textarea'" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)" :config="config">Init text</froala> -->
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

  export default {
    layout: 'admin',
    components: { imageControl },
    data () {
      return {
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
          'Webshop Configuration': {
            'maintenance': {
              'inputType': 'switch',
              'label': 'Maintenance Mode'
            },
            'contact_email': {
              'inputType': 'email',
              'label': 'Contact E-mail'
            },
            'order_email': {
              'inputType': 'email',
              'label': 'Order E-mail'
            },
            'cookie_wall': {
              'inputType': 'switch',
              'label': 'Cookie Wall'
            },
            'cookie_wall_text': {
              'inputType': 'texteditor',
              'label': 'Cookie Wall Text'
            },
            'facebook_link': {
              'inputType': 'input',
              'label': 'Facebook'
            },
            'linkedin_link': {
              'inputType': 'input',
              'label': 'LinkedIn'
            },
            icon: 'file-document'
          }
        }
      }
    },
    created () {
      this.getData()
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
          if (!(this.$store.state.authUser instanceof Object)) {
            console.log(this)
            this.$store.commit('SET_USER', this.$cookies.get('key2publish').authUser)
          }

          let data = await this.$axios.$get(this.$store.state.apiUrl + '/admin/config')
          this.productData = data['result']['_result'][0]
          this.isNew = false
          this.isLoading = false
        } catch (e) {
          this.$toast.open('Could not load data')
          this.isLoading = false
        }
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
            linkedin_link: (this.productData.linkedin_link !== undefined) ? this.productData.linkedin_link : ''
          }
          let data = await this.$axios.$put(this.$store.state.apiUrl + '/admin/config', postData)
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
