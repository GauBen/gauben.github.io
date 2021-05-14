---
title: async et await
date: 2021-05-12
styles:
  - ~/assets/styles/highlight.styl
---

[toc]

## Les bases

Commençons par définir une fonction des plus simples : une somme entre deux entiers.

```js
const sum = (a, b) => {
  return a + b
}

console.log(sum(1, 2))
// 3
```

Rien de spécial lorqu'on l'appelle ; la somme de 1 et 2 est 3.

Et si, sans rien changer d'autre, on rajoute le mot-clé `async` à notre fonction ?

```js
const sum = async (a, b) => {
  return a + b
}

console.log(sum(1, 2))
// Promise { <state>: "fulfilled", <value>: 3 }
```

Cette fois-ci, la fonction ne renvoie pas 3 directement, mais un object bizarre nommé `Promise` qui semble contenir la valeur 3. **Une promesse est un objet qui enveloppe un résultat qui sera renvoyé dans le futur.** Lorsque vous recevez un objet `Promise`, le résultat peut déjà être disponible (c'est le cas pour notre fonction `sum`), ou bientôt disponible (on y vient).

### Comment accéder à un résultat enveloppé par une promesse ?

Le moyen le plus simple est de définir une fonction de rappel (_callback_) à appeler quand le résultat est disponible. On donne la fonction de rappel à la méthode `then` :

```js
sum(1, 2).then((result) => {
  console.log(result)
})
// 3
```

Ainsi, notre `console.log` est appelé dès que le résultat est disponible, de façon _asynchrone_ (on n'attend pas explicitement le résultat).

### Renvoyer explicitement une promesse

Le mot-clé `async` est en fait du [sucre syntaxique](https://fr.wikipedia.org/wiki/Sucre_syntaxique). Comme on renvoie un objet `Promise`, on peut aussi le créer explicitement. Le constructeur prend en paramètre une fonction appelée de façon synchrone, dont le paramètre `resolve` correspond au `return` usuel.

```js
const sum = (a, b) =>
  new Promise((resolve) => {
    resolve(a + b)
  })
```

La fonction `resolve` se comporte quasiment comme un `return` : seul le premier appel est pris en compte, tous les autres sont ignorés.

## `await`

Le principal intérêt des fonctions asynchrones est d'éviter l'enfer des fonctions de rappel imbriquées (aussi appelé [_callback hell_](http://callbackhell.com/)). **Le mot-clé `await` permet de ne pas utiliser `then`.**

Essayons de faire `(1+2)+3` avec `then` :

```js
sum(1, 2).then((x) => {
  sum(x, 3).then((y) => {
    console.log(y)
  })
})
```

On obtient une horrible imbrication, dont la profondeur dépend directement du nombre de couches.[^escroc] (Il y aura un exemple plus parlant un peu plus loin, tiré de ce qu'on faisait avec jQuery il y a moult temps...)

On peut remplacer la fonction de rappel par une attente explicite du résultat :

```js
const main = async () => {
  let x = await sum(1, 2)
  let y = await sum(x, 3)
  console.log(y)
}

main()
```

N'est-ce pas merveilleux ? **Le mot-clé `await` permet d'extraire la valeur d'une promesse**, que cette valeur soit disponible ou non, quitte à suspendre temporairement l'exécution en attendant la valeur.

_Remarque : on ne peut pas encore utiliser `await` ailleurs que dans une fonction asynchrone, [mais ça devrait arriver](https://caniuse.com/mdn-javascript_operators_await_top_level)[^module]._

## Bon ok, mais ensuite ?

Pour l'instant on n'a vu que des trucs qu'on peut faire de façon synchrone.

Cependant, **il existe de nombreuses choses qui ne peuvent pas être faites de façon synchrone** :

- Attendre un délai[^boucle]
- Répondre à un évènement utilisateur
- Faire une requête au serveur[^xmlhttprequest]
- ...

Ces trois exemples sont toujours codés avec une fonction de rappel. Voilà l'exemple dont je parlais il y a quelques lignes :

```js
window.addEventListener('load', () => {
  // Ici
  const $input = document.querySelector('input[type=search]')

  $input.addEventListener('input', () => {
    // Ici
    const search = $input.value

    fetch('./search?q=' + encodeURIComponent(search))
      .then((response) => response.json())
      .then((data) => {
        // Et là
        updateSuggestions(data)
      })
  })
})
```

On a une imbrication de trois fonctions de rappel (_ici, ici, et là_). C'est pas très élégant, et si on veut rajouter une couche, on perd encore plus en lisibilité.

Le problème, c'est que `addEventListener` ne renvoie pas une promesse, on ne peut pas utiliser `await` dessus. À moins que...

```js
const listen = (element, eventName) =>
  new Promise((resolve) => {
    element.addEventListener(
      eventName,
      () => {
        resolve()
      },
      { once: true }
    )
  })
```

**Oula, qu'est-ce que c'est que ce truc ?**

Cette fonction transforme un unique évènement (`{ once: true }`) en promesse, résolue lorsque l'évènement est déclenché.

Ça sera plus clair avec un exemple :

```js
const main = async () => {
  // On remplace window.addEventListener('load')
  await listen(window, 'load')

  const $input = document.querySelector('input[type=search]')

  while (true) {
    // On remplace $input.addEventListener('input')
    await listen($input, 'input')
    const search = $input.value

    // On remplace fetch().then()
    const response = await fetch('./search?q=' + encodeURIComponent(search))
    const data = await response.json()
    updateSuggestions(data)
  }
}

main()
```

N'est-ce pas plus facile à lire ? En effet, ça se discute. **Mais maintenant que nous avons mis nos couches à plat, il est beaucoup plus facile de rajouter des étapes.**

Notons par ailleurs que le comportement n'est pas identique : on ne peut plus avoir une requête envoyée alors que le résultat de la précédente n'est pas connu.

Autrement dit :

- Avant : on envoie une requête à chaque modification du champ `$input`.
- Après : on n'envoie une requête que si la requête précédente est terminée et qu'il y a eu une modification du champ `$input`.

_Si vous faites du TypeScript, vous serez intéressés par la même fonction avec des annotations de type.[^listen.ts]_

## Transformer `setTimeout` en fonction `await`-able

**Comment transformer n'importe quelle fonction qui prend une fonction de rappel en fonction asynchrone ?**

Prenons l'exemple de `setTimeout` :

```js
const saveToast = () => {
  displayMessage('Préférénces enregistrées')

  setTimeout(() => {
    hideMessage()
  }, 5000)
}
```

Ici `hideMessage` est appelé grâce à une fonction de rappel.

On aimerait plutôt écrire ceci :

```js
const saveToast = async () => {
  displayMessage('Préférénces enregistrées')
  await wait(5000)
  hideMessage()
}
```

C'est possible en utilisant les promesses explicites. **En effet, on peut appeler `resolve` dans la fonction de rappel de `setTimeout`.**

...

...[^spoiler]

...

```js
const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
```

Et hop, on peut attendre de façon explicite ! (Et sans bloquer le thread...)

## Un automate à état

Toutes ces explications ne sont en fait qu'un prétexte pour arriver au point culminant de cet article : **on peut créer un automate à état en JavaScript grâce à `async` et `await`**.

Commençons par créer les types `state` et `transition`. C'est la seule fois qu'on utilisera du TypeScript, tout le reste sera écrit en JavaScript pur.

```ts
type state = Promise<transition>
type transition = () => state
```

De cette façon, un état est une promesse vers une transition, et une transition est une fonction vers un état.

Créons trois états, au sens d'un état de l'application :

```js
const gold = () => {
  $div.style.backgroundColor = 'gold'
  $button.innerHTML = 'Magic ✨'
}
const red = () => {
  $div.style.backgroundColor = 'firebrick'
  $button.innerHTML = 'Magic 🚒'
}
const blue = () => {
  $div.style.backgroundColor = 'navy'
  $button.innerHTML = 'Magic 🚓'
}
```

Notre objectif est de créer l'automate suivant, où les transitions sont empruntées lors d'un clic sur le bouton :

![Automate à trois états]({{ dir }}/state-machine.png)

Créons les transitions vers ces états :

```js
const initialTransition = async () => {
  // On met l'application dans l'état initial
  gold()
  // On attend un clic sur le bouton
  await listen($button, 'click')
  // On renvoie une transition vers red
  return toRed
}

const toRed = async () => {
  red()
  await listen($button, 'click')
  return toBlue // ... vers blue
}

const toBlue = async () => {
  blue()
  await listen($button, 'click')
  return toRed // ... vers red
}
```

Pour avancer dans notre automate, à partir d'un état initial `state1` :

```js
const main = async (state1) => {
  const transition1 = await state1
  const state2 = transition1()
  const transition2 = await state2
  const state3 = transition2()
  const transition3 = await state3
  // ...
}
main(state1)
```

On constate que l'on peut remplacer cette chaîne par une boucle et on obtient :

```ts
const main = async (initialState) => {
  let state = initialState
  while (true) {
    const transition = await state
    state = transition()
  }
}

main(initialTransition())
```

Et si vous voulez tester, il vous reste à cliquer juste là :

{% include './example1.njk' %}

Pour pouvoir faire de vrais automates, **il manque la possibilité d'avoir plusieurs transitions**, empruntées lors d'évènements différents...

## Encore plus loin

Commençons par la fin, voici ce que l'on cherche à construire :

{% include './example2.njk' %}

Cet exemple obéit à l'automate suivant :

![Automate à quatre états]({{ dir }}/state-machine2.png)

La partie la plus intéressante est l'état en haut à droite, nommé `longEnough`. On atteint cet état lorsque le mot de passe saisi fait plus de 8 caractères, et on peut le quitter de trois façons différentes :

- Le mot de passe saisi est trop court : on revient dans l'état initial
- Le mot de passe saisi est assez long : on reste là où on est
- On clique sur envoyer : on prend la transition `sendNewPassword`

Le code derrière cet état est le suivant :

```js
const toLongEnough = async () => {
  // On masque le message
  $notice.hidden = true

  // On attend en concurrence deux évènements :
  return Promise.race([
    (async () => {
      // - Une modification du champ $password
      await listen($password, 'input')
      // Selon la longueur on a deux états possibles
      if ($password.value.length < 8) return toTooShort
      return toLongEnough
    })(),
    (async () => {
      // - Un clic sur le bouton $submit
      await listen($submit, 'click')
      // On envoie le nouveau mot de passe
      return sendNewPassword
    })(),
  ])
}
```

[Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) renvoie une promesse enveloppant la valeur de la promesse qui s'est terminée en premier. Si la seconde promesse est résolue postérieurement, elle est ignorée.

**Et voilà comment on peut faire des applications spécifiées par un automate !** C'est rigolo à écrire en plus.

Si vous êtes curieux de voir une application qui utilise un automate de ce type, je suis actuellement en train de travailler sur [musixy, un générateur de playlist](https://github.com/GauBen/musixy). Comme beaucoup d'interactions sont possibles en même temps, **structurer cette application sous la forme d'un automate permet d'assurer qu'elle soit toujours dans un état cohérent**.

[^escroc]:
    C'est un peu malhonnête de ma part de ne pas l'écrire avec le chaînage des promesses, mais c'est pour illustrer le problème dans le cas des fonctions de rappel non chaînables :

    ```js
    window.addEventListener('load', () => {
      const $button = document.querySelector('#button')
      $button.addEventListener('click', () => {
        console.log('Hello World!')
      })
    })
    ```

    Les promesses sont mieux faites dans le sens où on peut les chaîner :

    ```js
    sum(1, 2)
      /* Si la fonction de rappel renvoie une promesse... */
      .then((x) => sum(x, 3))
      /* ... alors on peut chaîner les `then` */
      .then((y) => {
        console.log(y)
      })
    ```

    On retrouve le chaînage dans l'exemple avec `fetch`.

[^listen.ts]: La même fonction, mais typée correctement :

    ```ts
    export const listen = async <K extends keyof HTMLElementEventMap>(
      element: HTMLElement,
      eventName: K
    ) =>
      new Promise<HTMLElementEventMap[K]>((resolve) => {
        element.addEventListener(
          eventName,
          (event) => {
            resolve(event)
          },
          { once: true }
        )
      })
    ```

    Notez par ailleurs que, même si la fonction renvoie explicitement un objet `Promise`, elle est déclarée asynchrone. Ceci n'est pas une erreur, mais une recommandation donnée par `@typescript-eslint/promise-function-async`.

[^spoiler]: Je laisse un petit temps pour ne pas _spoiler_ la solution.
[^xmlhttprequest]: On peut avec `XMLHttpRequest`, mais c'est pas aussi agréable à utiliser que `fetch`.
[^boucle]: On peut faire une boucle infinie pour attendre une date donnée, mais ce n'est ni élégant, ni performant.
[^module]: Alors on pourra écrire :

    ```html
    <script type="module">
      const sum = async (a, b) => {
        return a + b
      }
      let x = await sum(1, 2)
      let y = await sum(x, 3)
      console.log(y)
    </script>
    ```
