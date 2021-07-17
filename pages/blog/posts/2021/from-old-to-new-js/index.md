---
title: How to build a modern JavaScript project?
eleventyExcludeFromCollections: true
---

JavaScript is a weird language. It's terribly designed, made as a patchwork of badly picked patterns and conventions. That's why it's genuinely _hard_ to write good JavaScript. In this article, I'll give you the tools and techniques to build _maintainable_ JavaScript projects.

## For begginers

The first thing you'll need, and it's not related to JavaScript at all, is a confortable development environment. Regardless of your operating system, I recommend to use [Visual Studio Code](https://code.visualstudio.com/) -- it comes with JavaScript support out of the box. It has a lot of features, and **a nice way to discover them**: press `Ctrl+Shift+P` and type `Help: Interactive Playground` and then press `Enter`.

VSCode has an integrated terminal, and it's more than enough for the tools you'll see in this article.

### Git

[Git](https://git-scm.com/) doesn't need to be introduced, it's the de-facto standard for version control. VSCode offers a graphical interface for all the basic git commands. It's more than enough for the _pull-commit-push_ workflow, but you'll need the command line to use other commands like [`git bisect`](https://git-scm.com/docs/git-bisect), the command that helps you find the commit that introduced a bug.

```shell-session
$ git init
$ git add .
$ git commit -m 'message'
```

### Volta

[Volta](https://volta.sh/) is a rather new solution to an old problem: managing your Node.js installation. It allows you to download and install Node.js on your machine, on a per-project basis. While you may not need to directly use Node.js, all the tools below need it.

```shell-session
$ curl https://get.volta.sh | bash
Installing latest version of Volta (1.0.4)

$ vola install node
success: installed and set node@14.17.3 (with npm@6.14.13) as default

$ node -v
v14.17.3
```

### NPM

NPM is a package manager for JavaScript. It's a tool that download and manages the dependencies of your project.

```shell-session
$ npm init
$ npm install markdown-it
$ echo '# Hello!' | npx markdown-it
```

### XO

XO is a JavaScript linter and formatter: it checks your code for errors (like `undefined` variables, never-called functions, etc.), and fix your indentation. It keeps your code clean and readable.

```shell-session
$ npm init xo
$ npx xo
```

### Parcel

Parcel is a JavaScript bundler.

### The debugger

Yep.

### Learn modern JavaScript

```js
const user = {
  name: 'John Doe',
  email: 'john.doe@example.org',
  age: 42,
}

const { age, name } = user
if (age < 18) console.log(`${name} is not old enough to vote`)

import three from 'three.js'

/**
 * Linear interpolation between two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @param {number} t - The interpolation factor.
 *
 * @return {number} The interpolated value.
 */
function lerp(a, b, t) {
  return a + (b - a) * t
}

expect(lerp(5, 10, 0.2)).toBeCloseTo(6)
```

- var/let/const
- destructuring and spread
- import/export
- promise
- docblock https://jsdoc.app/
- classes
- template strings

-> repo git already setup

## For experienced developers

- volta
- yarn 3
- eslint (xo + unicorn)
- prettier
- parcel + eleventy
- typescript
