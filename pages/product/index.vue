<template>
  <section class="section">
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
          <section class="section" v-for="(val, key) in productData">
            <div class="columns my-margin">
              <div class="column">
                <h2 class="subtitle">{{ val.name }} - {{ val.artno }}</h2>
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
                  <button class="button is-orange" @click="addToCart()"><b-icon icon="cart-outline"></b-icon><span>Buy</span></button>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">

        </div>
        <div class="column">
          <hr>
          <b-pagination
              :total="total"
              :current.sync="current"
              rounded
              :per-page="perPage"
              @change="nextProduct">
          </b-pagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import search from '~/components/widgets/search.vue'
  import FilterSearch from '~/components/widgets/filter.vue'
  import Cookies from 'js-cookie'

  export default {
    components: { search, FilterSearch },
    data () {
      return {
        isFetching: false,
        total: 0,
        current: 1,
        perPage: 10,
        productData: [],
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
    methods: {
      async getProducts () {
        try {
          this.isFetching = true
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
          }
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
          let params = this.$route.query
          console.log(params.search)
          let search = (params.search !== '' && params.search !== undefined) ? params.search : ''
          let page = this.current
          let query = {
            'options': {
              'fullCount': true
            },
            'count': true,
            'query': 'FOR p in k2p_product FILTER LOWER(p.basic.name) LIKE @search OR LOWER(p.basic.description) LIKE @search LIMIT ' + ((page - 1) * 10) + ', 10 RETURN { _key: p._key, _id: p._id, artno: p.basic.vat, name: p.basic.name, description: p.basic.description, clone: p.basic.clone, size: p.basic.size, price: p.basic[\'Price LabNed\'], reactivity: p.basic.Reactivity, host: p.basic.Host, applications: p.basic.Applications, conjugate: p.basic.Conjugate, images: { image1: p.basic.picture, image2: p.basic.price } }',
            'bindVars': {
              'search': search.toLowerCase() + '%'
            }
          }
          let mydata = await this.$axios.$post(this.$store.state.productUrl + '/_api/cursor', query)
          console.log(query)
          console.log(mydata)
          this.productData = mydata.result
          this.total = mydata.extra.stats.fullCount
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
