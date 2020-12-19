const path = require('path')

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-syntaxhighlight'))
  eleventyConfig.setDataDeepMerge(true)

  // Filter that keeps items that have the same `data.locale` as
  // `locale`. If `locale` is falsy, it is fetched in the current context.
  eleventyConfig.addFilter('samelocale', function (collection, locale) {
    locale = locale || this.ctx.locale || this.ctx.locales.index
    return collection.filter(item => {
      return item.data.locale === locale
    })
  })

  // Filter that keeps items that are translations of `page`.
  // If `page` is falsy, it is fetched in the current context.
  eleventyConfig.addFilter('samepage', function (collection, page) {
    const locales = this.ctx.locales
    if (!page) {
      const pathInfo = path.parse(this.ctx.page.filePathStem)
      page = pathInfo.base in locales
        ? pathInfo.dir
        : this.ctx.page.filePathStem
    }
    return collection.filter(item => {
      const pathInfo = path.parse(item.filePathStem)
      return (pathInfo.base in locales
        ? pathInfo.dir
        : this.ctx.page.filePathStem) === page
    })
  })

  // Append locale identifier at given url
  eleventyConfig.addFilter('localizeurl', function (url, locale) {
    const locales = this.ctx.locales
    locale = locale || this.ctx.locale || locales.index
    const pathInfo = path.parse(url)
    // (/fr)? + /path/to + (/non-locale-file-name)? + /
    return `${locale === locales.index ? '' : `/${locale}`
      }${pathInfo.dir}${pathInfo.base in locales ? '' : `/${pathInfo.base}`
      }/`
  })

  // Sort locales in alphabetical order
  eleventyConfig.addFilter('sortbylocale', function (collection) {
    return collection.slice().sort((a, b) => 2 * Number(a.data.locale > b.data.locale) - 1)
  })

  // Cut slash-separated tags
  eleventyConfig.addFilter('subtags', function (tags, category) {
    const len = category.length + 1
    return tags.filter(tag => tag.startsWith(category + '/', 0)).map(tag => tag.substring(len))
  })

  // Translate the string given with translations found in `_data/translations`
  eleventyConfig.addFilter('translate', function (str, locale) {
    const locales = this.ctx.locales
    locale = locale || this.ctx.locale || locales.index
    return locale in this.ctx.translations && str in this.ctx.translations[locale]
      ? this.ctx.translations[locale][str]
      : str
  })

  eleventyConfig.setBrowserSyncConfig({
    ui: false,
    server: {
      baseDir: '_dist'
    }
  })

  return {
    dir: {
      input: 'pages'
    },
    markdownTemplateEngine: 'njk'
  }
}
