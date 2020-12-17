import { domFactory } from './dom.factory.js'
import { stateManagerFactory } from './stateManager.factory.js'
import { utilsFactory } from './utils.factory.js'
import { hooksFactory } from './hooks.factory.js'

const componentFactory = (factory, element) => {
    const _domHandlerFactory = domFactory()
    const _utils = utilsFactory(factory)
    const selector = factory.name
    const dataProps = JSON.parse(JSON.stringify(element.dataset))  

    const { 
        state,
        props,
        template,
        events,
        methods,
        hooks,
    } = factory()

    const stateManager = stateManagerFactory()
    const propsManager = stateManagerFactory()


    const dataView = { 
        props: Object.assign(props, dataProps), 
        state 
    }

    stateManager.onChange(dataView, (data) => _render(data))
    propsManager.onChange(dataView, (data) => _render(data))

    const _getMethods = () => {

        if(!methods || typeof methods !== 'function') return {}
        
        return methods({
            setState: (payload) => stateManager.update(payload, 'state'),
            setProps: (payload) => propsManager.update(payload, 'props'),
            getProps: () => dataView.props,
            getState: () => dataView.state,
        })
    }

    const _getHooks = () => {
        if(!hooks || typeof hooks !== 'function') return {}

        const emptyFunction = () => {}

        const emptyHooks = {
            beforeOnInit: emptyFunction,
            afterOnInit: emptyFunction,
            beforeOnRender: emptyFunction,
            afterOnRender: emptyFunction,
        }

        const methods = _getMethods()
        return Object.assign(emptyHooks, hooks({ methods }))

    }

    const _bindEvents = () => {
        if(!events || typeof events !== 'function') return

        const methods = _getMethods()
        const domHandlers = _domHandlerFactory(element)
        const handlers = events({ methods, ...domHandlers})
        const keys = Object.keys(handlers)

        keys.forEach( key => handlers[key]())
    }
 
    const _render = () => { 
        const hooks = _getHooks()       
        hooks.beforeOnRender()
        Object.assign(element.dataset, dataView.props)
        element.innerHTML = template(dataView)
        _bindEvents()
        hooks.afterOnRender()
    }

    const init = () => {
        const hooks = _getHooks()
        hooks.beforeOnInit()
        _render()
        hooks.afterOnInit()

    }

    return {
        init
    }

}

export { componentFactory }