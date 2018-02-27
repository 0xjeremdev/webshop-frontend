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
            <quill v-else-if="val.inputType === 'texteditor'" :options="options" :ref="qc"></quill>
            <b-input v-else-if="val.inputType === 'text'" type="textarea" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
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
  import Cookies from 'js-cookie'
  import { contains } from '~/utils/utils'
  import imageControl from '~/components/ui/Imagecontrol'
  import Quill from 'vue-bulma-quill'

  export default {
    layout: 'admin',
    components: { imageControl, Quill },
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
          'Category': {
            'title': {
              'inputType': 'input'
            },
            'article': {
              'inputType': 'texteditor'
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
        if (this.productData instanceof Object) {
          if (tabKey === 'SEO') {
            return this.productData['seo'][fieldKey]
          }
          return this.productData[fieldKey]
        }
        return ''
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
            let query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p in Blog FILTER p._key == @key RETURN p', bindVars: { 'key': routeParams.key } }
            console.log(query)
            let data = await this.$axios.$post(this.$store.state.shopUrl + '/_api/cursor', query)
            console.log(data)
            this.productData = data['result'][0]
            this.isNew = false
            this.isLoading = false
          } else {
            this.isNew = true
            this.productData = {}
            this.productData.seo = {}
            this.productData.basic = {}
            if (this.productData instanceof Object) {
              for (var tabKey in this.fields) {
                for (var fieldKey in this.fields[tabKey]) {
                  if (tabKey === 'SEO') {
                    this.productData['seo'][fieldKey] = ''
                  } else {
                    this.productData['basic'][fieldKey] = ''
                  }
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
          let query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'UPDATE { _key: \'' + this.productData['_key'] + '\' } WITH { title: @title, article: @article, seo: @seo } IN Blog', 'bindVars': { 'title': this.productData.title, 'article': this.productData.article, 'seo': this.productData.seo } }
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
        this.$router.push('/admin/blog')
      }
    }
  }
</script>

<style lang="stylus">
   @import "~quill/assets/snow"
</style>
