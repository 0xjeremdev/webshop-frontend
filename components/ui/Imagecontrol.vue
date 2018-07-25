<template>
  <div>
    {{ image }}
    {{ files }}

    <figure v-if="image && showImage" class="image is-128x128">
      <img @click="isImageModalActive = true" :src="image"  @error="imageLoadError">
    </figure>
    <b-field>
      <b-upload v-model="files" @input="uploadFiles($event)" multiple>
        <a class="button is-primary">
          <b-icon icon="upload"></b-icon>
          <span>Click to upload</span>
        </a>
      </b-upload>
    </b-field>

    <div class="tags">
        <span v-for="(file, index) in files"
            :key="index"
            class="tag is-primary" >
            {{file.name}}
            <button class="delete is-small"
                type="button"
                @click="deleteDropFile(index)">
            </button>
        </span>
    </div>

    <b-modal :active.sync="isImageModalActive">
        <figure class="image is-4by3">
          <img :src="image">
        </figure>
    </b-modal>
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
      image: String
    },
    data () {
      return {
        files: [],
        showImage: true,
        isImageModalActive: false,
        uploadError: null,
        currentStatus: null,
        uploadFieldName: 'filesUploaded'
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
    methods: {
      save (formData) {
        // upload data to the server
        this.currentStatus = STATUS_SAVING

        /* upload(formData)
          .then(x => {
            this.uploadedFiles = [].concat(x)
            this.currentStatus = STATUS_SUCCESS
          })
          .catch(err => {
            this.uploadError = err.response
            this.currentStatus = STATUS_FAILED
          }) */
      },
      filesChange (fieldName, fileList) {
        // handle file changes
        const formData = new FormData()

        if (!fileList.length) return

        // append the files to FormData
        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(fieldName, fileList[x], fileList[x].name)
          })

        // save it
        this.save(formData)
      },
      deleteDropFile (index) {
        console.log(this.files)
        this.files.splice(index, 1)
      },
      imageLoadError () {
        this.showImage = false
      },
      uploadFiles (value) {
        this.files = value
        console.log(value)
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
