---
layout: about.njk
title: Sobre mí
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
<img src="url:~/resources/me.jpg?as=webp" width="960" height="960" alt="Une foto mía" class="illustration">

Hola, me llamo Gautier Ben Aïm, soy desarrollador de software y tengo 21 años.
Estoy estudiando Ciencias Digitales al ENSEEIHT, una escuela de ingeniería francesa,
y tengo previsto especializarme en arquitectura de software y ciberseguridad.

Descubrí la programación hace más de diez años, y desde entonces no he dejado de hacerlo.
Aprendí desarrollo web front y back end en paralelo a mis estudios,
y en la escuela de ingeniería aprendo la teoría de la programación.

He tenido la oportunidad de trabajar en muchos proyectos de diferente envergadura, desde algunos que he conocido físicamente hasta pequeños
se reunió físicamente para realizar pequeñas contribuciones en proyectos internacionales con cientos de otros colaboradores.
Mis amigos dicen que soy espontánea, ambiciosa y seria. Me gusta trabajar en equipo,
descubrir nuevas tecnologías y estar atento a las tendencias de programación.

Si quieres saber más sobre mi formación y habilidades, [puede consultar mi CV (en inglés)](<{{'/about/resume/'|localizeurl('en')}}>), o ver mi video currículum:

</div>

<p><iframe width="608" height="342" src="https://www.youtube-nocookie.com/embed/RFF_OPBY5FU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>

## Habilidades

Estas son las tecnologías con las que trabajo.

<ul class="tag-list">
  {%- for skill in skills -%}
    <li class="tag">
      <span class="span">{{ skill }}</span></li>
  {%- endfor -%}
</ul>

## Ecocopas

Colecciono ecocopas, y como es bastante profesional, me veo obligado a poner este vídeo en el portafolio que uso para solicitar trabajos.

<p><iframe width="608" height="342" src="https://www.youtube-nocookie.com/embed/qjBeB8eT6Z0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>

<a href="{{ '/' | localizeurl('en') }}">Volver a la página de inicio (en inglés)</a>
