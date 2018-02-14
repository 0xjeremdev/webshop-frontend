<template>
  <div>
      <SimpleTable :columns="gridColumns"
        :data="gridData"
        :filterKey="searches"
        :config="config">
      </SimpleTable>
  </div>
</template>

<script>
  import SimpleTable from '~/components/tables/Simpletable'
  export default {
    layout: 'admin',
    head () {
      return {
        title: 'ITK Diagnostics - Categories',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ]
      }
    },
    components: {
      SimpleTable
    },
    data () {
      return {
        searches: {},
        gridColumns: ['name', 'power'],
        gridData: [
          { name: 'Chuck Norris', power: Infinity },
          { name: 'Bruce Lee', power: 9000 },
          { name: 'Jackie Chan', power: 7000 },
          { name: 'Jet Li', power: 8000 }
        ],
        config: {
          hasHead: true,
          hasFoot: false
        }
      }
    },
    methods: {
    }
  }
</script>
