const $toggle: HTMLButtonElement = document.querySelector('#dark-toggle')

declare let darkEnabled: boolean
darkEnabled = false

const setDarkTheme = (enable: boolean) => {
  darkEnabled = enable
  localStorage['dark'] = String(enable)
  $toggle.textContent = document.documentElement.classList.toggle(
    '-dark',
    enable
  )
    ? '🌞'
    : '🌙'
  const $frame: HTMLIFrameElement = document.querySelector(
    'iframe.utterances-frame'
  )
  if ($frame !== null) {
    $frame.contentWindow.postMessage(
      {
        type: 'set-theme',
        theme: darkEnabled ? 'github-dark' : 'github-light',
      },
      'https://utteranc.es'
    )
  }
  const $script: HTMLScriptElement = document.querySelector(
    'script[src="https://utteranc.es/client.js"]'
  )
  if ($script !== null) {
    $script.setAttribute('theme', darkEnabled ? 'github-dark' : 'github-light')
  }
}

if (localStorage.getItem('dark') !== null)
  setDarkTheme(localStorage.getItem('dark') === 'true')
else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
  setDarkTheme(true)
else setDarkTheme(false)

$toggle.addEventListener('click', () => {
  setDarkTheme(!darkEnabled)
})
