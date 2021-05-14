const { permalink } = require('../_data/eleventyComputed.cjs')

const blog = (data) => {
  return {
    ...data,
    layout: 'blog.njk',
    permalink: permalink,
    pagination: {
      data: `collections.post/${data.locale}`,
      size: 2,
      alias: 'posts',
    },
  }
}

module.exports = blog
