const blog = require('./blog.cjs')

module.exports.data = blog({
  title: 'Blog',
  description: 'Découvrez mes derniers',
  locale: 'fr',
})
