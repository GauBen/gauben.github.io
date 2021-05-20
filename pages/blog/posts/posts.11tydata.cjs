const path = require('path')
const slugify = require('uslug')
const { DateTime } = require('luxon')
const fs = require('fs').promises

const eleventyComputed = require('../../_data/eleventyComputed.cjs')
const assets = require('./_assets.cjs')

// If no title is set, exclude the page from collections
const exclude = (data) => {
  return !('title' in data) || !data.title
}

module.exports = {
  layout: 'post.njk',
  tags: ['post'],
  author: 'Gautier',
  // We dynamically compute the permalink and asset dependencies
  eleventyComputed: (() => {
    // Read the raw markdown file to find dependencies
    // See ./_assets.cjs for the list of assets added automatically
    let parsed = false
    let cache = { scripts: new Set(), styles: new Set() }
    let parseMarkdown = async (data) => {
      if (!parsed) {
        let markdown = await fs.readFile(data.page.inputPath, 'ascii')
        assets(markdown, cache.scripts, cache.styles)
        cache.words = markdown.match(/\w+/g)?.length ?? 0
        parsed = true
      }
    }
    return {
      // Deep merge is disabled for eleventyComputed, so add everything
      ...eleventyComputed,
      // Exclude files without title
      eleventyExcludeFromCollections: exclude,
      // Permalink computation
      permalink: (data) => {
        if (exclude(data)) return ''
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
      // Number of words
      words: async (data) => {
        await parseMarkdown(data)
        return cache.words
      },
      // Script dependencies
      scripts: async (data) => {
        await parseMarkdown(data)
        let set = new Set('scripts' in data ? data.scripts : [])
        for (const script of cache.scripts) set.add(script)
        return [...set]
      },
      // Style dependencies
      styles: async (data) => {
        await parseMarkdown(data)
        let set = new Set('styles' in data ? data.styles : [])
        for (const style of cache.styles) set.add(style)
        return [...set]
      },
    }
  })(),
}
