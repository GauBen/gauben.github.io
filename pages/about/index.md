---
layout: about.njk
title: About me
skills:
  [
    PHP,
    Composer,
    PHPUnit,
    MySQL,
    JavaScript,
    TypeScript,
    Node.js,
    Express,
    Hogan.js,
    WebSocket,
    Vue.js,
    CSS,
    Stylus,
    Python,
    Numpy,
    Java,
    JUnit,
    LibGDX,
    OCaml,
    Git,
    Docker,
  ]
eleventyNavigation:
  key: About
---

<div class="illustrated-text">
<img src="url:~/resources/me.jpg?as=webp" width="960" height="960" alt="A picture of me" class="illustration">

Hey! I'm Gautier Ben Aïm, a 21-year-old French software developer.
I'm currently learning Computer science at ENSEEIHT, France, and I wish to major in Software architecture and
Cyber security.

I discovered programming over ten years ago, and I haven't stopped since then. In parallel to my studies, I
learned front and back-end development, and in engineering school I am lerning computer theory.

I had the opportunity to work in many projects of various sizes – from a couple of people I met in real life
to small contributions to worldwide projects with hundreds of other contributors. My friends say I'm
spontaneous, ambitious and reliable. I enjoy teamwork, learning new technologies and keeping an eye on
programming trends.

If you want a deeper insight into my skills and education, [have a look at my resume.]({{'/about/resume'|localizeurl}})

</div>

## Skills

Here are the technologies I work with.

<ul class="tag-list">
  {%- for skill in skills -%}
    <li class="tag">
      <span class="span">{{ skill }}</span></li>
  {%- endfor -%}
</ul>

## Internship report, PPP…

Read my summer 2020 internship report and other documents in my shared folder.

**→ [My SHS online briefcase](https://drive.google.com/drive/folders/14SpPdu_O9YwVsRh2v4MxDKo7od1oXLzf)**

<a href="{{ '/' | localizeurl }}">{{ 'home.back' | t }}</a>
