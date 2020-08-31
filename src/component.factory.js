import { domFactory } from './dom.factory.js'
import { stateFactory } from './stateFactory.js'

const componentFactory = () => {

    const _createTagName = (text) => {
        return text.replace(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/g, '-$&').slice(1).toLowerCase()
    }

    const _createState = (schema) => {
        const stateManager = stateFactory()
        stateManager.merge(schema.state)
        const { set, get, watch, logger } = stateManager
        return { set, get, watch, logger }
    }

    const _getProps = (element) => { 
        if(!element.dataset || !element.dataset.props) return {}
        return JSON.parse(element.dataset.props.replace(/\'/g, '"'))
    }

    const _createProps = (schema, element) => {
        const stateManager = stateFactory()
        const props = _getProps(element)
        stateManager.merge(props)
        const { set, get, watch } = stateManager
        return { set, get, watch }
    }

    const _createEvents = (schema, methods, directives, target) => {
        if(!schema || !schema.events || typeof schema.events !== 'function') return {}
        const _domManger = domFactory()
        _domManger.setContext(target)

        return schema.events({
            on: _domManger.on,
            query: _domManger.query,
            queryAll: _domManger.queryAll,
            methods,
            directives
        })
    }

    const _createChildren = (schema) => {
        if(schema && schema.children && typeof schema.children === 'function') return schema.children()
        return {}
    }

    const _createHooks = (schema, state, props, methods) => {
        if(!schema || !schema.hooks || typeof schema.hooks !== 'function') return null
        return schema.hooks({
            state,
            props,
            methods,
        })
    }

    const _createMethods = (schema, state, props, elm) => {
        if(!schema || !schema.methods || typeof schema.methods !== 'function') return {}
        return schema.methods({ state, props, elm })
    }

    const _createDirectives = (schema, state, props, elm) => {
        if(!schema || !schema.directives || typeof schema.directives !== 'function') return {}
        const _domManger = domFactory()
        _domManger.setContext(elm)
        return schema.directives({ 
            state, 
            props, 
            elm,
            query: _domManger.query,
            queryAll: _domManger.queryAll,
            on: _domManger.on,
        
        })
    }

    const _createStyles = (styles) => {
        if(!styles || typeof styles !== 'function') return ''
        return styles()
    }


    const _hasChildren = (component) => {
        if(!component.hasOwnProperty('children')) return false
        if(!Object.keys(component.children).length) return false
        return true
    }

    const _execHooks = (hookName, hookList) => { 
        if(!hookList || !hookName) return
        if(!hookList.hasOwnProperty(hookName)) return
        if(typeof hookList[hookName] !== 'function') return
        hookList[hookName]()
    }

    const render = (factory, contexts, newState) => { 
        const tagName = _createTagName(factory.name)
        
        contexts.forEach( context => {
            const elements = context.querySelectorAll(tagName)
            elements.forEach( element => {
                const component = create(factory, element, element)
                _execHooks('beforeOnInit', component.hooks)
                component.render()
                _execHooks('afterOnInit', component.hooks)
            })
        })
    }

    const _renderChildren = (component) => {
        if (!component || !component.children) return
        const childrenKeys = Object.keys(component.children)
        childrenKeys.forEach(childKey => {
            render(component.children[childKey], [component.element])
        })
    }    

    const _updateView = (config) => {

        const { tagName, element, template, events, props, state, hooks, styles } = config
        const dataProps = props.get ? props.get() : props
        const dataModel = state.get ? state.get() : state
        const _domManger = domFactory()

        element.dataset.props = JSON.stringify(dataProps).replace(/\"/g, "'")

        _execHooks('beforeOnRender', hooks)

        element.innerHTML = template({
            props: dataProps,
            state: dataModel
        })

        _domManger.setContext(element)
        _domManger.bindEventListeners(events)
        _domManger.bindStyles(tagName, _createStyles(styles))

        _execHooks('afterOnRender', hooks)

        if (_hasChildren(config)) _renderChildren(config)
    }    

    const create = (factory, target, parent) => { 
        const schema = factory()
        const appName = factory.name
        const tagName = _createTagName(factory.name)
        const element = target
        const parentComponentElement = parent
        const state = _createState(schema)
        const props = _createProps(schema, element)
        const methods = _createMethods(schema, state, props, element)
        const directives = _createDirectives(schema, state, props, element)
        const events = _createEvents(schema, methods, directives, element)
        const hooks = _createHooks(schema, state, props, methods)
        const children = _createChildren(schema)
        const render = () => _updateView(component)

        const component = { ...schema, appName, state, props, tagName, element, children, methods, events, hooks, parentComponentElement, render }
 
        component.element.setAttribute('uId', Math.random().toString().slice(2))

        state.watch((newState) => {
            Object.assign(component.state, newState)
            _updateView(component)
        })

        props.watch((newState) => {
            Object.assign(component.props, newState)
            _updateView(component)
        })

        return component
    }

    return {
        create,
        render,
    }
}


export { componentFactory }