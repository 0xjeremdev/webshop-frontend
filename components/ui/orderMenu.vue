<template>
  <div class="columns">
    <div class="column">

    </div>
    <div class="column is-three-quarters-fullhd">
      <ul class="steps">
        <li :class="(step === '1') ? 'steps-segment is-active' : 'steps-segment'">
          <nuxt-link v-if="(Number(step) > 1)" to="/cart"><span class="steps-marker">1</span></nuxt-link>
          <span v-else class="steps-marker">1</span>
        </li>
        <li :class="(step === '2') ? 'steps-segment is-active' : 'steps-segment'">
          <nuxt-link v-if="(Number(step) > 2)" to="/order/overview"><span class="steps-marker">2</span></nuxt-link>
          <span v-else class="steps-marker">2</span>
        </li>
        <li :class="(step === '3') ? 'steps-segment is-active' : 'steps-segment'">
          <nuxt-link v-if="(Number(step) > 5)" to="/order/done">
            <span class="steps-marker">
              <span class="icon">
                <b-icon icon="flag-checkered"></b-icon>
              </span>
            </span>
          </nuxt-link>
          <span v-else class="steps-marker">
            <span class="icon">
              <b-icon icon="check"></b-icon>
            </span>
          </span>
        </li>
      </ul>
    </div>
    <div class="column">

    </div>
  </div>
</template>

<script>
  export default {
    props: ['step']
  }
</script>
