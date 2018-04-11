<template>
  <section class="section">
    <hr class="navbar-divider my_div">
    <breadCrumb></breadCrumb>
    <hr class="navbar-divider my_div">
    <div class="container">
      <h1 class="title">Products</h1>
      <search></search>
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
          <section v-if="getProductData.length > 0" class="section" v-for="(val, key) in getProductData">
            <div class="columns my-margin">
              <div class="column">
                <h2 class="subtitle"><nuxt-link :to="'/' + slugify(val.name + '-' + val.artno)">{{ val.name }} - {{ val.artno }}</nuxt-link></h2>
                <div class="art-line">
                  <div class="art-label">
                    Description
                  </div>
                  <div class="art-value">
                    {{ val.description }}
                  </div>
                </div>
                <div class="art-line">
                  <div class="art-label">
                    Reactivity
                  </div>
                  <div class="art-value">
                    {{ val.reactivity }}
                  </div>
                </div>
                <div class="art-line">
                  <div class="art-label">
                    Host
                  </div>
                  <div class="art-value">
                    {{ val.host }}
                  </div>
                </div>
                <div class="art-line">
                  <div class="art-label">
                    Clone
                  </div>
                  <div class="art-value">
                    {{ val.clone }}
                  </div>
                </div>
                <div class="art-line">
                  <div class="art-label">
                    Applications
                  </div>
                  <div class="art-value">
                    {{ val.applications }}
                  </div>
                </div>
                <div class="art-line">
                  <div class="art-label">
                    Conjugate
                  </div>
                  <div class="art-value">
                    {{ val.conjugate }}
                  </div>
                </div>
                <div class="art-line">
                  <div class="art-label">
                    Size
                  </div>
                  <div class="art-value">
                    {{ val.size }}
                  </div>
                </div>
              </div>
              <div class="column is-one-third">
                <p class="title"> € {{ Number(val.price).toFixed(2) }}</p>
                <p class="control">
                  <button class="button is-orange" @click="addToCart(val.artno, val.price)"><b-icon icon="cart-outline"></b-icon><span>Add to Cart</span></button>
                </p>
              </div>
            </div>
          </section>
          <section v-if="getProductData.length <= 0" class="section">
            <div class="columns my-margin">
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
          <b-pagination
              :total="getTotalData"
              :current.sync="current"
              rounded
              :per-page="perPage"
              @change="nextProduct">
          </b-pagination>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="true" :active.sync="isFetching" :canCancel="false"></b-loading>
  </section>
</template>

<script>
  import search from '~/components/widgets/search.vue'
  import FilterSearch from '~/components/widgets/filter.vue'
  import breadCrumb from '~/components/widgets/breadcrumb.vue'

  export default {
    components: { search, FilterSearch, breadCrumb },
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
      addToCart (id, price) {
        let contents = {'amount': 1, 'id': id, 'price': price}
        this.$store.commit('ADD_TO_CART', contents)
        this.$toast.open({
          message: 'Product added to <a href="/cart">cart</a>',
          type: 'is-success'
        })
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

  .my-margin {
    margin-bottom: 1rem;
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
  }

  .art-value {
    box-sizing: border-box;
  }
</style>
