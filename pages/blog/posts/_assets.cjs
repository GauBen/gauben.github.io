module.exports = (markdown, scripts, styles) => {
  // Add the mermaid renderer if the markdown file contains mermaid code blocks
  if (markdown.includes('```mermaid')) {
    scripts.add('~/assets/scripts/mermaid.ts')
  }
  // Add the KaTeX stylesheet if the markdown file containts $inline latex$ or $$block latex$$
  if (markdown.includes('$$') || /\$\S[^\n]+\S\$|\$\S\$/.test(markdown)) {
    styles.add('~/assets/styles/katex.styl')
  }
}
