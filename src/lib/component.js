import { domFactory } from './dom.factory.js'
import { stateManagerFactory, propsManagerFactory } from './stateManager.factory.js'
import { utilsFactory } from './utils.factory.js'
import { hooksFactory } from './hooks.factory.js'

import { render } from './render.factory.js'

const componentFactory = (factory, element) => {
    const _DOM = domFactory()
    const _utils = utilsFactory(factory)
    const selector = factory.name
        
    const { 
        template,
        events,
    } = factory()

    const stateManager = stateManagerFactory(factory())
    const { state, setState } = stateManager

    const propsManager = propsManagerFactory(factory(), element)
    
    const { props, setProps } = propsManager

    const renderParams = { 
        element, template, setState, setProps, props, state, 
        propsManager, events, methods: _utils.getMethods(factory),
        hooksFactory: factory().hooks, stateManager
    }

    const methods = factory().methods({ 
        setState: (payload) => setState(payload, render, renderParams), 
        setProps: (payload) => setProps(payload, render, renderParams) 
    })

    const hooks = hooksFactory(factory.hooks, methods)   
 

    const init = () => {
        hooks.beforeOnInit()
        render({ ...renderParams, methods, events, hooks })
        hooks.afterOnInit()
    }

    return {
        state,
        props,
        selector,
        element,
        template,
        methods,
        hooks,
        init
    }

}

export { componentFactory }