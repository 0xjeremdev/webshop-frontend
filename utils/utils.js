import CryptoJS from 'CryptoJS'

export const contains = (val, arr) => {
  for (var arrVal in arr) {
    console.log(arr[arrVal])
    if (arr[arrVal] === val) {
      return true
    }
  }
  return false
}

export const limitContent = (content) => {
  var maxLength = 500 // maximum number of characters to extract
  // trim the string to the maximum length
  var trimmedString = content.substr(0, maxLength)
  // re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')))
  return trimmedString + ' ...'
}

export const timeConverter = (timestamp) => {
  var a = new Date(timestamp)
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var year = a.getFullYear()
  var month = months[a.getMonth()]
  var date = a.getDate()
  var hour = a.getHours()
  var min = a.getMinutes()
  var sec = a.getSeconds()
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
  return time
}

export const BuckarooHmac = (function () {
  var self = {}

  function getEncodedContent (content) {
    if (content) {
      var md5 = CryptoJS.MD5(content)
      var base64 = CryptoJS.enc.Base64.stringify(md5)
      return base64
    }

    return content
  }

  function getHash (websiteKey, secretKey, httpMethod, nonce, timeStamp, requestUri, content) {
    var encodedContent = getEncodedContent(content)

    var rawData = websiteKey + httpMethod + requestUri + timeStamp + nonce + encodedContent
    var hash = CryptoJS.HmacSHA256(rawData, secretKey)
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash)

    return hashInBase64
  }

  function getTimeStamp () {
    let date = new Date()
    return Math.floor(date.getTime() / 1000)
  }

  function getNonce () {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  self.GetAuthHeader = function (requestUri, websiteKey, secretKey, content, httpMethod) {
    var nonce = getNonce()
    var timeStamp = getTimeStamp()
    content = (content !== undefined || content !== null) ? content : ''
    var url = encodeURIComponent(requestUri).toLowerCase()
    return 'hmac ' + websiteKey + ':' + getHash(websiteKey, secretKey, httpMethod, nonce, timeStamp, url, content) + ':' + nonce + ':' + timeStamp
  }

  return self
}())
