import { domFactory } from './dom.factory.js'
import { stateManagerFactory } from './stateManager.factory.js'
import { utilsFactory } from './utils.factory.js'
import { hooksFactory } from './hooks.factory.js'

const componentFactory = (factory, element) => {
    const _DOM = domFactory()(element)
    const _utils = utilsFactory(factory)
    const selector = factory.name
    const dataProps = JSON.parse(JSON.stringify(element.dataset || {} )) 

    const { 
        state,
        props,
        template,
        events,
        methods,
        hooks,
        children,
        expose,
        styles
    } = factory()


    const stateManager = stateManagerFactory()
    const propsManager = stateManagerFactory()
    let exposed = {}

    const dataView = { 
        props: Object.assign(props ? props : {}, dataProps), 
        state 
    }

    stateManager.onChange(dataView, (data) => {
        _render(data)
    })
    propsManager.onChange(dataView, (data) => {
        _updateExposed(data)
        _render(data)
    })

    const _exists = (data) => {
        const keys = Object.keys(data)
        return keys.length
    }

    const _updateExposed = ({ props, state }) => {

        exposed.props = {}
        exposed.state = {}

        if(_exists(props)) Object.assign(exposed.props, props)
        if(_exists(state)) Object.assign(exposed.state, state)

    }

    const _getExposedData = () => {
        if(!expose || typeof expose !== 'function') {
            return exposed = {}
        }

        const methods = _getMethods()
        return exposed = expose({ methods })
    }

    const _getChildren = () => {
        if(!children || typeof children !== 'function') return {}
        
        const factories = children()
        const factoriesKey = Object.keys(factories)
        
        const components = factoriesKey.flatMap( key => {
            const selector = `[data-component="${key}"]`
            const elements = _DOM.queryAll(selector)
            
            const schemas = elements.map( childElement => {
                const factory = factories[key]
                return { factory, childElement }
            })

            return schemas.map(({factory, childElement}) => {
                return componentFactory(factory.bind(null, {exposed}), childElement)
            })           
        })

        return components

    }
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
        const emptyFunction = () => {}

        const emptyHooks = {
            beforeOnInit: emptyFunction,
            afterOnInit: emptyFunction,
            beforeOnRender: emptyFunction,
            afterOnRender: emptyFunction,
        }

        if(!hooks || typeof hooks !== 'function') return emptyHooks

        const methods = _getMethods()
        return Object.assign(emptyHooks, hooks({ methods }))

    }

    const _bindEvents = () => {
        if(!events || typeof events !== 'function') return

        const methods = _getMethods()
        const handlers = events({ methods, ..._DOM})
        const keys = Object.keys(handlers)

        keys.forEach( key => handlers[key]())
    }

    const _initChildrenComponents = () => {
        const components = _getChildren()
        if(!Array.isArray(components) || !components.length) return
        components.forEach( component => {
            component.init()
        })
    }
        
    const taggedTemplate = (tags, ...values) => {
        return tags.map( (tag, index) => {
            return `${tag}${values[index] || ''}`
        }).join('')
    } 

    const _createSelector = (selector) => {
        if(!selector) return
        return selector.trim().replace(/bound/g, '').replace(/\W+/g, '')
    }

    const _createStyles = () => {
        const {styles} = factory()
        if (!styles || typeof styles !== 'function') return ''
        const selectorId = _createSelector(selector)
        const ctx = `[data-component="${selectorId}"]`
        const css = taggedTemplate
        return styles({ ctx, css })
    }    

    const _bindStyles = (selector, styles) => {
        if(!styles || !selector) return 
        const selectorId = _createSelector(selector)
        const styleExists = document.querySelector(`style#${selectorId}`) ? true : false
        if(styleExists) return

        const styleElement = document.createElement('style')
        styleElement.setAttribute('id', selectorId)
        styleElement.textContent = styles
        document.head.append(styleElement)
    }
 
    const _render = () => { 
        const hooks = _getHooks()       
        hooks.beforeOnRender()
        Object.assign(element.dataset, dataView.props)
        element.innerHTML = template({ ...dataView, html: taggedTemplate })
        _bindEvents()
        _bindStyles(selector, _createStyles())
        _initChildrenComponents()
        hooks.afterOnRender()
    }

    const init = () => {
        exposed = _getExposedData()
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