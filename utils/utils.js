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
