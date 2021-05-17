---
title: Bundler War
description: Et si la meilleure façon de créer un site était de combiner un générateur de site statique et un bundler ?
styles:
  - ~/assets/styles/katex.styl
scripts:
  - ~/assets/scripts/mermaid.ts
---

[toc]

## Mermaid

```mermaid
flowchart LR
    subgraph E ["Eleventy (static site generator)"]
      .md & .njk --> A[.html]
    end
    subgraph C ["Compilation"]
        .styl --> .css
        .ts --> .js
    end
    subgraph P ["Parcel (bundler)"]
        /assets -->|input| C -->|linked| B[.html]
    end
    /pages -->|input| E -->|output| /.pre-dist
    /static -->|copied| /.dist
    /.pre-dist -->|input| P -->|output| /.dist
```

## Prism

```js
let a = ''
const b = atob('YmRsXmVoKGBZbGpeWWUyWF1QV1kaTllW')
while (a.length < b.length) {
  a += String.fromCharCode((b.charCodeAt(a.length) + a.length) % 256)
}
for (const link of document.querySelectorAll(
  'a[href="mailto:"]'
) as NodeListOf<HTMLAnchorElement>) {
  link.href = 'mailto:' + a
}
```

## Katex

$$\forall n \in \N \text{ tel que } n \ge 3 \text{ et } n \text{ impair,}\\ \forall p \in \N \text{ tel que } 2 \le p \lt n,\\ n \not\equiv 0 \pmod p$$
