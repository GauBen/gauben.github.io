# [gauben.github.io](https://gauben.github.io)

My public website, featuring a list of my projects and a blog.

## Features

- [x] Markdown to HTML ([Eleventy](https://11ty.dev/))
  - [x] Syntax highlighting
  - [x] Table of contents
  - [x] Mermaid
  - [x] Katex
- [x] TypeScript and Stylus ([Parcel](https://parceljs.org/))
- [x] I18n
- [x] Linting
- [x] App manifest
- [x] 400/400 on [Lighthouse](https://web.dev/measure/)
- [ ] Blog
  - [x] Posts
  - [ ] Tags
  - [ ] Authors
  - [x] Atom feed
  - [x] [Comments](https://utteranc.es)
- [x] Dark theme

## Prerequisites

```bash
# Install volta (a node and yarn version manager)
curl https://get.volta.sh | bash
# Clone the repo
git clone https://github.com/GauBen/gauben.github.io.git
cd gauben.github.io
```

## Build for production

```bash
yarn install
yarn build
```

## Development

```bash
yarn install
yarn start
```

To start a server with the production build, use `yarn preview`.
