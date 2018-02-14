<template>
  <div>
    <table class="table">
      <thead v-if="config.hasHead">
        <tr>
          <th v-for="column in columns">
            <b-field>
                <b-input type="search"
                   icon="magnify"
                   :placeholder="column">
               </b-input>
            </b-field>
          </th>
        </tr>
        <tr>
          <th v-if="!config.customHeader"
            v-for="column in columns">
            <abbr :title="column||capitalize">{{ column||capitalize }}</abbr>
          </th>
          <th v-if="config.customHeader"
            v-for="column in columns">
            <abbr :title="column.title">{{ column.name }}</abbr>
          </th>
        </tr>
      </thead>
      <tfoot v-if="config.hasFooter">
        <tr>
          <td v-if="!config.customFooter" :title="column" v-for="column in columns">{{ column }}></td>
          <td v-if="config.customFooter" :title="foot.title" v-for="foot in footer">{{ foot.name }}></td>
        </tr>
      </tfoot>
      <tbody>
        <tr v-for="key in data">
          <td v-for="entry in key">{{ entry }}</td>
        </tr>
      </tbody>
    </table>
    <button v-on:click="doDebug()">Debug</button>
  </div>

</template>

<script>
  export default {
    name: 'SimpleTable',
    props: {
      data: Array,
      columns: Array,
      filterKey: Object,
      config: Object,
      footer: Object
    },
    methods: {
      doDebug: function () {
        console.log(this.config)
      }
    }
  }
</script>
