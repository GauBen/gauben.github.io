---
layout: about.njk
title: À propos de moi
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
---

<div class="illustrated-text">
<img src="url:~/resources/me.jpg?as=webp" width="960" height="960" alt="Une photo de moi" class="illustration">

Salut ! Je m'appelle Gautier Ben Aïm, je suis développeur logiciel et j'ai 21 ans.
Je suis un cursus de Sciences du numérique à l'ENSEEIHT, une école d'ingénieur française,
et je compte me spécialiser en architecture logicielle et en cyber sécurité.

J'ai découvert la programmation il y a plus de dix ans, et je n'ai jamais arrêté depuis.
J'ai appris le développement web front et back en parallèle des mes études,
et en école d'ingénieur j'apprends la théorie de la programmation.

J'ai eu l'opportunité de travailler sur de nombreux projets de tailles différentes – de quelques personnes
rencontrées physiquement à de petites contributions sur des projets internationaux avec des centaines
d'autres contributeurs. Mes amis disent que je suis spontané, ambitieux et sérieux. J'apprécie travailler en
équipe, découvrir de nouvelles technologies et garder un œil sur les tendances en programmation.

Si vous souhaitez en savoir plus sur mes études et mes compétences, [vous pouvez consulter mon CV.]({{'/about/resume/'|localizeurl}})

</div>

## Compétences

Voici les technologies avec lesquelles je travaille.

<ul class="tag-list">
  {%- for skill in skills -%}
    <li class="tag">
      <span class="span">{{ skill }}</span></li>
  {%- endfor -%}
</ul>

## Rapport de stage, PPP…

Consultez mon rapport de stage de l'été 2020 ainsi que d'autres documents sur mon porte-document en ligne.

**→ [Mon porte-document en ligne de SHS](https://drive.google.com/drive/folders/14SpPdu_O9YwVsRh2v4MxDKo7od1oXLzf)**

<a href="{{ '/' | localizeurl }}">{{ 'Back to home page' | translate }}</a>
