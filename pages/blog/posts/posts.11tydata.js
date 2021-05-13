const path = require('path')
const slugify = require('slugify')
const eleventyComputed = require('../../_data/eleventyComputed')
const { DateTime } = require('luxon')

module.exports = {
  layout: 'post.njk',
  tags: ['post'],
  eleventyComputed: {
    ...eleventyComputed,
    permalink: (data) => {
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
  },
}
