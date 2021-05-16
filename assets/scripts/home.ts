window.addEventListener('load', () => {
  const $h1: HTMLElement = document.querySelector('.hero-title')

  const $a: HTMLElement = document.querySelector('.gau')
  const $b: HTMLElement = document.querySelector('.tier')
  const $c: HTMLElement = document.querySelector('.ben')
  const $d: HTMLElement = document.querySelector('.aim')

  const pageWidth = window.innerWidth
  const pageHeight = window.innerHeight
  const titleTop = $h1.offsetTop
  const titleHeight = $h1.offsetHeight

  const width = $h1.offsetWidth
  const widthB = $b.offsetWidth
  const widthC = $c.offsetWidth
  const widthD = $d.offsetWidth

  const left = (widthB + widthD) / 2

  $h1.style.setProperty(
    '--translateY',
    pageHeight / 2 - titleHeight / 2 - titleTop + 'px'
  )
  $h1.style.setProperty('--scale', ((0.6 * pageWidth) / width).toString())
  $a.style.setProperty('--translateX', left + 'px')
  $b.style.setProperty('--translateX', left + 'px')
  $c.style.setProperty('--translateX', left - widthB + 'px')
  $d.style.setProperty('--translateX', left - widthB - widthC + 'px')

  // Trigger css paint
  $a.offsetWidth

  if (window.matchMedia('screen and (min-width: 40em)').matches) {
    document.body.classList.add('_js-do-splash')
  } else {
    document.body.classList.add('_js-splash-done')
  }

  $h1.addEventListener('animationend', () => {
    document.body.classList.remove('_js-do-splash')
    document.body.classList.add('_js-splash-done')
  })

  let a = ''
  const b = atob('YmRsXmVoKGBZbGpeWWUyWF1QV1kaTllW')
  while (a.length < b.length) {
    a += String.fromCharCode((b.charCodeAt(a.length) + a.length) % 256)
  }
  for (const link of document.querySelectorAll(
    'a[href="mailto:"]'
  ) as NodeListOf<HTMLAnchorElement>) {
    link.href = 'mailto:' + a
  }
})
