export const actions = {
  async validateMail ({ commit, state, rootState }, { value }) {
    try {
      let res = value.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g)
      // let res = true
      let message = ''
      if (!res) {
        message = 'Invalid e-mail, please correct'
      }
      if (value === '') {
        message = 'This field cannot be empty'
      }
      return message
    } catch (error) {
      let message = 'Unexpected error occured, while validating'
      return message
    }
  },
  async validateSelect ({ commit, state, rootState }, { value }) {
    try {
      let message = ''
      if (value === null || value === '') {
        message = 'Please select a value'
      }

      return message
    } catch (error) {
      let message = 'Unexpected error occured, while validating'
      return message
    }
  },
  async validateNumber ({ commit, state, rootState }, { value }) {

  },
  async validateField ({ commit, state, rootState }, { value }) {
    try {
      let res = value.toString().match(/<[^>]*>/g)
      let message = ''

      if (res !== null && res.length > 0) {
        message = 'You cannot use html code inside this field'
      }
      if (value === null || value === '') {
        message = 'This field cannot be empty'
      }

      return message
    } catch (error) {
      console.log(error)
      let message = 'Unexpected error occured, while validating'
      return message
    }
  },
  async validatePassword ({ commit, state, rootState, dispatch }, { value }) {
    try {
      // Check the password
      let res = false

      if (value.length < 8) {
        res = false
      }

      var rules = [
        /[a-z]/, // letters (lower-case)
        /[A-Z]/, // letters (upper-case)
        /[0-9]/, // numbers (similar to /[0-9]/)
        /[!@#$&*]/ // some symbols
      ]

      res = rules.filter(function (rule) {
        return rule.test(value)
      }).length >= 3

      let message = ''
      if (!res) {
        message = 'The password does not match one of the following criteria of a minimum length of 8, one lowercase character, one uppercase character, a digit and one of the following characters !@#$&*'
      }
      return message
    } catch (error) {
      console.log(error)
      let message = 'Unexpected error occured, while validating'
      return message
    }
  },
  async validateRepeatPassword ({ commit, state, rootState }, { value, repeat }) {
    try {
      let message = ''
      if (value !== repeat) {
        message = 'The repeated password is not the same as the one in the password field, please make them equal'
      }
      return message
    } catch (error) {
      console.log(error)
      let message = 'Unexpected error occured, while validating'
      return message
    }
  }
}
