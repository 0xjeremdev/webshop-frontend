<template>
  <section>
    <!-- <hr class="navbar-divider my_div"> -->
    <div class="container my-margin-top">
      <div class="columns">
        <div class="column">
            <breadCrumb></breadCrumb>
        </div>
        <div class="column">
        </div>
      </div>
      <!-- <hr class="navbar-divider my_div"> -->
      <!-- <search></search> -->
      <!-- <div class="columns">
        <div class="column is-one-quarter">

        </div>
        <div class="column">
          <b-pagination
              :total="total"
              :current.sync="current"
              rounded
              :per-page="perPage"
              @change="nextProduct">
          </b-pagination>
          <hr>
        </div>
      </div> -->
      <div class="columns">
        <div class="column is-one-quarter">
          <FilterSearch></FilterSearch>
        </div>
        <div class="column">
          <section>
            <div class="columns">
              <div class="column my-section">
                <h2 class="subtitle" style="padding-left: 5px; color: white;">Total products found: {{ getTotalData }}</h2>
              </div>
            </div>
          </section>
          <section v-if="getProductData.length > 0" class="section" v-for="(val, key) in getProductData">
            <div class="columns my-margin-bottom">
              <div class="column">
                <h2 class="subtitle"><nuxt-link :to="'/' + slugify(val.name + '-' + val.artno)">{{ val.name }} - {{ val.artno }}</nuxt-link></h2>
                <div class="columns">
                  <div class="column">
                    <div v-if="val.reactivity !== '' || val.reactivity !== null" class="art-line">
                      <div class="art-label">
                        Reactivity
                      </div>
                      <div class="art-value">
                        {{ val.reactivity }}
                      </div>
                    </div>
                    <div v-if="val.host !== '' && val.host !== null" class="art-line">
                      <div class="art-label">
                        Host
                      </div>
                      <div class="art-value">
                        {{ val.host }}
                      </div>
                    </div>
                    <div v-if="val.applications !== '' && val.applications !== null" class="art-line">
                      <div class="art-label">
                        Applications
                      </div>
                      <div class="art-value">
                        {{ val.applications }}
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div v-if="val.clone !== '' && val.clone !== null" class="art-line">
                      <div class="art-label">
                        Clone
                      </div>
                      <div class="art-value">
                        {{ val.clone }}
                      </div>
                    </div>
                    <div v-if="val.conjugate !== '' && val.conjugate !== null" class="art-line">
                      <div class="art-label">
                        Conjugate
                      </div>
                      <div class="art-value">
                        {{ val.conjugate }}
                      </div>
                    </div>
                    <div v-if="val.size !== '' && val.size !== null" class="art-line">
                      <div class="art-label">
                        Size
                      </div>
                      <div class="art-value">
                        {{ val.size }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-one-third">
                <p class="title"> € {{ Number(val.price).toFixed(2) }}</p>
                <p class="control">
                  <button class="button is-orange my-button" @click="addToCart(val.artno, val.name, val.price)"><b-icon icon="cart-outline"></b-icon><span>Add to Cart</span></button>
                </p>
                <p class="control" style="padding-top: 5px;">
                  <button class="button is-success my-button" @click="addToCart(val.artno, val.name, val.price)"><b-icon icon="file-document-box"></b-icon><span>Add to Quote</span></button>
                </p>
              </div>
            </div>
          </section>
          <section v-if="getProductData.length <= 0" class="section">
            <div class="columns my-margin-bottom">
              <div class="column">
                <p>No results found!</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">

        </div>
        <div class="column" v-if="getProductData.length > 0">
          <hr>
          <div class="columns">
            <div class="column my-section">
              <h2 class="subtitle" style="color: white;">Total products found: {{ getTotalData }}</h2>
            </div>
          </div>
          <div class="columns">
            <div class="column my-pagination">
              <br />
              <b-pagination
                  :total="getTotalData"
                  :current.sync="current"
                  :per-page="perPage"
                  @change="nextProduct">
              </b-pagination>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="true" :active.sync="isFetching" :canCancel="false"></b-loading>
  </section>
</template>

<script>
  import FilterSearch from '~/components/widgets/filter.vue'
  import breadCrumb from '~/components/widgets/breadcrumb.vue'

  export default {
    components: { FilterSearch, breadCrumb },
    head () {
      return {
        title: 'Search Products | LabNed.com - Exploring Possibilities'
      }
    },
    data () {
      return {
        isFetching: false,
        current: 1,
        perPage: 10,
        productName: ''
      }
    },
    created () {
      let page = Number(this.$route.query.page)
      if (page > 0) {
        this.nextProduct(page)
      } else {
        this.getProducts()
      }
    },
    validate ({ params, query }) {
      // can be validated
      return query
    },
    computed: {
      getProductData () {
        return this.$store.state.product.data
      },
      getTotalData () {
        return this.$store.state.product.total
      }
    },
    methods: {
      slugify (text) {
        return text.toString().toLowerCase()
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(/[^\w-]+/g, '') // Remove all non-word chars
          .replace(/--+/g, '-') // Replace multiple - with single -
          .replace(/^-+/, '') // Trim - from start of text
          .replace(/-+$/, '') // Trim - from end of text
      },
      async getProducts () {
        try {
          this.isFetching = true
          let page = this.current
          let params = this.$route.query
          await this.$store.dispatch('product/getProducts', {
            page: page,
            params: params
          },
          {
            root: true
          })
          this.isFetching = false
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not load data')
          this.isFetching = false
        }
      },
      nextProduct (number) {
        // console.log(number)
        this.current = number
        // console.log(this.$route.path)
        let params = this.$route.query
        let search = (params.search !== '' && params.search !== undefined) ? params.search : ''
        let newRoute = this.$route.path + '?page=' + number
        if (search !== '') {
          newRoute = this.$route.path + '?search=' + search + '&page=' + number
        }
        this.$router.replace(newRoute)
        // this.$route.query.page = number
        this.getProducts()
      },
      async addToCart (id, name, price) {
        try {
          let contents = {'amount': 1, 'id': id}
          console.log('addToCart Function Triggered')
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

  .my-button {
    width: 150px;
  }

  .my-margin-bottom {
    margin-bottom: -5rem;
  }

  .my-margin-top {
    margin-top: 1rem;
  }

  .my-section {
    padding: 0.5rem;
    margin-left: 1.5rem;
    margin-top: 0.5rem;
    background-color: #0f77ea;
    color: white;
    /* text-shadow: 2px 2px 4px #000000; */
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    /* border: 2px black solid; */

  }

  .my-pagination {
    padding: 0.5rem;
    margin-left: 1.5rem;
    margin-top: 0.5rem;
  }

  .art-line {
    border: 0 none;
    font-family: inherit;
    font-size: 100%;
    font-style: inherit;
    font-weight: inherit;
    margin: 0;
    outline: 0 none;
    padding: 0;
    vertical-align: baseline;
  }

  .art-label {
    float: left;
    margin-right: 5px;
    min-width: 6em;
    clear: both;
    font-weight: bold;
  }

  .art-value {
    box-sizing: border-box;
  }
</style>
