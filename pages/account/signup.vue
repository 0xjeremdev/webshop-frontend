<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
        </div>
        <div class="column">
          <h1 class="title">Signup for LabNed.com</h1>
          <b-field label="Name">
            <b-input type="text" required placeholder="Type your name here"></b-input>
          </b-field>
          <b-field label="E-mail">
            <b-input type="email" required placeholder="example@labned.com"></b-input>
          </b-field>
          <b-field label="Password">
              <b-input required type="password"
                  placeholder="Password reveal input"
                  password-reveal>
              </b-input>
          </b-field>
          <b-field label="Repeat Password">
              <b-input required type="password"
                  placeholder="Password reveal input"
                  password-reveal>
              </b-input>
          </b-field>
          <b-field>
            <b-checkbox v-model="newsletter">Signup for the newsletter</b-checkbox>
          </b-field>
          <button type="submit" class="button is-primary">Submit</button>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        newsletter: false
      }
    }
  }
</script>
