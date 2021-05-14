const blog = require('./blog.cjs')

module.exports.data = blog({
  title: 'Blog',
  description: 'Discover my latest posts',
  locale: 'en',
})
