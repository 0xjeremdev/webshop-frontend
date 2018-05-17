<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-one-quarter">
          <accountMenu link="personal"></accountMenu>
        </div>
        <div class="column">
          <h1 class="title">Personal Info</h1>
          <b-field grouped>
            <b-field label="Title">
                <b-select placeholder="Title">
                    <option value="M">Mr.</option>
                    <option value="F">Ms.</option>
                </b-select>
            </b-field>
              <b-field label="Lastname" expanded>
                  <b-input placeholder="Lastname"></b-input>
              </b-field>
              <b-field label="Firstname" expanded>
                  <b-input placeholder="Firstname"></b-input>
              </b-field>
          </b-field>
          <b-field grouped>
            <b-field label="Company" expanded>
              <b-input placeholder="eg. LabNed"></b-input>
            </b-field>
            <b-field label="VAT No" expanded>
              <b-input placeholder="VAT No"></b-input>
            </b-field>
          </b-field>
          <b-field grouped>
            <b-field label="Phone" expanded>
              <b-input placeholder="Phone"></b-input>
            </b-field>
            <b-field label="Mobile" expanded>
              <b-input placeholder="Mobile"></b-input>
            </b-field>
            <b-field label="Fax" expanded>
              <b-input placeholder="Fax"></b-input>
            </b-field>
          </b-field>
          <p class="control">
            <button type="submit" @click="doSubmit()" class="button is-primary">Change</button>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import accountMenu from '~/components/ui/accountMenu.vue'

  export default {
    components: { accountMenu },
    data () {
      return {
        newsletter: false
      }
    },
    methods: {
      doSubmit () {
        console.log('pressedit')
      }
    }
  }
</script>
