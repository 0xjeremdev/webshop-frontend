<template>
  <section>
      <div class="columns">
        <div class="column is-1">
          <a v-if="hasFacebook !== ''" :href="hasFacebook" target="_new">
            <figure class="image is-48x48">
              <img src="/icons/flogo_rgb_hex-brc-site-250.png"`alt="Facebook"`/>
            </figure>
          </a>
        </div>
        <div class="column is-11">
          <a v-if="hasLinkedin !== ''" :href="hasLinkedin" target="_new">
            <figure class="image is-48x48">
              <img src="/icons/In-2C-128px-R.png" alt="LinkedIn"/>
            </figure>
          </a>
        </div>
      </div>
  </section>
</template>

<script>
  export default {
    computed: {
      hasFacebook () {
        return this.$store.state.settings.facebook_link
      },
      hasLinkedin () {
        return this.$store.state.settings.linkedin_link
      }
    }
  }
</script>
