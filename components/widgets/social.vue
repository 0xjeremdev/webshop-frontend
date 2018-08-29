<template>
  <section>
      <div class="columns is-mobile">

        <div class="column is-one-third my_div">
          <a v-if="hasFacebook !== ''" :href="hasFacebook" target="_new">
            <figure class="image">
              <img src="/icons/flogo_rgb_hex-brc-site-250.png" style="display: inline-flex; max-width:40px;
  max-height:2.25em;
  width: auto;
  height: auto;" alt="Facebook"/>
            </figure>
          </a>
        </div>
        <div class="column is-one-third my_div">
          <a v-if="hasLinkedin !== ''" :href="hasLinkedin" target="_new">
            <figure class="image">
              <img src="/icons/In-2C-128px-R.png" alt="LinkedIn" style="display: inline-flex; max-width:40px;
  max-height:2.25em;
  width: auto;
  height: auto;"/>
            </figure>
          </a>
        </div>
        <div class="column is-one-fifth">
        </div>
        <div class="column is-one-fifth">
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
  }
</style>
