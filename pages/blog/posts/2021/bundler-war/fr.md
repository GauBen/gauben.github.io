---
title: Bundler War
---

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
        /_pre-dist/assets -->|input| C -->|linked| B[.html]
        /_pre-dist/static -->|linked| B
    end
    /pages -->|input| E -->|output| /_pre-dist
    /assets & /static -->|copied| /_pre-dist
    /_pre-dist -->|input| P -->|output| /_dist
```
