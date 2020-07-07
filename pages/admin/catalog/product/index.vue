<template>
  <div>
    <br />
    <div>
    <h1 class="title">Products</h1>
    <form @submit.prevent="sendFile"  enctype="multipart/form-data">
      <div v-if="message" :class="`message ${error ? 'is-danger' :'is-success'}`">
        <div class="message-body">{{message}}</div>
      </div>
      <div class="file is-boxed is-primary" style="float: right;">
        <label class="file-label">
          <input type="file" ref = "file" @change="selectFile" class="file-input"/>
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <!-- <span class="file-label">
              choose a file..
            </span> -->
          </span>       
          <span v-if="file" class="file-name">{{file.name}}</span>
        </label> 
        <div class="field">
          <button class="button is-info">Upload</button>     
        </div> 
      </div>
    </form>
    </div>
    <datagrid :data="gridData" :columns="gridColumns" :labels="gridLabels" :types="gridTypes" :apiUrl="apiUrl" :type="type"></datagrid>
  </div>
</template>


<script>
  import Datagrid from '~/components/ui/Datagrid'

  export default {
    layout: 'admin',
    head () {
      return {
        title: 'LabNed.com - Exploring Possibilities - Products',
        meta: [
          { hid: 'error description', name: 'error description', content: 'My custom error description' }
        ],
        script: [
          { src: 'https://use.fontawesome.com/releases/v5.1.0/js/all.js', async: true, defer: true }
        ]
      }
    },
    components: { Datagrid },
    data () {
      return {
        gridColumns: ['vat', 'name', 'Price LabNed'],
        gridLabels: ['LabNed No', 'Name', 'Price LabNed'],
        gridTypes: { 'vat': 'string', 'name': 'string' },
        gridData: [],
        apiUrl: this.$store.state.apiUrl,
        type: 'product',
        file: '',
        message: '',
        error: false
      }
    },
    methods: {
      selectFile () {
        this.file = this.$refs.file.files[0]
        this.error = false
        this.message = ''
      },
      async sendFile () {
        const formData = new FormData()
        formData.append('file', this.file)
        try {
          await this.$axios.$post(this.$store.state.apiUrl + '/admin/product/upload', formData, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
          this.message = 'File has been uploaded'
          this.file = ''
          this.error = false
        } catch (err) {
          this.message = 'something went wrong'
          this.error = true
        }
      }
    },
    computed: {
      searchQuery: function () {
        return this.searches
      }
    }
  }
</script>

<style>

</style>
