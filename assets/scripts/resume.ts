document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#age').innerHTML = Math.trunc(
    (Date.now() - new Date(1999, 4, 7).getTime()) / 31_536_000_000
  ).toString()
})
