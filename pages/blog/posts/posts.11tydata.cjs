const path = require('path')
const slugify = require('uslug')
const eleventyComputed = require('../../_data/eleventyComputed.cjs')
const { DateTime } = require('luxon')
const fs = require('fs').promises

module.exports = {
  layout: 'post.njk',
  tags: ['post'],
  eleventyComputed: {
    ...eleventyComputed,
    permalink: (data) => {
      if (!('title' in data) || !data.title) {
        return ''
      }
      const locale = eleventyComputed.locale(data)
      const slug = slugify(data.title)
      const date = DateTime.fromJSDate(data.page.date)
      const stem = data.page.filePathStem
      const pathInfo = path.parse(stem)
      return `${
        locale === data.locales.index ? '' : `/${locale}`
      }/blog/${date.toFormat('yyyy-LL-dd')}-${slug}${
        pathInfo.base in data.locales ? '' : `/${pathInfo.base}`
      }/`
    },
    eleventyExcludeFromCollections: (data) => {
      return !('title' in data) || !data.title
    },
    words: async (data) => {
      try {
        const text = await fs.readFile(data.page.inputPath, 'ascii')
        return text.match(/\w+/g).length
      } catch {
        return 0
      }
    },
  },
}
