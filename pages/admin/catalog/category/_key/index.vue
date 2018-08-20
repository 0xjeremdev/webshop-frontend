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
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Add/Edit Category'
      }
    },
    data () {
      return {
        isLoading: true,
        isNew: true,
        productData: {},
        fields: {
          'Category': {
            'code': {
              'inputType': 'input'
            },
            'name': {
              'inputType': 'input'
            },
            'description': {
              'inputType': 'text'
            },
            'picture': {
              'inputType': 'imageUpload'
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
          this.productData.basic[fieldKey] = val
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
          return this.productData['basic'][fieldKey]
        }
        return ''
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
            let query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p in k2p_category FILTER p._key == @key RETURN p', bindVars: { 'key': routeParams.key } }
            let data = await this.$axios.$post('http://localhost:8529/_db/key2publish/_api/cursor', query, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
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
          // console.log(routeParams)
          let query = {
            'options': {
              'fullCount': true
            },
            'count': true,
            'query': 'INSERT { basic: @basic, seo: @seo } INTO k2p_category',
            'bindVars': {
              'basic': this.productData.basic,
              'seo': this.productData.seo
            }
          }
          if (!this.isNew) {
            query = {
              'options': {
                'fullCount': true
              },
              'count': true,
              'query': 'UPDATE { _key: \'' + this.productData['_key'] + '\' } WITH { basic: @basic, seo: @seo } IN k2p_category',
              'bindVars': {
                'basic': this.productData.basic,
                'seo': this.productData.seo
              }
            }
            // console.log(query)
          }
          let data = await this.$axios.$post(this.$store.state.productUrl + '/_api/cursor', query, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
          console.log(data)
          this.isLoading = false
          this.$toast.open('Saved')
          this.$router.push('/admin/catalog/category')
        } catch (e) {
          this.$toast.open('Could not save data, please try again')
        }
      },
      checkFields (col, arr) {
        return contains(col, arr)
      },
      goBack () {
        this.$router.push('/admin/catalog/category')
      }
    }
  }
</script>
