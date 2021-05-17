---
title: 'Prism.js test : la matinée'
description: Markdown syntax highlighting is fun!
---

```js
const fs = require('fs')
const path = require('path')

const highlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const rss = require('@11ty/eleventy-plugin-rss')
const { DateTime } = require('luxon')

const markdownIt = require('markdown-it')
const footnote = require('markdown-it-footnote')
const taskLists = require('markdown-it-task-lists')
const implicitFigures = require('markdown-it-implicit-figures')
const katex = require('@traptitech/markdown-it-katex')
const imageLazyLoading = require('markdown-it-image-lazy-loading')
const multimdTable = require('markdown-it-multimd-table')
const anchor = require('markdown-it-anchor')
const tocDoneRight = require('markdown-it-toc-done-right')

const locales = require('./locales.json')

const flattenObject = (obj, out = new Map(), prefix = '') => {
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Object) {
      flattenObject(value, out, `${prefix}${key}.`)
    } else {
      out.set(`${prefix}${key}`, value)
    }
  }
  return out
}

module.exports = (eleventyConfig) => {
  // Register locales
  eleventyConfig.addGlobalData('locales', locales)

  // Find translations
  const translations = new Map()
  for (const locale of Object.keys(locales)) {
    if (locale === 'index') continue
    const strings = JSON.parse(
      fs.readFileSync(`./translations/${locale}.json`).toString()
    )
    translations.set(locale, flattenObject(strings))
  }
  if (!translations.has(locales.index)) {
    throw new Error(
      `Main locale "${locales.index}" not found (./translations/${locales.index}.json)`
    )
  }

  // Add eleventy plugins
  eleventyConfig.addPlugin(highlight)
  eleventyConfig.addPlugin(rss)

  // Add many libraries to markdown-it
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
      .use(implicitFigures)
      .use(katex, { throwOnError: true })
      .use(imageLazyLoading)
      .use(anchor, {
        level: 2,
        permalink: true,
        permalinkSymbol: '#',
        permalinkBefore: true,
      })
      .use(tocDoneRight)
      .use((md) => {
        const origin = md.renderer.rules.fence.bind(md.renderer.rules)
        md.renderer.rules.fence = (tokens, idx, ...args) => {
          const token = tokens[idx]
          if (token.info === 'mermaid') {
            return `<pre class="mermaid">${token.content.trim()}</pre>`
          }
          return origin(tokens, idx, ...args)
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
  eleventyConfig.addFilter('t', function (string, locale) {
    locale = locale || this.ctx.locale || locales.index
    if (!translations.has(locale)) {
      throw new Error(`Unknown locale "${locale}"`)
    }
    const strings = translations.get(locale)
    if (strings.has(string)) {
      return strings.get(string)
    }
    const fallbackStrings = translations.get(locales.index)
    if (fallbackStrings.has(string)) {
      return fallbackStrings.get(string)
    }
    throw new Error(
      `Cannot find a suitable transation for the string "${string}" for locale "${locale}"`
    )
  })

  // Translate the string given with translations found in `_data/translations`
  eleventyConfig.addFilter(
    'dateformat',
    function (date, locale, format = DateTime.DATE_FULL) {
      locale = locale || this.ctx.locale || locales.index
      return DateTime.fromJSDate(date).setLocale(locale).toLocaleString(format)
    }
  )

  // Articles in a given language
  for (const locale of Object.keys(locales)) {
    if (locale === 'index') continue
    eleventyConfig.addCollection(`post/${locale}`, function (collectionApi) {
      return eleventyConfig.getFilter('samelocale')(
        collectionApi.getFilteredByTag('post').reverse(),
        locale
      )
    })
  }

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
```

```css
/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="{{ style }}" />
    <link rel="shortcut icon" href="~/static/favicon.ico" type="image/x-icon" />
    <link rel="manifest" href="~/assets/app.webmanifest" />
    <meta property="og:image" content="~/resources/portfolio.png" />
  </head>
</html>
```
