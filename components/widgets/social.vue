<template>
  <section>
      <div class="columns">
        <div class="column is-one-third my_div">
          <a v-if="hasFacebook !== ''" :href="hasFacebook" target="_new">
            <figure class="image">
              <img src="/icons/flogo_rgb_hex-brc-site-250.png" style="height: 36px; width: 36px;" alt="Facebook"/>
            </figure>
          </a>
        </div>
        <div class="column is-one-third my_div">
          <a v-if="hasLinkedin !== ''" :href="hasLinkedin" target="_new">
            <figure class="image">
              <img src="/icons/In-2C-128px-R.png" alt="LinkedIn" style="height: 36px; width: 36px;"/>
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

<style>
  .my_div {
    /* padding-top: 2.25em; */
    margin: 0.1em;
  }
</style>
