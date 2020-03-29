function $ (e: string): HTMLElement { return document.querySelector(e) }
function $$ (e: string): HTMLCollectionOf<HTMLElement> { return document.querySelectorAll(e) }

const $body = document.body
const $h1 = $('h1')
const $a = $('.a')
const $b = $('.b')
const $c = $('.c')
const $d = $('.d')

const pageWidth = $body.parentElement.offsetWidth
const pageHeight = $body.parentElement.offsetHeight
const titleTop = $h1.offsetTop
const titleHeight = $h1.offsetHeight

const width = $h1.offsetWidth
const widthB = $b.offsetWidth
const widthC = $c.offsetWidth
const widthD = $d.offsetWidth

const left = (widthB + widthD) / 2

$h1.style.setProperty('--translateY', (pageHeight / 2 - titleHeight / 2 - titleTop) + 'px')
$h1.style.setProperty('--scale', 0.8 * pageWidth / width)
$a.style.setProperty('--translateX', left + 'px')
$b.style.setProperty('--translateX', left + 'px')
$c.style.setProperty('--translateX', (left - widthB) + 'px')
$d.style.setProperty('--translateX', (left - widthB - widthC) + 'px')

// Trigger css paint
// eslint-disable-next-line no-unused-expressions
$a.offsetWidth

document.body.classList.add('loaded')
if (window.matchMedia('screen and (min-width: 650px)').matches) {
  document.body.classList.add('do-splash')
} else {
  document.body.classList.add('splash-done')
}
$h1.addEventListener('animationend', function () {
  document.body.classList.remove('do-splash')
  document.body.classList.add('splash-done')
})

let a = ''
const b = atob('YmRsXmVoKGBZbGpeWWUyWF1QV1kaTllW')
while (a.length < b.length) {
  a += String.fromCharCode((b.charCodeAt(a.length) + a.length) % 256)
}
$$('a[href^=mai' + 'lto]').forEach(e => { e.href = 'mai' + 'lto:' + a })
