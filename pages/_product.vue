<template>
  <section class="container">
    <div class="columns my-margin-top">
      <div class="column">
          <breadCrumb></breadCrumb>
      </div>
      <div class="column">

      </div>
    </div>
    <hr class="navbar-divider my_div">
    <div class="container" v-if="product[0]">
      <div class="columns">
        <div class="column is-one-fifth">
          <p class="title"> € {{ Number(product[0].basic['Price LabNed']).toFixed(2) }}</p>
          <p class="control">
            <button class="button is-orange" style="width: 150px;" @click="addToCart(product[0].basic.vat, product[0].basic['name'], product[0].basic['Price LabNed'])"><b-icon icon="cart-outline"></b-icon><span>Add to Cart</span></button>
            <button class="button is-info" style="width: 150px;" @click="addToCart(product[0].basic.vat, product[0].basic['name'], product[0].basic['Price LabNed'])"><b-icon icon="file-document-box"></b-icon><span>Add to Quote</span></button>
          </p>
          <br />
          <Banner></Banner>
        </div>
        <div class="column">
          <h2 class="subtitle">{{ product[0].basic.name }} - {{ product[0].basic.vat }}</h2>
          <b-collapse class="card" v-for="(value, tabKey) in fields" :key="tabKey" :open="(tabKey === 'Product Information')">
            <div slot="trigger" slot-scope="props" class="card-header">
                <p class="card-header-title">
                    {{ tabKey }}
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
                      <tr v-if="(product[0].basic[fieldKey] !== '') && (fieldKey !== 'icon')" v-for="(val, fieldKey) in value" :key="fieldKey">
                        <td><p>{{ (typeof val.label !== 'undefined') ? val.label : fieldKey }}</p></td>
                        <td><p>{{ product[0].basic[fieldKey] }}</p></td>
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
    <div class="container" v-else>
      Product not found
    </div>
  </section>
</template>

<script>
  import Cookies from 'js-cookie'
  import breadCrumb from '~/components/widgets/breadcrumb.vue'
  import Banner from '~/components/widgets/banner.vue'

  export default {
    components: { breadCrumb, Banner },
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities',
        titleTemplate: `${this.$route.params.product.toUpperCase().replace(/-+/g, ' ')} | %s`
      }
    },
    data () {
      return {
        product: {},
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
    created () {
      this.getProduct()
    },
    methods: {
      async getProduct () {
        try {
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser, { root: true })
          }
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')

          let query = {
            'options': {
              'fullCount': true
            },
            'count': true,
            'query': 'FOR p in k2p_product FILTER p.seo.url_slug == @search RETURN p',
            'bindVars': {
              'search': this.$route.params.product
            }
          }
          console.log(query)
          let product = await this.$axios.post(this.$store.state.productUrl + '/_api/cursor', query)
          this.product = product.data.result
          console.log(this.product)
          console.log(this.product.length)
          // return product
        } catch (e) {
          console.log(e)
        }
        console.log(this.$route.params)
      },
      addToCart (id, name, price) {
        let contents = {'amount': 1, 'id': id, 'name': name, 'price': price}
        this.$store.commit('ADD_TO_CART', contents)
        this.$toast.open({
          message: 'Product added to <nuxt-link to="/cart">Cart</nuxt-link>',
          type: 'is-success'
        })
      }
    }
    /* async asyncData ({params, error, store, app: { $axios }}) {
      try {
        if (!(store.state.authUser instanceof Object)) {
          store.commit('SET_USER', Cookies.getJSON('key2publish').authUser, { root: true })
        }
        $axios.setToken(store.state.authUser.jwt, 'Bearer')

        let query = {
          'options': {
            'fullCount': true
          },
          'count': true,
          'query': 'FOR p in k2p_product FILTER p.seo.url_slug == @search RETURN p',
          'bindVars': {
            'search': params.product
          }
        }
        console.log(query)
        let productData = await $axios.post(store.state.productUrl + '/_api/cursor', query)
        console.log(productData)
        return productData
      } catch (e) {
        console.log(e)
        error({ message: 'Product not found', statusCode: 404 })
      }
      console.log(params)
    } */
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
</style>
