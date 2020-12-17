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
        template,
        events,
        state,
        props,
        methods
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
            setProps: (payload) => propsManager.update(payload, 'props')
        })
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
        Object.assign(element.dataset, dataView.props)
        element.innerHTML = template(dataView)
        _bindEvents()
    }

    const init = () => {

        _render()

    }

    return {
        init
    }

}

export { componentFactory }