const { permalink } = require('../_data/eleventyComputed.cjs')

module.exports = (data) => {
  return {
    ...data,
    permalink,
    layout: 'blog.njk',
    pagination: {
      data: 'collections.post',
      size: 20,
      alias: 'posts',
      reverse: true,
      before: (collection) =>
        collection.filter((post) => post.data.locale === data.locale),
    },
    eleventyNavigation: {
      key: data.title,
    },
  }
}
