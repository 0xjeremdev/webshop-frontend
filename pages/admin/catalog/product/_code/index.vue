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
    data () {
      return {
        isLoading: true,
        isNew: true,
        productData: {},
        dropFiles: [],
        fields: {
          'Product Information': {
            'code': {
              'inputType': 'input',
              'label': 'ITK artikelnummer',
              'disabled': true
            },
            'name': {
              'inputType': 'input',
              'label': 'Product Description'
            },
            'description': {
              'inputType': 'input',
              'label': 'Alternative names'
            },
            'picture': {
              'inputType': 'imageUpload',
              'label': 'Image 1'
            },
            'price': {
              'inputType': 'imageUpload',
              'label': 'Image 2'
            },
            'vat': {
              'inputType': 'input',
              'label': 'LabNed artikel nummer'
            },
            'Size': {
              'inputType': 'input'
            },
            'Product Type': {
              'inputType': 'input'
            },
            'Target': {
              'inputType': 'input'
            },
            'Reactivity': {
              'inputType': 'input'
            },
            'Cross-reactivity': {
              'inputType': 'input'
            },
            'Host': {
              'inputType': 'input'
            },
            'Source': {
              'inputType': 'input'
            },
            'Conjugate': {
              'inputType': 'input'
            },
            'Clone': {
              'inputType': 'input'
            },
            'Isotype': {
              'inputType': 'input'
            },
            'Peptide sequence': {
              'inputType': 'input'
            },
            'Immunogen': {
              'inputType': 'input'
            },
            'Concentration': {
              'inputType': 'input'
            },
            'Purification': {
              'inputType': 'input'
            },
            'icon': 'file-document'
          },
          'Properties': {
            'Purification': {
              'inputType': 'input'
            },
            'Biological activity': {
              'inputType': 'input'
            },
            'Buffer': {
              'inputType': 'input'
            },
            'Purity': {
              'inputType': 'input'
            },
            'Molecular Weight': {
              'inputType': 'input'
            },
            'Physical State': {
              'inputType': 'input'
            },
            'Appearance': {
              'inputType': 'input'
            },
            'Physical form description': {
              'inputType': 'input'
            },
            'Structure Available': {
              'inputType': 'input'
            },
            'Salt Form': {
              'inputType': 'input'
            },
            'Molecular Form': {
              'inputType': 'input'
            },
            'Formulation': {
              'inputType': 'input'
            },
            'Endotoxin Level': {
              'inputType': 'input'
            },
            'Binding Capacity': {
              'inputType': 'input'
            },
            'icon': ''
          },
          'Usage': {
            'Application & Usage': {
              'inputType': 'input'
            },
            'Recommened Dilution': {
              'inputType': 'input'
            },
            'Solubility/Reconstitution Instructions': {
              'inputType': 'input'
            },
            'Reconstitution Instructions': {
              'inputType': 'input'
            },
            'Handling': {
              'inputType': 'input'
            },
            'Sample inputType': {
              'inputType': 'input'
            },
            'Tags': {
              'inputType': 'input'
            },
            'Unit Definition': {
              'inputType': 'input'
            },
            'Packaging': {
              'inputType': 'input'
            },
            'Kit components': {
              'inputType': 'input'
            },
            'not supplied reagents & equipment': {
              'inputType': 'input'
            },
            'Storage Conditions': {
              'inputType': 'input'
            },
            'Shipping Conditions': {
              'inputType': 'input'
            },
            'Shelf life': {
              'inputType': 'input'
            },
            'icon': ''
          },
          'Background': {
            'BackGround': {
              'inputType': 'input'
            },
            'Extra information': {
              'inputType': 'text'
            },
            'Related Products': {
              'inputType': 'input'
            },
            'User note': {
              'inputType': 'input'
            },
            'References': {
              'inputType': 'text'
            },
            'icon': ''
          },
          'Additional Information': {
            'Protein GI #': {
              'inputType': 'input'
            },
            'Accession #': {
              'inputType': 'input'
            },
            'NCBI GENE ID #': {
              'inputType': 'input'
            },
            'NCBI OFFICIAL SYMBOL': {
              'inputType': 'input'
            },
            'NCBI OFFICIAL FULL NAME': {
              'inputType': 'input'
            },
            'NCBI ORGANISM': {
              'inputType': 'input'
            },
            'SWISSPROT #': {
              'inputType': 'input'
            },
            'GeneIDURL': {
              'inputType': 'input'
            },
            'ProteinID': {
              'inputType': 'input'
            },
            'ProteinIDURL': {
              'inputType': 'input'
            },
            'MDL Number': {
              'inputType': 'input'
            },
            'PubChem CID': {
              'inputType': 'input'
            },
            'SMILES': {
              'inputType': 'input'
            },
            'InChi': {
              'inputType': 'input'
            },
            'Cas number': {
              'inputType': 'input'
            },
            'EG number': {
              'inputType': 'input'
            },
            'REACH number': {
              'inputType': 'input'
            },
            'UNSPSC number': {
              'inputType': 'input'
            },
            'Review': {
              'inputType': 'input'
            },
            'icon': ''
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
        this.isLoading = true
        let routeParams = this.$route.params
        console.log(routeParams)
        if (routeParams instanceof Object && routeParams !== 'newProduct') {
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
          }
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
          let query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'FOR p in k2p_product FILTER p.code == @code RETURN p', bindVars: { 'code': routeParams.code } }
          let data = await this.$axios.$post('http://localhost:8529/_db/key2publish/_api/cursor', query)
          console.log(data)
          this.productData = data['result'][0]
          this.isNew = false
          this.isLoading = false
        } else {
          this.isNew = true
          this.productData = {}
          this.isLoading = false
        }
      },
      async saveData () {
        this.isLoading = true
        if (!(this.$store.state.authUser instanceof Object)) {
          this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
        }
        this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
        // let query = {'options': {'fullCount': true}, 'count': true, 'query': 'FOR p in k2p_product FILTER p.code == \'' + this.$route.params.code + '\' RETURN p'}
        // console.log(this.productData)
        // TODO: CHECK IF this.productData complies with fields before inserting (this is necessary when isNew is True)
        let query = { 'options': { 'fullCount': true }, 'count': true, 'query': 'UPDATE { _key: \'' + this.productData['_key'] + '\' } WITH { basic: @basic, seo: @seo } IN k2p_product', 'bindVars': { 'basic': this.productData.basic, 'seo': this.productData.seo } }
        // console.log(query)
        let data = await this.$axios.$post('http://localhost:8529/_db/key2publish/_api/cursor', query)
        console.log(data)
        // this.testData = data['result']
        this.isLoading = false
      },
      deleteDropFile (index) {
        this.dropFiles.splice(index, 1)
      },
      checkFields (col, arr) {
        return contains(col, arr)
      },
      goBack () {
        this.$router.push('/admin/catalog/product')
      }
    }
  }
</script>

<style scoped>
  .uploadSection {
    margin: auto;
    display: block;
    text-align: center;
  }
</style>
