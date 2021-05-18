window.addEventListener('load', () => {
  let dark = false
  const $frame: HTMLIFrameElement = document.querySelector(
    'iframe.utterances-frame'
  )
  const $toggle: HTMLButtonElement = document.querySelector('#dark-toggle')
  $toggle.addEventListener('click', () => {
    $frame.contentWindow.postMessage(
      {
        type: 'set-theme',
        theme: dark ? 'github-light' : 'github-dark',
      },
      'https://utteranc.es'
    )
    dark = !dark
  })
})
