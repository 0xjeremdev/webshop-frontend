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
          <p class="title my-img">{{ (Number(product.basic['Price LabNed']).toFixed(2) !== 'NaN') ? '€ ' + Number(product.basic['Price LabNed']).toFixed(2) : 'Inquiry' }}</p>
          <div class="columns is-mobile">
            <div class="column">
              <button class="button is-orange my-img" :disabled="(Number(product.basic['Price LabNed']).toFixed(2) !== 'NaN') ? false : true" @click="addToCart(product.basic.vat, product.basic['name'], product.basic['Price LabNed'])"><b-icon icon="cart-outline"></b-icon><span>Add to Cart</span></button>
            </div>
            <div class="column">
              <button class="button is-info my-img" :disabled="(Number(product.basic['Price LabNed']).toFixed(2) !== 'NaN') ? false : true" @click="addToCart(product.basic.vat, product.basic['name'], product.basic['Price LabNed'])"><b-icon icon="file-document-box"></b-icon><span>Add to Quote</span></button>
            </div>
          </div>
          <br />
          <div class="columns is-mobile">
            <div class="column">
              <img v-if="product.basic.image" class="my-img" :src="apiUrl + '/img/product/' + product.basic.image" alt="Image1" />
              <!-- <img class="my-img" src="https://wikiki.github.io/images/merry-christmas.jpg" /> -->
            </div>
            <div class="column">
              <img v-if="product.basic.price" class="my-img" :src="apiUrl + '/img/product/' + product.basic.price" alt="Image2" />
              <!-- <img class="my-img" src="https://wikiki.github.io/images/singer.jpg" /> -->
            </div>
          </div>
          </div>
        </div>
        <div class="column">
          <h2 class="subtitle">{{ product.basic.name }} - {{ product.basic.vat }}</h2>

          <b-collapse class="card" v-for="(value, tabKey) in fields" :key="tabKey" :open="(tabKey === 'Product Information')">
            <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">
                    {{ tabKey }} <p v-if="tabKey === 'Product Information'" class="control"><button class="button is-danger" style="width: 150px;" @click="showPDF(product.basic.vat)"><b-icon icon="file-pdf"></b-icon><span>PDF Datasheet</span></button></p>
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
                      <tr v-if="(product.basic[fieldKey] !== '') && (fieldKey !== 'icon')" v-for="(val, fieldKey) in value" :key="fieldKey">
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
  </section>
</template>

<script>
  // import Cookies from 'js-cookie'
  import breadCrumb from '~/components/widgets/breadcrumb.vue'
  import Banner from '~/components/widgets/banner.vue'

  export default {
    components: { breadCrumb, Banner },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities',
        titleTemplate: `${this.product.basic.name.replace(/-+/g, ' ')} | %s`
      }
    },
    data () {
      return {
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
      async addToCart (id, name, price) {
        try {
          let contents = {'amount': 1, 'id': id}
          this.$store.commit('cart/ADD_TO_CART', contents)
          let cart = this.$store.state.cart.cartContents
          await this.$store.dispatch('cart/getProductForCart', { cart: cart }, { root: true })
          this.$toast.open({
            message: 'Product added to <nuxt-link to="/cart">Cart</nuxt-link>',
            type: 'is-success'
          })
        } catch (e) {
          console.log(e)
        }
      },
      showPDF (id) {
        window.open(this.apiUrl + '/img/pdf/' + id + '.pdf', '_blank')
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
