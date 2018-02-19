export const contains = (val, arr) => {
  for (var arrVal in arr) {
    console.log(arr[arrVal])
    if (arr[arrVal] === val) {
      return true
    }
  }
  return false
}
