const path = require('path')
const slugify = require('slugify')
const eleventyComputed = require('../../_data/eleventyComputed.cjs')
const { DateTime } = require('luxon')

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
      const slug = slugify(data.title, { lower: true, locale })
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
  },
}
