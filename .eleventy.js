const fs = require('fs')
const path = require('path')
const highlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const rss = require('@11ty/eleventy-plugin-rss')
const markdownIt = require('markdown-it')
const footnote = require('markdown-it-footnote')
const taskLists = require('markdown-it-task-lists')
// const mermaid = require('@liradb2000/markdown-it-mermaid')
const multimdTable = require('markdown-it-multimd-table')

module.exports = (eleventyConfig) => {
  /** @type Object<string, string> */
  const locales = JSON.parse(fs.readFileSync('./locales.json').toString())

  // Register locales
  eleventyConfig.addGlobalData('locales', locales)

  // Add eleventy plugins
  eleventyConfig.addPlugin(highlight)
  eleventyConfig.addPlugin(rss)

  eleventyConfig.setLibrary(
    'md',
    markdownIt({ html: true, linkify: true, typographer: true })
      .use(footnote)
      .use(taskLists)
      .use(multimdTable, {
        multiline: true,
        rowspan: true,
        headerless: true,
      })
      .use(require('markdown-it-implicit-figures'))
      .use(require('@traptitech/markdown-it-katex'), { throwOnError: true })
      .use(require('markdown-it-image-lazy-loading'))
      .use(require('markdown-it-anchor'), {
        level: 2,
        permalink: true,
        permalinkBefore: true,
        permalinkSymbol: '#',
      })
      .use(require('markdown-it-toc-done-right'))
      // .use(mermaid)
  )

  // Filter that keeps items that have the same `data.locale` as
  // `locale`. If `locale` is falsy, it is fetched in the current context.
  eleventyConfig.addFilter('samelocale', function (collection, locale) {
    locale = locale || this.ctx.locale || locales.index
    return collection.filter((item) => {
      return item.data.locale === locale
    })
  })

  // Filter that keeps items that are translations of `page`.
  // If `page` is falsy, it is fetched in the current context.
  eleventyConfig.addFilter('samepage', function (collection, page) {
    if (!page) {
      const pathInfo = path.parse(this.ctx.page.filePathStem)
      page =
        pathInfo.base in locales ? pathInfo.dir : this.ctx.page.filePathStem
    }
    return collection.filter((item) => {
      const pathInfo = path.parse(item.filePathStem)
      return (
        (pathInfo.base in locales
          ? pathInfo.dir
          : this.ctx.page.filePathStem) === page
      )
    })
  })

  // Append locale identifier at given url
  eleventyConfig.addFilter('localizeurl', function (url, locale) {
    locale = locale || this.ctx.locale || locales.index
    const pathInfo = path.parse(url)
    // (/fr)? + /path/to + (/non-locale-file-name)? + /
    return eleventyConfig.getFilter('url')(
      `${locale === locales.index ? '' : `/${locale}`}${
        pathInfo.dir === '/' ? '' : pathInfo.dir
      }${pathInfo.base in locales ? '' : `/${pathInfo.base}`}/`
    )
  })

  // Sort locales in alphabetical order
  eleventyConfig.addFilter('sortbylocale', function (collection) {
    return [...collection].sort((a, b) =>
      a.data.locale.localeCompare(b.data.locale)
    )
  })

  // Cut slash-separated tags
  eleventyConfig.addFilter('subtags', function (tags, category) {
    const length = category.length + 1
    return tags
      .filter((tag) => tag.startsWith(category + '/', 0))
      .map((tag) => tag.slice(Math.max(0, length)))
  })

  // Translate the string given with translations found in `_data/translations`
  eleventyConfig.addFilter('translate', function (string, locale) {
    locale = locale || this.ctx.locale || locales.index
    return locale in this.ctx.translations &&
      string in this.ctx.translations[locale]
      ? this.ctx.translations[locale][string]
      : string
  })

  eleventyConfig.setBrowserSyncConfig({
    server: {
      baseDir: '.dist',
    },
  })

  return {
    dir: {
      input: 'pages',
      output: '.pre-dist',
    },
    markdownTemplateEngine: 'njk',
  }
}
