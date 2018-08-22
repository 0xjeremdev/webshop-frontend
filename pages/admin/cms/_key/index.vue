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
            <editor v-else-if="val.inputType === 'texteditor'" ref="myTextEditor" @input="setModel($event, fieldKey, tabKey)" :initial-value="getValue(val, fieldKey, tabKey)"
            :init="{plugins: 'advlist autolink link image lists charmap print preview code wordcount'}"
            apikey="ajmdvsyicmj4n08v4wb7rhojisjuhy7056o4nivhid3rv4ns"></editor>
            <!-- <div class="quill-editor" v-else-if="val.inputType === 'texteditor'" ref="myTextEditor"
              :value="getValue(val, fieldKey, tabKey)"
              @input="setModel($event, fieldKey, tabKey)"
              v-quill:myQuillEditor="options"></div> -->
            <b-input v-else-if="val.inputType === 'text'" type="textarea" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <b-input v-else-if="val.inputType === 'password'" type="password" @input="setModel($event, fieldKey, tabKey)" password-reveal></b-input>
            <b-checkbox-button  v-else-if="val.inputType === 'checkbox'" :value="!getValue(val, fieldKey, tabKey, 'checkbox')" @input="setCheckbox($event, fieldKey, tabKey)" type="is-success"><b-icon :icon="getIcon(val, fieldKey, tabKey)"></b-icon></b-checkbox-button>
            <!-- <froala v-else-if="val.inputType === 'text'" :tag="'textarea'" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)" :config="config">Init text</froala> -->
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
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  </div>
</template>

<script>
  // import Cookies from 'js-cookie'
  import { contains } from '~/utils/utils'
  import imageControl from '~/components/ui/Imagecontrol'

  import Editor from '@tinymce/tinymce-vue'

  export default {
    layout: 'admin',
    components: { imageControl, Editor },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Add/Edit CMS page',
        script: [
          { src: 'https://cloud.tinymce.com/stable/tinymce.min.js?apiKey=ajmdvsyicmj4n08v4wb7rhojisjuhy7056o4nivhid3rv4ns' }
        ]
      }
    },
    data () {
      return {
        /* editorConfig: {},
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
        }, */
        isLoading: true,
        isNew: true,
        productData: {
          publish_date: new Date(),
          active: false
        },
        fields: {
          'CMS': {
            'title': {
              'inputType': 'input',
              'label': 'Title'
            },
            'article': {
              'inputType': 'texteditor',
              'label': 'Article'
            },
            'publish_date': {
              'inputType': 'date',
              'label': 'Publish Date'
            },
            'author': {
              'inputType': 'input',
              'label': 'Author'
            },
            'mysort': {
              'inputType': 'input',
              'label': 'Sort'
            },
            'section': {
              'inputType': 'dropdown',
              'label': 'Section',
              'options': ['navbar', 'footer']
            },
            'active': {
              'inputType': 'checkbox',
              'label': 'Active'
            },
            icon: 'file-document'
          },
          'SEO': {
            'url_slug': {
              'inputType': 'input',
              'label': 'URL Slug'
            },
            'product_tags': {
              'inputType': 'tagInput',
              'label': 'Product Tags'
            },
            'meta_description': {
              'inputType': 'text',
              'label': 'Meta Description'
            },
            'meta_keywords': {
              'inputType': 'tagInput',
              'label': 'Meta Keywords'
            },
            'meta_author': {
              'inputType': 'input',
              'label': 'Meta Author'
            },
            'icon': 'search-web'
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
      /* getHTML () {
        console.log(this.$refs.myTextEditor[0].quill.root.innerHTML)
      }, */
      getIcon (val, fieldKey, tabKey) {
        if (this.productData[fieldKey]) {
          return 'check'
        }
        return 'close'
      },
      setModel (val, fieldKey, tabKey) {
        if (tabKey === 'SEO') {
          this.productData.seo[fieldKey] = val
        } else {
          this.productData[fieldKey] = val
        }
      },
      getLabel (val, fieldKey) {
        if (val.label) {
          return val.label
        }
        return fieldKey
      },
      getValue (val, fieldKey, tabKey) {
        // console.log(val)
        // console.log(fieldKey)
        // console.log(this.productData[fieldKey])
        if (this.productData instanceof Object) {
          if (tabKey === 'SEO') {
            return this.productData['seo'][fieldKey]
          }
          return this.productData[fieldKey]
        }
        switch (val.inputType) {
          case 'checkbox':
            return false
          case 'date':
            return new Date()
          default:
            return ''
        }
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
            let query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p in Blog FILTER p._key == @key RETURN p', bindVars: { 'key': routeParams.key } }
            console.log(query) */
            let data = await this.$axios.$get(this.$store.state.apiUrl + '/admin/page/' + routeParams.key, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
            // console.log(data)
            this.productData = data['result']['_result'][0]
            this.productData['publish_date'] = new Date(this.productData['publish_date'])
            this.isNew = false
            this.isLoading = false
          } else {
            this.isNew = true
            this.productData.seo = {}
            if (this.productData instanceof Object) {
              for (var tabKey in this.fields) {
                for (var fieldKey in this.fields[tabKey]) {
                  if (tabKey === 'SEO') {
                    this.productData['seo'][fieldKey] = ''
                  } else {
                    this.productData[fieldKey] = ''
                  }
                }
              }
            }
            this.productData.publish_date = new Date()
            this.productData.active = false

            // console.log(this.productData)
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
          let postData = {
            id: this.productData['_key'],
            title: (this.productData.title !== undefined) ? this.productData.title : '',
            article: (this.productData.article !== undefined) ? this.productData.article : '',
            publish_date: (this.productData.publish_date !== undefined) ? this.productData.publish_date : new Date(),
            mysort: (this.productData.mysort !== undefined) ? this.productData.mysort : '',
            section: (this.productData.section !== undefined) ? this.productData.section : '',
            active: (this.productData.active !== undefined) ? this.productData.active : false,
            seo: (this.productData.seo !== undefined) ? this.productData.seo : '',
            user: (this.productData.user !== undefined) ? this.productData.user : 'LabNed.com'
          }
          let data = null
          if (!this.isNew) {
            data = await this.$axios.$put(this.$store.state.apiUrl + '/admin/page', postData, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
          } else {
            data = await this.$axios.$post(this.$store.state.apiUrl + '/admin/page', postData, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
          }
          console.log(data)
          this.isLoading = false
          this.$toast.open({ message: 'Saved', type: 'is-success' })
          this.$router.push('/admin/cms')
        } catch (e) {
          console.log(e)
          this.$toast.open({ message: 'Could not save data, please try again', type: 'is-danger' })
          this.isLoading = false
        }
      },
      checkFields (col, arr) {
        return contains(col, arr)
      },
      goBack () {
        this.$router.push('/admin/cms')
      }
    }
  }
</script>
