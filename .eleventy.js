const fs = require('fs')
const path = require('path')

const highlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const rss = require('@11ty/eleventy-plugin-rss')
const navigation = require('@11ty/eleventy-navigation')
const toc = require('eleventy-plugin-toc')
const { DateTime } = require('luxon')
const slugify = require('uslug')
const pupa = require('pupa')

const markdownIt = require('markdown-it')
const footnote = require('markdown-it-footnote')
const taskLists = require('markdown-it-task-lists')
const implicitFigures = require('markdown-it-implicit-figures')
const katex = require('@traptitech/markdown-it-katex')
const imageLazyLoading = require('markdown-it-image-lazy-loading')
const multimdTable = require('markdown-it-multimd-table')
const anchor = require('markdown-it-anchor')

const locales = require('./locales.json')

const nestedGet = (object, key) => {
  const path = key.split('.')
  while (path.length > 0) {
    const top = path.shift()
    try {
      object = object[top]
    } catch {
      throw new Error(`Cannot read key "${key}"`)
    }
  }
  return object
}

// Find translations
const translations = new Map()
for (const locale of Object.keys(locales)) {
  if (locale === 'index') continue
  const strings = JSON.parse(
    fs.readFileSync(`./translations/${locale}.json`).toString()
  )
  translations.set(locale, strings)
}
if (!translations.has(locales.index)) {
  throw new Error(
    `Main locale "${locales.index}" not found (./translations/${locales.index}.json)`
  )
}

module.exports = (eleventyConfig) => {
  // Register locales
  eleventyConfig.addGlobalData('locales', locales)

  // Add eleventy plugins
  eleventyConfig.addPlugin(highlight)
  eleventyConfig.addPlugin(rss)
  eleventyConfig.addPlugin(navigation)
  eleventyConfig.addPlugin(toc, {
    tags: ['h2', 'h3', 'h4', 'h5', 'h6'],
    wrapper: 'div',
  })

  // Add many libraries to markdown-it
  eleventyConfig.setLibrary(
    'md',
    markdownIt({ html: true, typographer: true })
      .use(footnote)
      .use(taskLists)
      .use(multimdTable, {
        multiline: true,
        rowspan: true,
        headerless: true,
      })
      .use(implicitFigures)
      .use(katex, { throwOnError: true })
      .use(imageLazyLoading)
      .use(anchor, {
        level: 2,
        permalink: true,
        permalinkSymbol: ' #',
        permalinkBefore: true,
        slugify: (s) => slugify(s),
      })
      .use((md) => {
        const origin = md.renderer.rules.fence.bind(md.renderer.rules)
        md.renderer.rules.fence = (
          tokens,
          index,
          options,
          environment,
          self
        ) => {
          const token = tokens[index]
          if (token.info === 'mermaid') {
            return `<pre class="mermaid">${token.content.trim()}</pre>`
          }
          return origin(tokens, index, options, environment, self)
        }
      })
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
  const getPage = (stem) => {
    const pathInfo = path.parse(stem)
    return pathInfo.base in locales ? pathInfo.dir : stem
  }
  eleventyConfig.addFilter('samepage', function (collection, page) {
    if (!page) page = getPage(this.ctx.page.filePathStem)
    return collection.filter((item) => {
      return page === getPage(item.filePathStem)
    })
  })

  // Append locale identifier at given url
  eleventyConfig.addFilter('localizeurl', function (url, locale) {
    const samepage = eleventyConfig.getFilter('samepage').bind(this)
    const samelocale = eleventyConfig.getFilter('samelocale').bind(this)
    const page = samelocale(samepage(this.ctx.collections.all, url), locale)
    if (page.length !== 1)
      throw new Error(
        `Localizeurl found ${page.length} pages matching "${url}" (correct format is "/about/resume")`
      )
    const urlfilter = eleventyConfig.getFilter('url').bind(this)
    return urlfilter(page[0].url)
  })

  // Sort locales in alphabetical order
  eleventyConfig.addFilter('sortbylocale', function (collection) {
    return [...collection].sort((a, b) =>
      a.data.locale.localeCompare(b.data.locale)
    )
  })

  // Translate the string given with translations found in `_data/translations`
  eleventyConfig.addFilter('t', function (string, locale) {
    locale = locale || this.ctx.locale || locales.index
    if (!translations.has(locale)) {
      throw new Error(`Unknown locale "${locale}"`)
    }
    const strings = translations.get(locale)
    try {
      return nestedGet(strings, string)
    } catch {
      const fallbackStrings = translations.get(locales.index)
      try {
        return nestedGet(fallbackStrings, string)
      } catch {
        throw new Error(
          `Cannot find a suitable transation for the string "${string}" for locale "${locale}"`
        )
      }
    }
  })

  // Translate the string given with translations found in `_data/translations`
  eleventyConfig.addFilter(
    'dateformat',
    function (date, locale, format = DateTime.DATE_FULL) {
      locale = locale || this.ctx.locale || locales.index
      return DateTime.fromJSDate(date).setLocale(locale).toLocaleString(format)
    }
  )

  // Translate the string given with translations found in `_data/translations`
  eleventyConfig.addFilter('cleantags', function (tags) {
    const metaTags = new Set(['project', 'post'])
    return [...new Set([...tags].filter((x) => !metaTags.has(x)))]
  })

  // Simple micro templating
  eleventyConfig.addFilter('f', (string, ...arguments_) => {
    if (arguments_.length === 0) throw new Error('No arguments provided')
    if (typeof arguments_[0] === 'object') {
      return pupa(string, arguments_[0])
    }
    return pupa(string, arguments_)
  })

  // Pluralize stringsexi
  eleventyConfig.addFilter('p', (strings, n) => {
    return pupa(n > 1 ? strings[1] : strings[0], [n])
  })

  // Replace spaces with non-breaking space
  eleventyConfig.addFilter('nbsp', (string) => {
    return string.replace(/ /g, ' ')
  })

  eleventyConfig.setBrowserSyncConfig({
    watch: true,
    server: '.dist',
  })

  return {
    dir: {
      input: 'pages',
      output: '.pre-dist',
    },
    markdownTemplateEngine: 'njk',
  }
}
