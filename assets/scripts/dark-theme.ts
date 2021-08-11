const $toggle: HTMLButtonElement = document.querySelector('#dark-toggle')

let darkEnabled = false

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
    'iframe.giscus-frame'
  )
  if ($frame !== null) {
    try {
      $frame.contentWindow.postMessage(
        {
          giscus: {
            setConfig: {
              theme: darkEnabled ? 'dark' : 'light',
            },
          },
        },
        'https://giscus.app'
      )
    } catch {
      $frame.addEventListener('load', () => {
        setDarkTheme(darkEnabled)
      })
    }
  }
  const $script: HTMLScriptElement = document.querySelector(
    'script[src="https://giscus.app/client.js"]'
  )
  if ($script !== null) $script.dataset.theme = darkEnabled ? 'dark' : 'light'
}

if (localStorage.getItem('dark') !== null)
  setDarkTheme(localStorage.getItem('dark') === 'true')
else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
  setDarkTheme(true)
else setDarkTheme(false)

$toggle.addEventListener('click', () => {
  setDarkTheme(!darkEnabled)
})
