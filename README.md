## R9X

R9x é uma estrutura para criação de componentes reativos através de funções fábricas.

### Componentes

Criar um componente é muito fácil. Veja o exemplo abaixo:

```javascript

const appHello = () => {

    const state = {
        title:'Hello World!'
    }

    const template = ({props, state}) => {
        return /*html*/`<h1 class="title">${state.title}</h1>`
    }


    const styles = () => {
        return /*css*/`
            app-hello .title {
                color: blue;
                text-align:center;
            }
        `
    }

    return {
        state,
        template,
        styles
    }
}

export { appHello }

```

Dentro da ***função fábrica*** acima declaramos o `state` o `template` e os `estilos css` do componente appHello. Em seguida os retornamos dentro de um objeto literal.

```javascript
    return {
        state,
        template,
        styles
    }

```

Embora declarados dentro do escopo da função fábrica, o template, os estilos e o próprio state do componente, poderiam rer importados de outros arquivos. Veja abaixo:


```javascript

import helloTemplate from 'another/place'
import helloStyles from 'anhother/place'
import helloState from 'another/place'

const appHello = () => {

    const state = helloState
    const template = helloTemplate
    const styles = helloStyles

    return {
        state,
        template,
        styles
    }
}

export { appHello }
```

Ainda poderia ficar mais simples:



```javascript

import template from 'another/place'
import styles from 'anhother/place'
import state from 'another/place'

const appHello = () => {

    return {
        state,
        template,
        styles
    }
}

export { appHello }
```

### Comoponentes interativos

É possível criar interatividade nos componentes através de eventos e metodos simples. Veja abaixo:


```javascript

import template from 'another/place'
import styles from 'anhother/place'
import state from 'another/place'

const appHello = () => {

    const events = ({on, query, methods}) => ({

        onClickTitle: () => {
            const titleElement = query('.title')
            on('click', [titleElement], ({target}) => methods.logger(target))
        }

    })

    const methods = ({props, state}) => ({

        logger: (...params) => console.log( ...params )

    })

    return {
        state,
        template,
        styles,
        events,
        methods
    }
}

export { appHello }
```

Os recursos introduzidos acima garantem que ao clicar no título, o elemento alvo do clique seja logado no console.


### hooks

Ainda é possível definir comportamentos automáticos através dos hooks. 

Atualmente existes 4 hooks observáveis:
* beforeOnInit - executado apenas uma vez antes do componente ser inicializado
* afterOnInit - executado apenas uma vez depois do componente ser inicializado
* beforeOnRender - executado antes da renderização sempre que o componente renderiza o template
* afterOnRender - executado após a renderização sempre que o componente é renderizado.

Veja o exemplo abaixo:


```javascript

import template from 'another/place'
import styles from 'anhother/place'
import state from 'another/place'

const appHello = () => {


    const hooks = ({methods}) => ({

        beforeOnInit () {
            methods.logger('antes de appHello ser inicializado')
        },
        afterOnInit () {
            methods.logger('depois de appHello ser inicializado')
        },
        beforeOnRender () {
            methods.logger('antes de appHello ser renderizado')
        },
        afterOnRender () {
            methods.logger('depois de appHello ser renderizado')
        },

    })

    return {
        state,
        template,
        styles,
        hooks
    }
}

export { appHello }
```

O recurso incluído acima exibiria no console as mensagens dispostas em beforeOnInit e afterOnInit apenas uma vez, enquanto exibiria multiplas vezes as mensagens em beforeOnRender e
afterOnRender.

### Directives

As diretivas em r9x são apenas funções simples que manipulam os fragmentos do DOM presentes no componente com base no estado e nos eventos do próprio componente.

Veja o exemplo abaixo:

```javascript

import template from 'another/place'
import styles from 'anhother/place'
import state from 'another/place'

const appHello = () => {

    const events = ({on, query, directives}) => ({

        onClickTitle: () => {
            const input = query('#name')
            on('keyup', [input], ({target}) => directives.changeColor(target))
        }

    })

    const directives = ({query}) => ({

        changeColor: (target) => {
            
            if(!target || !target.value) return

            target.value.length <= 3 ? 
                target.style.color = 'red' : 
                target.style.color = 'blue'
        }

    })

    return {
        state,
        template,
        styles,
        events,
        directives
    }
}

export { appHello }
```

No exemplo acima, sempre que o evento onkeyup ocorrer, a diretiva changeColor será executada alterando o aspecto visual do input com base na quantidade de caracteres encontrada na propriedade value do mesmo.

### Reactive State

Fazer os componentes criados com R9X reajam a mudanças no estado também é algo bem simples e atualmente existem 2 estratégias:

1 . Scoped State - Nessa estratégia o componente possui um estado local que só reflete os efeitos colaterais de alteração dos dados para o próprio componente.

2 . Stored State - Nessa estratégia os efeitos colaterais são desencadeados em todos os componentes inscritos na store de dados.

#### Scoped State


```javascript

const appHello = () => {

    const state = {
        title: 'Hello World!'
    }

    const events = ({on, query, methods}) => ({

        onClickTitle: () => {
            const titleElement = query('.title')
            on('click', [titleElement], methods.changeTitle)
        }

    })

    const methods = ({props, state}) => ({

        changeTitle: () => state.set({title: 'Hello crazy world!'})

    })

    return {
        state,
        events,
        methods
    }
}

export { appHello }
```

Observe que o evento de click no elemento de título do componente executará a função changeTitle que modificará o estado atribuindo o valor `Hello crazy world!` a propriedade `title` do `state`. Isso fará com que o template do componente seja renderizado exibindo o novo título.

#### Stored State


```javascript

import store from 'anoter/place/store`'

const appHello = () => {

    const state = {
        title: store.get().title
    }

    const hooks = ({methods}) => ({

        beforeOnInit () {
            store.subscribe((data) => state.set(data)
        }

    })

    const events = ({on, query, methods}) => ({

        onClickTitle: () => {
            const titleElement = query('.title')
            on('click', [titleElement], methods.changeTitle)
        }

    })

    const methods = ({props, state}) => ({

        changeTitle: () => store.update({title:'Another title crazy world!'}))

    })

    return {
        state,
        hooks
        events,
        methods
    }
}

export { appHello }
```

Note que importamos a store de dados e que a propriedade title do state foi inicializada com o valor equivalente presente na store.

```javascript

    const state = {
        title: store.get().title
    }

```

Depois adicionamos um observador à store para atualizar o state local assim que a store for modificada.


```javascript

    const hooks = ({methods}) => ({

        beforeOnInit () {
            store.subscribe((data) => state.set(data)
        }

    })

```

Por fim, o método changeTitle atualiza a store através da função update disponibilizada pela própria store para alterar seus dados e notificar os observadores sobre as modificações.

```javascript


    const methods = ({props, state}) => ({

        changeTitle: () => store.update({title:'Another title crazy world!'}))

    })

```

Dessa forma, todo e qualquer componente observando a store receberá os novos dados e uma notificação de que os dados presentes na store foram alterados e poderão decidir programaticamente sobre qual comportamento reativo adotar.


#### Reactive properties

Propriedades reativas devem ser usadas para passar informação para componentes filhos.

Essas propriedaes são obaservadas assim como o state e a cada alteração geram um efeito colateral observado pelo componente que culminará em uma nova renderização do template do mesmo.

As propriedades reativas também estão acessíveis ao template e aos metodos do componente.

`appName.component.js`


```javascript

const appName = () => {

    const state = {}

    const template = ({props, state}) => /*html*/`
        <p>${props.name}</p>
    `

    return {
        state,
        template,
    }
}

export { appHello }

```

`appHello.component.js`


```javascript

import appName from 'anhother/place/appName.component'

const appHello = () => {

    const state = {
        title:'Hello World!',
        name: 'Alfred',
    }

    const children = () => ({
        appName
    })

    const template = ({props, state}) => /*html*/`
        <h1 class="title">${state.title}</h1>
        <app-name data-props="{'name':`${state.name}`}"></app-name>
        `

    return {
        state,
        template,
        children,
    }
}

export { appHello }

```

Observe que o componente appName está recebendo a propriedade name através das propriedades reativas. 

Olhando para o template do componente appHello é posśivel observar que a propriedade name do state local, foi fornecida ao componente appName através do chave props diponível no dataset. 

Tudo isso só é possível porque o componente appName foi importado e injetado através da função children no escopo do componente appHello.