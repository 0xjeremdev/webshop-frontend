<template>
  <section class="container">
    <div class="columns my-margin-top">
      <div class="column">
          <breadCrumb :info="product.basic.name"></breadCrumb>
      </div>
      <div class="column">

      </div>
    </div>
    <!-- <hr class="navbar-divider my_div"> -->
    <div class="container">
      <div class="columns">
        <div class="column is-one-third">
          <div class="sticky">
          <p class="title my-img">{{ (Number(product.basic['Price LabNed']).toFixed(2) !== 'NaN') ? '€ ' + Number(product.basic['Price LabNed']).toFixed(2) : 'Inquire' }}</p>
          <div class="columns is-mobile">
            <div class="column">
              <button v-if="(Number(product.basic['Price LabNed']).toFixed(2) === 'NaN')" class="button is-primary my-img" @click="doInquire(product.basic.vat)"><b-icon icon="comment-question-outline"></b-icon><span>Inquire</span></button>
              <button v-else class="button is-primary my-img" :disabled="(Number(product.basic['Price LabNed']).toFixed(2) !== 'NaN') ? false : true" @click="addToCart(product.basic.vat, product.basic['name'], product.basic['Price LabNed'], false)"><b-icon icon="cart-outline"></b-icon><span>Add to Cart</span></button>
            </div>
            <div class="column">
              <button class="button is-info my-img" :disabled="(Number(product.basic['Price LabNed']).toFixed(2) !== 'NaN') ? false : true" @click="addToCart(product.basic.vat, product.basic['name'], product.basic['Price LabNed'], true)"><b-icon icon="file-document-box"></b-icon><span>Add to Quote</span></button>
            </div>
          </div>
          <br />
          <div class="columns is-mobile">
            <div class="column">
              <img v-if="product.basic.image" class="my-img" :src="apiUrl + '/img/product/' + product.basic.vat.charAt(2) + product.basic.vat.charAt(3) + '/' + product.basic.image" alt="Image1" />
              <span>{{ product.basic.image1_text }}</span>
              <!-- <img class="my-img" src="https://wikiki.github.io/images/merry-christmas.jpg" /> -->
            </div>
            <div class="column">
              <img v-if="product.basic.price" class="my-img" :src="apiUrl + '/img/product/' + product.basic.vat.charAt(2) + product.basic.vat.charAt(3) + '/' + product.basic.price" alt="Image2" />
              <span>{{ product.basic.image2_text }}</span>
              <!-- <img class="my-img" src="https://wikiki.github.io/images/singer.jpg" /> -->
            </div>
          </div>
          </div>
        </div>
        <div class="column">
          <h2 class="subtitle">{{ product.basic.name }} - {{ product.basic.vat }}</h2>
          <div class="has-text-right"><button class="button is-primary" style="width: 150px; margin-top: -0.5rem; margin-bottom: 0.75rem;" @click="showPDF(product.basic.vat)"><b-icon icon="file-pdf"></b-icon><span>PDF Datasheet</span></button></div>
          <b-collapse class="card" v-for="(value, tabKey) in fields" :key="tabKey" v-if="hasContent(tabKey)" :open="(tabKey === 'Product Information')">
            <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">
                    {{ tabKey }} <p v-if="tabKey === 'Product Information'" class="control"></p>
                </p>
                <a class="card-header-icon">
                    <b-icon
                        :icon="props.open ? 'menu-down' : 'menu-up'">
                    </b-icon>
                </a>
            </div>
            <div class="card-content">
                <div class="content">
                  <table class="table">
                    <tbody>
                      <tr v-if="(product.basic[fieldKey] !== undefined && product.basic[fieldKey] !== null && product.basic[fieldKey].trim() !== '') && (fieldKey !== 'icon')" v-for="(val, fieldKey) in value" :key="fieldKey">
                        <td><p>{{ (typeof val.label !== 'undefined') ? val.label : fieldKey }}</p></td>
                        <td><p>{{ product.basic[fieldKey] }}</p></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
          </b-collapse>
          <!-- <b-tabs position="is-centered" class="block" inputType="is-toggle-rounded">
            <b-tab-item v-for="(value, tabKey) in fields" :key="tabKey" :label="tabKey" :icon="fields[tabKey].icon">

            </b-tab-item>
          </b-tabs> -->
        </div>
      </div>
    </div>
    <b-modal :active.sync="modalActive" has-modal-card>
      <request-pdf :productid="product.basic.vat"></request-pdf>
    </b-modal>
    <b-modal :active.sync="modalInquireActive" has-modal-card>
      <inquire :productid="product.basic.vat"></inquire>
    </b-modal>
  </section>
</template>

<script>
  // import Cookies from 'js-cookie'
  import breadCrumb from '~/components/widgets/breadcrumb.vue'
  import Banner from '~/components/widgets/banner.vue'
  import requestPdf from '~/components/ui/requestPDF.vue'
  import inquire from '~/components/ui/inquire.vue'

  export default {
    components: { breadCrumb, Banner, requestPdf, inquire },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities',
        titleTemplate: `${this.product.basic.name.replace(/-+/g, ' ')}`,
        meta: [
          { hid: 'description', name: 'description', content: `${this.product.seo.meta_description}` },
          { hid: 'web_author', name: 'web_author', content: `${this.product.seo.meta_author}` },
          { hid: 'keywords', name: 'keywords', content: `${this.product.seo.meta_tags}` },
          { hid: 'robots', name: 'robots', content: 'index, follow' },
          { hid: 'revisit-after', name: 'revisit-after', content: '1 day' }
        ]
      }
    },
    data () {
      return {
        modalActive: false,
        modalInquireActive: false,
        apiUrl: this.$store.state.apiUrl,
        product: {},
        fields: {
          'Product Information': {
            'vat': {
              'inputType': 'input',
              'label': 'Article number',
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
            'Applications': {
              'inputType': 'input'
            },
            'icon': 'file-document'
          },
          'Properties': {
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
            'Application  Usage': {
              'inputType': 'input',
              'label': 'Application & Usage'
            },
            'Recommended Dilution': {
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
            'Sample Type': {
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
            'not supplied reagents  equipment': {
              'inputType': 'input',
              'label': 'not supplied reagents & equipment'
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
            'Background': {
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
            'references': {
              'inputType': 'text',
              'label': 'References'
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
            'review': {
              'inputType': 'input',
              'label': 'Review'
            },
            'icon': ''
          }
        }
      }
    },
    async asyncData ({ store, params, error, app: { $axios } }) {
      try {
        let content = {}
        let { data } = await $axios.get(store.state.apiUrl + '/product/' + params.product)
        if (data['result'] !== undefined && data['result']['_result'].length > 0) content = data['result']['_result'][0]
        if (data['result'] === undefined || data['result']['_result'].length <= 0) error({'statusCode': 404, 'message': 'Page Not Found'})
        return { product: content }
      } catch (e) {
        console.log(e)
      }
      /* return $axios.get(store.state.apiUrl + '/product/' + params.product)
        .then((res) => {
          console.log('_product loading')
          return { product: res.data.result['_result'][0] }
        })
        .catch((e) => {
          error({ statusCode: 404, message: 'Post not found' })
        }) */
    },
    methods: {
      hasContent (tabKey) {
        let active = false
        for (let fieldKey in this.fields[tabKey]) {
          if ((this.product.basic[fieldKey] !== undefined && this.product.basic[fieldKey] !== null && this.product.basic[fieldKey].trim() !== '') && (fieldKey !== 'icon')) active = true
        }
        return active
      },
      async addToCart (id, name, price, modifier) {
        try {
          let contents = {'amount': 1, 'id': id}
          this.$store.commit('cart/ADD_TO_CART', contents)
          let cart = this.$store.state.cart.cartContents
          await this.$store.dispatch('cart/getProductForCart', { cart: cart }, { root: true })
          this.$toast.open({
            message: 'Product added to <nuxt-link to="/cart">Cart</nuxt-link>',
            type: 'is-success'
          })
          if (modifier) {
            this.$router.push('/cart')
          }
        } catch (e) {
          console.log(e)
        }
      },
      doesFileExist (urlToFile) {
        var xhr = new XMLHttpRequest()
        xhr.open('HEAD', urlToFile, false)
        xhr.send()

        if (xhr.status === 404) {
          return false
        } else {
          return true
        }
      },
      showPDF (id) {
        try {
          let theresult = this.doesFileExist(this.apiUrl + '/img/pdf/' + id.charAt(2) + id.charAt(3) + '/' + id + '.pdf')
          if (theresult === true) {
            window.open(this.apiUrl + '/img/pdf/' + id.charAt(2) + id.charAt(3) + '/' + id + '.pdf', '_blank')
          } else {
            this.modalActive = true
          }
        } catch (e) {
          console.log(e)
        }
      },
      async doInquire (id) {
        try {
          this.modalInquireActive = true
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

<style scoped>
  .is-orange {
    background-color: #ee7600;
    color: white;
  }

  .is-orange:hover {
    background-color: #0f77ea;
    color: white;
  }

  .my-margin-top {
    padding-top: 1rem;
  }

  .my-img {
    width: 200px;
  }

.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
}

.sticky-top {
  top: 50px;
}
</style>
