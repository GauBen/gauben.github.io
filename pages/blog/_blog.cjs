const { permalink } = require('../_data/eleventyComputed.cjs')

module.exports = (data) => {
  return {
    ...data,
    permalink,
    layout: 'blog.njk',
    pagination: {
      data: 'collections.post',
      size: 2,
      alias: 'posts',
      before: (collection) =>
        collection.filter((post) => post.data.locale === data.locale),
    },
  }
}
