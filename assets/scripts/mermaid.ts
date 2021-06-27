import mermaid from 'mermaid'
mermaid.initialize({
  startOnLoad: true,
  theme: localStorage.getItem('dark') === 'true' ? 'dark' : 'default',
})
