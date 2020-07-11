<template>
  <section>
    <!-- <hr class="navbar-divider my_div"> -->
    <div class="container my-margin-top">
      <div class="columns">
        <div class="column">
          <breadCrumb></breadCrumb>
        </div>
        <div class="column"></div>
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
      </div>-->
      <div class="columns">
        <div class="column is-one-quarter">
          <FilterSearch></FilterSearch>
        </div>
        <div class="column">
          <section>
            <div class="columns">
              <div class="column my-section is-info">
                <h2
                  class="subtitle"
                  style="padding-left: 5px; color: white;"
                >Total products found: {{ getTotalData }}</h2>
              </div>
            </div>
          </section>
          <section
            v-if="getProductData.length > 0"
            class="section"
            v-for="(val, key) in getProductData"
          >
            <div class="columns my-margin-bottom">
              <div class="column">
                <h2 class="subtitle">
                  <nuxt-link
                    :to="'/' + slugify(val.name + '-' +(val.artNos[selectedSizeIndices[key]]))"
                  >{{ val.name }}</nuxt-link>
                </h2>
                <div class="columns">
                  <div class="column">
                    <div v-if="val.reactivity !== '' && val.reactivity !== null" class="art-line">
                      <div class="art-label">Reactivity</div>
                      <div class="art-value">{{ val.reactivity }}</div>
                    </div>
                    <div
                      class="art-line"
                      v-if="val['Product category LabNed'] === 'Peptides & (rec.) Proteins' && val.source !== '' && val.source !== null"
                    >
                      <div class="art-label">Source</div>
                      <div class="art-value">{{ val.source }}</div>
                    </div>
                    <div v-else-if="val.host !== '' && val.host !== null" class="art-line">
                      <div class="art-label">Host</div>
                      <div class="art-value">{{ val.host }}</div>
                    </div>
                    <div
                      v-if="val.applications !== '' && val.applications !== null"
                      class="art-line"
                    >
                      <div class="art-label">Applications</div>
                      <div class="art-value">{{ val.applications }}</div>
                    </div>
                  </div>
                  <div class="column">
                    <div v-if="val.clone !== '' && val.clone !== null" class="art-line">
                      <div class="art-label">Clone</div>
                      <div class="art-value">{{ val.clone }}</div>
                    </div>
                    <div v-if="val.conjugate !== '' && val.conjugate !== null" class="art-line">
                      <div class="art-label">Conjugate</div>
                      <div class="art-value">{{ val.conjugate }}</div>
                    </div>
                    <div v-if="val.size !== '' && val.size !== null" class="art-line">
                      <div class="art-label">Size</div>
                      <div class="art-value">
                        <select v-model="selectedSizeIndices[key]">
                          <option disabled value>Please select one</option>
                          <option v-for="(value, index) in val.sizes" v-bind:value="index">{{value}}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-one-third">
                <p
                  class="title"
                >{{ (val.prices.length > 0 ) ? '€ ' + Number(val.prices[selectedSizeIndices[key]]).toFixed(2) : 'Inquire' }}</p>
                <p class="control">
                  <button
                    v-if="((Number(val.prices[selectedSizeIndices[key]]).toFixed(2)) === 'NaN')"
                    class="button is-primary my-button"
                    @click="doInquire(val.artno)"
                  >
                    <b-icon icon="comment-question-outline"></b-icon>
                    <span>Inquire</span>
                  </button>
                  <button
                    v-else
                    class="button is-primary my-button"
                    @click="addToCart(val.artno, val.name, val.prices[selectedSizeIndices[key]], false)"
                  >
                    <b-icon icon="cart-outline"></b-icon>
                    <span>Add to Cart</span>
                  </button>
                </p>
                <p class="control" style="padding-top: 5px;">
                  <button
                    class="button is-info my-button"
                    :disabled="((Number(val.prices[selectedSizeIndices[key]]).toFixed(2)) !== 'NaN') ? false : true"
                    @click="addToCart(val.artno, val.name, val.prices[selectedSizeIndices[key]], true)"
                  >
                    <b-icon icon="file-document-box"></b-icon>
                    <span>Add to Quote</span>
                  </button>
                </p>
              </div>
            </div>
            <b-modal :active.sync="modalInquireActive" has-modal-card>
              <inquire :productid="val.artno"></inquire>
            </b-modal>
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
        <div class="column is-one-quarter"></div>
        <div class="column" v-if="getProductData.length > 0">
          <hr />
          <div class="columns">
            <div class="column my-section is-info">
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
                @change="nextProduct"
                class="is-info"
              ></b-pagination>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="true" :active.sync="isLoading" :canCancel="false"></b-loading>
  </section>
</template>

<script>
import FilterSearch from "~/components/widgets/filter.vue";
import breadCrumb from "~/components/widgets/breadcrumb.vue";
import inquire from "~/components/ui/inquire.vue";

export default {
  scrollToTop: true,
  components: { FilterSearch, breadCrumb, inquire },
  head() {
    return {
      title: "Search Products | LabNed.com - Exploring Possibilities",
      meta: [
        {
          hid: "web_author",
          name: "web_author",
          content: `${this.info.seo_author}`
        },
        {
          hid: "keywords",
          name: "keywords",
          content: `${this.info.seo_keywords}`
        },
        { hid: "robots", name: "robots", content: "index, follow" },
        { hid: "revisit-after", name: "revisit-after", content: "1 day" }
      ]
    };
  },
  data() {
    return {
      isFetching: true,
      current: 1,
      perPage: 10,
      productName: "",
      modalInquireActive: false,
      myproductid: "",
      selectedSizeIndices: [],
      selectedProductNames: [],
      selectedProductArtNos: []
    };
  },
  async asyncData({ store, error }) {
    let info = "";
    await store.dispatch("getSettings");
    info = store.state.settings;
    if (info.maintenance === true) {
      error({
        statusCode: 503,
        message:
          "Maintenance is under way. Please check our site at a later date."
      });
    }
    return { info: info };
  },
  created() {
    let page = Number(this.$route.query.page);
    if (page > 0) {
      this.nextProduct(page);
    } else {
      this.getProducts();
    }
  },
  validate({ params, query }) {
    // can be validated
    return query;
  },
  computed: {
    getProductData() {
      let data = this.$store.state.product.data;
      console.log("datawwwaa", data);
      let products = [];
      data.forEach(element => {
        console.log("element", element);
        element.sizes = [];
        element.prices = [];
        element.artNos = [];
        // dont modify the element.sizesPrices directly else we'll get vuex mutation error
        // so clone the array using slice()
        let sizesPricesArray = element.sizesPrices.slice();
        sizesPricesArray
          .sort((a, b) => {
            return parseInt(a.split("_")[0]) - parseInt(b.split("_")[0]);
          })
          .forEach(item => {
            element.sizes.push(item.split("_")[0]);
            element.prices.push(item.split("_")[1]);
            element.artNos.push(item.split("_")[2]);
          });
        products.push(element);
        if (products.length > this.selectedSizeIndices.length) {
          this.selectedSizeIndices.push(0);
        }
      });
      console.log("products", products, this.selectedSizeIndices);
      return products;
    },
    getTotalData() {
      return this.$store.state.product.total;
    },
    isLoading() {
      return this.$store.state.isLoading;
    }
  },
  methods: {
    slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
    },
    async getProducts() {
      try {
        this.isFetching = true;
        let page = this.current;
        let params = this.$route.query;
        await this.$store.dispatch(
          "product/getProducts",
          {
            page: page,
            params: params
          },
          {
            root: true
          }
        );
        this.isFetching = false;
      } catch (e) {
        console.log(e);
        this.$toast.open("Could not load data");
        this.isFetching = false;
      }
    },
    nextProduct(number) {
      // console.log(number)
      this.current = number;
      // console.log(this.$route.path)
      let params = this.$route.query;
      let search =
        params.search !== "" && params.search !== undefined
          ? params.search
          : "";
      let newRoute = this.$route.path + "?page=" + number;
      if (search !== "") {
        newRoute = this.$route.path + "?search=" + search + "&page=" + number;
      }
      this.$router.replace(newRoute);
      // this.$route.query.page = number
      this.getProducts();
    },
    async doInquire(id) {
      try {
        this.modalInquireActive = true;
      } catch (e) {
        console.log(e);
      }
    },
    async addToCart(id, name, price, modifier) {
      try {
        let contents = { amount: 1, id: id };
        console.log("addToCart Function Triggered");
        this.$store.commit("cart/ADD_TO_CART", contents);
        let cart = this.$store.state.cart.cartContents;
        await this.$store.dispatch(
          "cart/getProductForCart",
          { cart: cart },
          { root: true }
        );
        this.$toast.open({
          message: 'Product added to <nuxt-link to="/cart">Cart</nuxt-link>',
          type: "is-success"
        });
        if (modifier) {
          this.$router.push("cart");
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
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
  margin-right: 0.75rem;
  margin-top: 0.5rem;
  background-color: #025689;
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
  display: flex;
}

.art-label {
  float: left;
  margin-right: 5px;
  min-width: 6em;
  clear: both;
  font-weight: bold;
  flex: 1 0 0%;
}

.art-value {
  box-sizing: border-box;
  padding-left: 0.75rem;
}
</style>
