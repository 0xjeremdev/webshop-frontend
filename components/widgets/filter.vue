<template>
  <section>
    <p class="control"><button class="button is-primary" @click="doReset()">Reset</button></p>
    <b-collapse class="card" v-for="( val, key ) in searchColumns" :key="key" :open="(val === 'Product category LabNed')">
        <div slot="trigger" slot-scope="props" class="card-header">
            <p class="card-header-title">

                {{ searchLabels[key] }} [{{getFilters[val].length}}]
            </p>
            <a class="card-header-icon">
                <b-icon
                    :icon="props.open ? 'menu-down' : 'menu-up'">
                </b-icon>
            </a>
        </div>
        <div class="card-content" v-if="val === 'Product category LabNed'">
            <div v-for="( svVal, svKey ) in getFilters[val]" :key="svKey" v-if="svVal === 'Primary Antibodies'">
              <input type="checkbox" :name="svVal" :checked="getSearchFilters(val, svKey, svVal)" @click="setSearch(val, svKey, svVal)"> {{ svVal }}
            </div>
            <div v-for="( svVal, svKey ) in getFilters[val]" :key="svKey" v-if="svVal === 'Secondary Antibodies'">
              <input type="checkbox" :name="svVal" :checked="getSearchFilters(val, svKey, svVal)" @click="setSearch(val, svKey, svVal)"> {{ svVal }}
            </div>
            <div v-for="( svVal, svKey ) in getFilters[val]" :key="svKey" v-if="svVal === 'Immunoassays'">
              <input type="checkbox" :name="svVal" :checked="getSearchFilters(val, svKey, svVal)" @click="setSearch(val, svKey, svVal)"> {{ svVal }}
            </div>
            <div v-for="( svVal, svKey ) in getFilters[val]" :key="svKey" v-if="svVal === 'DNA & RNA Purification Kits'">
              <input type="checkbox" :name="svVal" :checked="getSearchFilters(val, svKey, svVal)" @click="setSearch(val, svKey, svVal)"> {{ svVal }}
            </div>
            <div v-for="( svVal, svKey ) in getFilters[val]" :key="svKey" v-if="svVal === 'Peptides & (rec.) Proteins'">
              <input type="checkbox" :name="svVal" :checked="getSearchFilters(val, svKey, svVal)" @click="setSearch(val, svKey, svVal)"> {{ svVal }}
            </div>
            <div v-for="( svVal, svKey ) in getFilters[val]" :key="svKey" v-if="svVal === 'Controls, Slides & Lysates'">
              <input type="checkbox" :name="svVal" :checked="getSearchFilters(val, svKey, svVal)" @click="setSearch(val, svKey, svVal)"> {{ svVal }}
            </div>
            <div v-for="( svVal, svKey ) in getFilters[val]" :key="svKey" v-if="svVal === 'Consumables & Misc.'">
              <input type="checkbox" :name="svVal" :checked="getSearchFilters(val, svKey, svVal)" @click="setSearch(val, svKey, svVal)"> {{ svVal }}
            </div>
            <div v-for="( svVal, svKey ) in getFilters[val]" :key="svKey" v-if="checkIncludes(svVal)">
              <input type="checkbox" :name="svVal" :checked="getSearchFilters(val, svKey, svVal)" @click="setSearch(val, svKey, svVal)"> {{ svVal }}
            </div>
        </div>
        <div class="card-content" v-if="val !== 'Product category LabNed'">
            <div v-for="( svVal, svKey ) in getFilters[val]" :key="svKey">
              <!--<b-field >
                <b-checkbox :value="getSearchFilters(val, svKey, svVal)" @input.lazy="setSearch(val, svKey, svVal)">{{ svVal[val] }}</b-checkbox>
              </b-field> -->
              <input type="checkbox" :name="svVal" :checked="getSearchFilters(val, svKey, svVal)" @click="setSearch(val, svKey, svVal)"> {{ svVal }}
            </div>
        </div>
    </b-collapse>
    <b-loading :is-full-page="true" :active.sync="isFetching" :canCancel="false"></b-loading>
  </section>
</template>

<script>
  import Cookies from 'js-cookie'
  import _ from 'lodash'

  export default {
    data () {
      return {
        searchProductType: [ 'Primary Antibodies', 'Secondary Antibodies', 'Immunoassays', 'DNA & RNA Purification Kits', 'Peptides & (rec.) Proteins', 'Controls, Slides & Lysates', 'Consumables & Misc.' ],
        searchColumns: [ 'Product category LabNed', 'Reactivity', 'Host', 'Clone', 'Applications', 'Conjugate' ],
        searchLabels: [ 'Product Type', 'Reactivity', 'Host', 'Clone', 'Application', 'Conjugate' ],
        /* sort: {
          'Product category LabNed': [ { 'Product category LabNed': 'Primary Antibodies' }, { 'Product category LabNed': 'Secondary Antibodies' }, { 'Product category LabNed': 'Immunoassays' }, { 'Product category LabNed': 'Peptides & (rec.) Proteins' }, { 'Product category LabNed': 'Controls' }, { 'Product category LabNed': 'Slides & Lysates' }, { 'Product category LabNed': 'Consumables & Misc.' } ]
        }, */
        // searchValues: { 'Product Type': [], 'Reactivity': [], 'Host': [], 'Clone': [], 'Application': [], Conjugate: [] },
        isFetching: false
      }
    },
    created () {
      this.isFetching = true
      for (let v in this.searchColumns) {
        this.getData(this.searchColumns[v])
      }
      if (!(this.$store.state.product.searchFilters instanceof Object)) {
        this.$store.commit('product/SET_SEARCH_FILTERS', (typeof (Cookies.getJSON('key2publish').product) !== 'undefined') ? Cookies.getJSON('key2publish').product.searchFilters : '')
      }
      this.isFetching = false
    },
    computed: {
      getFilters () {
        let filters = this.$store.state.product.filters
        return filters
      }
    },
    methods: {
      checkIncludes (value) {
        return !_.includes(this.searchProductType, value)
      },
      doReset () {
        this.$store.commit('product/SET_SEARCH_FILTERS', { 'Product category LabNed': {}, 'Reactivity': {}, 'Host': {}, 'Clone': {}, 'Applications': {}, Conjugate: {} })
        this.$store.commit('product/SET_SEARCHVAL', '')
        this.getProductData()
        for (let v in this.searchColumns) {
          this.getData(this.searchColumns[v])
        }
        location.reload()
      },
      getSearchFilters (type, key, value) {
        let mySearchFiltersState = this.$store.state.product.searchFilters
        let checked = (typeof mySearchFiltersState !== 'undefined') ? (typeof mySearchFiltersState[type] !== 'undefined') ? (mySearchFiltersState[type][value] !== '') ? mySearchFiltersState[type][value] : false : false : false
        // console.log(checked)
        return checked
      },
      setSearch (type, key, value) {
        console.log('checked: ' + value)
        let mySearchFiltersState = this.$store.state.product.searchFilters
        let checked = (typeof mySearchFiltersState !== 'undefined') ? (typeof mySearchFiltersState[type] !== 'undefined') ? (mySearchFiltersState[type][value] !== '') ? mySearchFiltersState[type][value] : false : false : false
        // console.log(checked)
        let myVal = []
        myVal[type] = {}
        myVal[type][value] = !checked
        console.log('komhier')
        this.$store.commit('product/SET_SEARCH_FILTERS', myVal)
        this.getProductData()
        for (let v in this.searchColumns) {
          // if (this.searchColumns[v] !== type)
          console.log(this.searchColumns[v])
          this.getData(this.searchColumns[v])
        }
      },
      async getProductData () {
        let params = this.$route.query
        await this.$store.dispatch('product/getProducts', {
          page: 1,
          params: params
        },
        {
          root: true
        })
      },
      async getData (type) {
        try {
          this.isFetching = true
          let params = this.$route.query
          let field = type
          await this.$store.dispatch('product/getFilters', {
            field: field,
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
      }
    }
  }
</script>
