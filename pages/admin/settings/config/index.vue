<template>
  <div id="config">
    <br />
    <b-tabs position="is-centered" class="block" inputType="is-toggle-rounded">
      <b-tab-item v-for="(value, tabKey) in fields" :key="tabKey" :label="tabKey" :icon="fields[tabKey].icon">
        <div v-if="!isLoading">
          <b-field horizontal><!-- Label left empty for spacing -->
            <p class="control">
              <button class="button is-primary" @click="saveData">
                <b-icon icon="content-save"></b-icon>
                <span> Bewaren</span>
              </button>
              <button class="button is-outlined" @click="goBack">
                <b-icon icon="arrow-left"></b-icon>
                <span> Terug</span>
              </button>
            </p>
          </b-field>
          <hr>
          <br />
          <b-field v-for="(val, fieldKey) in value"
            v-if="fieldKey !== 'icon'"
            horizontal
            :data="val"
            :key="fieldKey"
            :label="getLabel(val, fieldKey)">
            <b-input v-if="val.inputType === 'input'" :value="getValue(val, fieldKey, tabKey)" :placeholder="getLabel(val, fieldKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <imageControl v-else-if="val.inputType === 'imageUpload'" image="/images/Accus-Siezenis.png"></imageControl>
            <b-taginput v-else-if="val.inputType === 'tagInput'"
              :placeholder="getLabel(val, fieldKey)"
              maxtags="5"
              :value="[]">
            </b-taginput>
            <quill-editor v-else-if="val.inputType === 'texteditor'" ref="myTextEditor"
                :value="getValue(val, fieldKey, tabKey)"
                @input="setModel($event, fieldKey, tabKey)"
                :config="editorConfig">
            </quill-editor>
            <b-switch v-else-if="val.inputType === 'switch'" v-model="configData[fieldKey]"></b-switch>
            <b-input v-else-if="val.inputType === 'email'" type="email" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <b-input v-else-if="val.inputType === 'text'" type="textarea" :placeholder="getLabel(val, fieldKey)" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)"></b-input>
            <b-input v-else-if="val.inputType === 'password'" type="password" @input="setModel($event, fieldKey, tabKey)" password-reveal></b-input>
            <b-checkbox-button  v-else-if="val.inputType === 'checkbox'" :value="getValue(val, fieldKey, tabKey, 'checkbox')" @input="setCheckbox($event, fieldKey, tabKey)" type="is-success"><b-icon icon="check"></b-icon></b-checkbox-button>
            <!-- <froala v-else-if="val.inputType === 'text'" :tag="'textarea'" :value="getValue(val, fieldKey, tabKey)" @input="setModel($event, fieldKey, tabKey)" :config="config">Init text</froala> -->
            <b-input v-else value="Could not load this type"></b-input>
          </b-field>
          <br />
          <hr>
          <b-field horizontal><!-- Label left empty for spacing -->
            <p class="control">
              <button class="button is-primary" @click="saveData">
                <b-icon icon="content-save"></b-icon>
                <span> Bewaren</span>
              </button>

              <button class="button is-outlined" @click="goBack">
                <b-icon icon="arrow-left"></b-icon>
                <span> Terug</span>
              </button>
            </p>
          </b-field>
        </div>
      </b-tab-item>
    </b-tabs>
    <b-loading :active.sync="isLoading" :canCancel="true"></b-loading>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import { quillEditor } from 'vue-quill-editor'

  export default {
    layout: 'admin',
    components: { quillEditor },
    data () {
      return {
        editorConfig: {},
        isSwitchedMaintenance: 'No',
        isLoading: false,
        fields: {
          'Webshop Configuration': {
            'maintenance': {
              'inputType': 'switch',
              'label': 'Maintenance Mode'
            },
            'contact_email': {
              'inputType': 'email',
              'label': 'Contact E-mail'
            },
            'order_email': {
              'inputType': 'email',
              'label': 'Order E-mail'
            },
            'cookie_wall': {
              'inputType': 'switch',
              'label': 'Cookie Wall'
            },
            'cookie_wall_text': {
              'inputType': 'texteditor',
              'label': 'Cookie Wall Text'
            },
            icon: 'file-document'
          }
        }
      }
    },
    created () {
      this.getData()
    },
    methods: {
      setModel (val, fieldKey, tabKey) {
        this.configData[fieldKey] = val
      },
      getLabel (val, fieldKey) {
        if (val.label) {
          return val.label
        }
        return fieldKey
      },
      getValue (val, fieldKey, tabKey, inputType) {
        if (this.configData instanceof Object) {
          if (inputType === 'checkbox') {
            console.log(fieldKey + ': ' + this.configData[fieldKey])
            if (this.configData[fieldKey] === 'true') { console.log('true') }
            return !this.configData[fieldKey]
          }
          return this.configData[fieldKey]
        }
        return ''
      },
      setCheckbox (val, fieldKey, tabKey) {
        this.configData[fieldKey] = !val
      },
      async getData () {
        try {
          this.isLoading = true
          let routeParams = this.$route.params
          // console.log(routeParams)
          if (routeParams instanceof Object && routeParams.key !== 'new') {
            if (!(this.$store.state.authUser instanceof Object)) {
              this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
            }
            this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
            let query = {
              'options': {
                'fullCount': true
              },
              'count': true,
              'query': 'FOR p in Config FILTER p._key == @key RETURN p',
              bindVars: {
                'key': '16226189'
              }
            }
            let data = await this.$axios.$post(this.$store.state.shopUrl + '/_api/cursor', query)
            console.log(data)
            this.configData = data['result'][0]
            this.isNew = false
            this.isLoading = false
          } else {
            this.isNew = true
            this.configData = {}
            if (this.configData instanceof Object) {
              for (var tabKey in this.fields) {
                for (var fieldKey in this.fields[tabKey]) {
                  this.configData[fieldKey] = ''
                }
              }
            }
            console.log(this.configData)
            this.isLoading = false
          }
        } catch (e) {
          this.$toast.open('Could not load data')
          this.isLoading = false
        }
      },
      async saveData () {
        try {
          this.isLoading = true
          if (!(this.$store.state.authUser instanceof Object)) {
            this.$store.commit('SET_USER', Cookies.getJSON('key2publish').authUser)
          }
          this.$axios.setToken(this.$store.state.authUser.jwt, 'Bearer')
          // let query = {'options': {'fullCount': true}, 'count': true, 'query': 'FOR p in k2p_product FILTER p.code == \'' + this.$route.params.code + '\' RETURN p'}
          // console.log(this.productData)
          // TODO: CHECK IF this.productData complies with fields before saving (this is necessary when isNew is True)
          console.log(this.configData)
          let query = {
            'options': {
              'fullCount': true
            },
            'count': true,
            'query': 'INSERT { maintenance: @maintenance, order_email: @order_email, contact_email: @contact_email, cookie_wall: @cookie_wall, cookie_wall_text: @cookie_wall_text } INTO Config',
            'bindVars': {
              'maintenance': this.configData.maintenance,
              'order_email': this.configData.order_email,
              'contact_email': this.configData.contact_email,
              'cookie_wall': this.configData.cookie_wall,
              'cookie_wall_text': this.configData.cookie_wall_text
            }
          }
          if (!this.isNew) {
            query = {
              'options': {
                'fullCount': true
              },
              'count': true,
              'query': 'UPDATE { _key: \'' + this.configData['_key'] + '\' } WITH { maintenance: @maintenance, order_email: @order_email, contact_email: @contact_email, cookie_wall: @cookie_wall, cookie_wall_text: @cookie_wall_text } IN Config',
              'bindVars': {
                'maintenance': this.configData.maintenance,
                'order_email': this.configData.order_email,
                'contact_email': this.configData.contact_email,
                'cookie_wall': this.configData.cookie_wall,
                'cookie_wall_text': this.configData.cookie_wall_text
              }
            }
            console.log(query)
          }
          let data = await this.$axios.$post(this.$store.state.shopUrl + '/_api/cursor', query)
          console.log(data)
          this.isLoading = false
          this.$toast.open('Saved')
          this.$router.push('/admin/dashboard')
        } catch (e) {
          console.log(e)
          this.$toast.open('Could not save data, please try again')
          this.isLoading = false
        }
      },
      goBack () {
        this.$router.push('/admin/dashboard')
      }
    }
  }
</script>

<style lang="stylus">
   @import "~quill/assets/snow"
</style>
