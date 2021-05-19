const path = require('path')
const slugify = require('uslug')

const eleventyComputed = {
  locale: (data) => {
    if (
      'locale' in data &&
      typeof data.locale === 'string' &&
      data.locale.length > 0
    ) {
      if (data.locale in data.locales) {
        return data.locale
      }
      throw new Error(
        `Unknown locale '${data.locale}'. (Known locales: ${Object.keys(
          data.locales
        ).join(', ')})`
      )
    }
    const base = path.parse(data.page.filePathStem).base
    if (base in data.locales) {
      return base === 'index' ? data.locales.index : base
    }
    return data.locales.index
  },
  permalink: (data) => {
    if (Object.entries(data).length === 0) {
      return false
    }
    if (
      'permalink' in data &&
      typeof data.permalink === 'string' &&
      data.permalink.length > 0
    ) {
      return data.permalink
    }
    // Put the language code at the beginning
    const stem = data.page.filePathStem
    const pathInfo = path.parse(stem)
    const locale = eleventyComputed.locale(data)
    let pageNumber = ''
    if ('pagination' in data) {
      if (data.pagination.size == 1) {
        pageNumber = `${slugify(data.pagination.items[0])}/`
      } else if (data.pagination.pageNumber > 0) {
        pageNumber = `${data.pagination.pageNumber + 1}/`
      }
    }

    // (/fr)? + /path/to + (/non-locale-file-name)? + /
    return `${locale === data.locales.index ? '' : `/${locale}`}${
      pathInfo.dir
    }${pathInfo.base in data.locales ? '' : `/${pathInfo.base}`}/${pageNumber}`
  },
  dir: (data) => '~/' + path.normalize(path.parse(data.page.inputPath).dir),
}

module.exports = eleventyComputed
