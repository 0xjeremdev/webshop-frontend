<template>
  <div>
    <figure v-if="image" class="image is-128x128">
      <img @click="isImageModalActive = true" :src="image">
    </figure>
    <b-upload v-model="files">
      <a class="button is-primary">
        <b-icon icon="upload"></b-icon>
        <span>Click to upload</span>
      </a>
    </b-upload>
    <div v-if="files && files.length">
      <span class="file-name">
        {{ files[0].name }}
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
export default {
  template: '#image-control',
  props: {
    image: String
  },
  data () {
    return {
      files: [],
      isImageModalActive: false
    }
  }
}
</script>

<style scoped>
  .image {

  }
</style>
