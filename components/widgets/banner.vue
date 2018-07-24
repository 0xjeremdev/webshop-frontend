<template>
  <section id="banner" class="hero">
    <no-ssr placeholder="Loading...">
    <Carousel :perPage="1"
      :loop="true"
      :autoplay="true"
      :autoplayTimeout="5000"
      :navigationEnabled="false"
      :paginationEnabled="false">
      <Slide>
        <div class="my-overlay">
          <img src="https://wikiki.github.io/images/merry-christmas.jpg" alt="Image1" />
        </div>
      </Slide>
      <Slide>
        <div class="my-overlay">
          <img src="https://wikiki.github.io/images/singer.jpg" alt="Image2" />
        </div>
      </Slide>
    </Carousel>
    </no-ssr>
  </section>
</template>

<script>
  import { Carousel, Slide } from 'vue-carousel'

  export default {
    components: { Carousel, Slide },
    data () {
      return {
        images: ''
      }
    }
  }
</script>

<style scoped>
  .my-overlay {
    position: relative;
    text-align: center;
  }

  .my-overlay-text {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1.5em;
    margin: 0;
    text-align: center;
    background: rgba(255,255,255,.6);
    font-size: .75rem;
  }
</style>
