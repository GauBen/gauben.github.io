document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#age').innerHTML = (new Date().getTime() - new Date(1999, 4, 7).getTime()) / 31536000000 | 0
})
