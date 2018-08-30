<template>
  <div>
    <b-field>
      <b-upload v-model="files" @input="uploadFiles($event)" multiple>
        <a class="button is-primary">
          <b-icon icon="upload"></b-icon>
          <span>Click to upload</span>
        </a>
      </b-upload>
    </b-field>
    <p v-if="isSuccess">
      Finished uploading
    </p>
    <p v-if="isFailed">
      An error occured while uploading files
    </p>
    <p v-if="isSaving">
      Uploading {{ fileCount }} files... {{ progress }} %
    </p>

    <div v-if="myImage && showImage" v-for="(fig, index) in myImage">
      <figure class="image is-96x96">
        <img @click="setImageModalActive(fig)" :src="imageUrl + '/img/' + type + '/' + fig"  @error="imageLoadError">
      </figure>
      <div class="tags" style="margin-bottom: 0.75em;">
        <span
          :key="index"
          class="tag is-primary" >
          {{ fig }}
          <button class="delete is-small"
            type="button"
            @click="deleteDropFile(index, fig, type)">
          </button>
        </span>
      </div>
    </div>

    <!-- <b-modal v-if="myImage && showImage" :key="fig" v-for="(fig) in myImage" :active.sync="imageModelActive[fig]">
        <figure class="image is-4by3">
          <img :src="imageUrl + '/img/' + fig">
        </figure>
    </b-modal> -->
  </div>
</template>

<script>
  const STATUS_INITIAL = 0
  const STATUS_SAVING = 1
  const STATUS_SUCCESS = 2
  const STATUS_FAILED = 3

  export default {
    template: '#image-control',
    props: {
      image: Array,
      type: String
    },
    data () {
      return {
        files: [],
        fileCount: 0,
        showImage: true,
        imageModelActive: {},
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'filesUploaded',
        progress: 0,
        myImage: this.image,
        imageUrl: this.$store.state.apiUrl
      }
    },
    mounted () {
      this.reset()
    },
    computed: {
      isInitial () {
        return this.currentStatus === STATUS_INITIAL
      },
      isSaving () {
        return this.currentStatus === STATUS_SAVING
      },
      isSuccess () {
        return this.currentStatus === STATUS_SUCCESS
      },
      isFailed () {
        return this.currentStatus === STATUS_FAILED
      }
    },
    watch: {
      imageModalActive: function (val) {
        console.log(val)
      }
    },
    methods: {
      setImageModalActive (val) {
        let imageModel = this.imageModelActive
        imageModel[val] = true
        this.imageModelActive = imageModel
        // console.log(this.imageModelActive)
      },
      async deleteDropFile (index, name, mytype) {
        try {
          await this.$axios.$post(this.$store.state.apiUrl + '/admin/upload/delete', { mytype: mytype, name: name }, { headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}` } })
          this.myImage.splice(index, 1)
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not delete image')
        }
      },
      imageLoadError () {
        this.showImage = false
      },
      async uploadFiles (value) {
        try {
          console.log(value)
          if (!value.length) return
          this.currentStatus = STATUS_SAVING
          this.progress = 0
          this.files = value
          this.fileCount = this.files.length
          let postData = new FormData()

          Array
            .from(Array(this.files.length).keys())
            .map(x => {
              postData.append('filesUploaded', this.files[x], this.files[x].name)
            })

          let config = {
            headers: { Authorization: `Bearer ${this.$store.state.authUser.jwt}`, 'Content-Type': 'multipart/form-data' },
            onUploadProgress: function (progressEvent) {
              let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              this.progress = percentCompleted
            }.bind(this)
          }
          postData.append('type', this.type)
          // console.log(postData)
          // this.$axios.get(this.$store.state.apiUrl + '/admin/settings')
          let data = await this.$axios.$post(this.$store.state.apiUrl + '/admin/upload', postData, config)
          // console.log(data)
          this.myImage = data.result
          for (let v = 0; v < this.myImage.length; v++) {
            this.imageModelActive[this.myImage[v]] = false
          }
          this.reset()
          this.showImage = true
          this.currentStatus = STATUS_SUCCESS
          console.log(this.imageModalActive)
        } catch (e) {
          this.currentStatus = STATUS_FAILED
          console.log(e)
        }
      },
      reset () {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL
        this.files = []
        this.uploadError = null
      }
    }
  }
</script>

<style scoped>
  .image {

  }
</style>
