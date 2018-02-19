<template>
  <div>
    <br />
    <b-tabs position="is-centered" class="block" type="is-toggle-rounded">
      <b-tab-item label="General" icon="file-document">
        <div v-if="!isLoading">
          <b-field horizontal v-for="value in generalAttributes" v-bind:data="value"
            v-bind:key="value.text" :label="translateAttributes[value]">
            <b-input v-if="value !== 'price' && value !== 'picture'" :value="testData[0].basic[value]"></b-input>
            <imageControl image="/images/Accus-Siezenis.png" v-else></imageControl>
          </b-field>
          <b-field horizontal><!-- Label left empty for spacing -->
            <p class="control">
              <button class="button is-primary">
                <b-icon icon="content-save"></b-icon>
                <span> Bewaren</span>
              </button>
            </p>
          </b-field>
        </div>
      </b-tab-item>
      <b-tab-item label="Attributes" icon="file-document-box">
        <div v-if="!isLoading">
          <b-field v-if="!checkFields(value, generalAttributes)" horizontal v-for="value in generalAttributes" v-bind:data="value"
            v-bind:key="value.text" :label="value">
            <b-input :value="testData[0].basic[value]"></b-input>
          </b-field>
          <b-field horizontal><!-- Label left empty for spacing -->
            <p class="control">
              <button class="button is-primary">
                <b-icon icon="content-save"></b-icon>
                <span> Bewaren</span>
              </button>
            </p>
          </b-field>
        </div>
      </b-tab-item>
      <b-tab-item label="PDF Datasheet" icon="file-pdf">
        <section class="uploadSection">
          <b-field>
            <b-upload v-model="dropFiles"
              multiple
              drag-drop>
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon
                      icon="upload"
                      size="is-large">
                    </b-icon>
                  </p>
                  <p>Drop your files here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>

          <div class="tags">
            <span v-for="(file, index) in dropFiles"
              :key="index"
              class="tag is-primary" >
              {{file.name}}
              <button class="delete is-small"
                type="button"
                @click="deleteDropFile(index)">
              </button>
            </span>
          </div>
        </section>
      </b-tab-item>
      <b-tab-item label="SEO" icon="search-web">
        <div v-if="!isLoading">
          <b-field horizontal label="URL Slug">
            <b-input placeholder="URL Slug" value=""></b-input>
          </b-field>
          <b-field horizontal label="Product Tags">
            <b-taginput placeholder="Product Tags"
                maxtags="5"
                :value="[]">
            </b-taginput>
          </b-field>
          <b-field horizontal label="Meta Description">
            <b-input type="textarea" placeholder="Type your Product Description as displayed on Search Engines"></b-input>
          </b-field>
          <b-field horizontal label="Meta Keywords">
            <b-taginput placeholder="Meta Keywords"
                maxtags="5"
                :value="[]">
            </b-taginput>
          </b-field>
          <b-field horizontal label="Meta Author">
            <b-input placeholder="Meta Author" value=""></b-input>
          </b-field>
          <b-field horizontal><!-- Label left empty for spacing -->
            <p class="control">
              <button class="button is-primary">
                <b-icon icon="content-save"></b-icon>
                <span> Bewaren</span>
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
        testData: {},
        dropFiles: [],
        generalAttributes: [ 'code', 'name', 'description', 'picture', 'price', 'vat' ],
        translateAttributes: { 'code': 'ITK artikelnummer', 'name': 'Product Description', 'description': 'Alternative names', 'picture': 'Image 1', 'price': 'Image 2', 'vat': 'LabNed artikel nummer' },
        attributes: [''],
        // seoAttributes: { 'url_slug': 'URL Slug', 'search_tags': 'Search Tags', 'meta_keywords': 'Meta Keywords', 'meta_description': 'Meta Description', 'meta_author': 'Meta Author' },
        textAreaFields: [ 'Product Description ITK',
          'Extra information',
          'Additional disclaimer',
          'Physical form description',
          'Reconstitution Instructions',
          'Solubility/Reconstitution Instructions',
          'references',
          'review' ],
        toggleFields: [ 'Active Yes/No', 'MSDS Available?' ]
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
      async getData () {
        this.isLoading = true
        if (!(this.$store.state.authUser instanceof Object)) {
          this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
        }
        this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
        let query = {'options': {'fullCount': true}, 'count': true, 'query': 'FOR p in k2p_product FILTER p.code == \'' + this.$route.params.code + '\' RETURN p'}
        let data = await this.$axios.$post('http://localhost:8529/_db/key2publish/_api/cursor', query)
        console.log(data)
        this.testData = data['result']
        this.isLoading = false
      },
      async saveData () {
        if (!(this.$store.state.authUser instanceof Object)) {
          this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
        }
        this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
      },
      deleteDropFile (index) {
        this.dropFiles.splice(index, 1)
      },
      checkFields (col, arr) {
        return contains(col, arr)
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
