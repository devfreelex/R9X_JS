import { domFactory } from './dom.factory.js'

const render = (params) => {

    const _DOM = domFactory()    
  
    const { 
        element, 
        template, 
        events, 
        props, 
        state, 
        propsManager, 
        methods,
        hooks,
        hooksFactory
    } = params

    let hooksMethods = {}


    propsManager.updatePropsElement(element, props)
    element.innerHTML = template({ state, props })

    _DOM.bindEvents(element, events, methods)

}

export { render }