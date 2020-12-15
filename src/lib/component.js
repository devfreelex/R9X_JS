import { domFactory } from './dom.factory.js'
import { stateManagerFactory, propsManagerFactory } from './stateManager.factory.js'

const componentFactory = (factory, element) => {
    const _DOM = domFactory()

    const selector = factory.name
        
    const { 
        template,
        events,
        methods
    } = factory()

    const stateManager = stateManagerFactory(factory())
    const { state } = stateManager

    const propsManager = propsManagerFactory(factory(), element)
    const { props } = propsManager

    const _isFunction = (param) => {
        return param && typeof param === 'function'
    }

    const _getFunction = (key, payload) => {
        const fn = factory()[key]
        const emptyObject = {}
        if(_isFunction(fn)) return fn({ ...payload })
        return emptyObject
    }


    const render = () => {
        const methods = _getFunction('methods', { 
            setState: (payload) => stateManager.setState(payload, render),
            setProps: (payload) => propsManager.setProps(payload, render),
        })
        Object.assign(element.dataset, props)
        element.innerHTML = template({ state, props })
        _DOM.bindEvents(element, events, methods)
    }


    return {
        state,
        props,
        selector,
        element,
        template,
        methods,
        render
    }

}

export { componentFactory }