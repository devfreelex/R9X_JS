import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'mdn-polyfills/Array.prototype.forEach';

import { getState } from './store'
import { eventDrive } from './eventDrive'

let _components = []
let _component = {}
let _scope = null
let elm = null

const setScope = (schema) => {
    _scope = schema
}

const _arrayToObject = (list) => {
    const methods = {}

    list.forEach(method => {
        methods[method.name] = method
    })

    return methods
}

const _bindTemplate = () => {
    _component.template()
}

const createComponent = () => {
    const scope = _scope()
    const component = {}

    scope.forEach((scopeKey) => {
        if (scopeKey.name !== 'methods' && scopeKey.name !== 'template') {
            component[scopeKey.name] = scopeKey()
        }

        if (scopeKey.name === 'methods') {
            component[scopeKey.name] = _arrayToObject(scopeKey())
        }

        if (scopeKey.name === 'template') {
            component[scopeKey.name] = scopeKey
        }




    })

    component.init = (state, context) => {
        _listenHooks(component.name)
        _bindTemplate()
        render(component.name, state, context)
        _emitEvent(component.name, 'beforeOnRender')
    }

    _component = Object.assign({}, component)
    _components.push(Object.assign({}, component))

    return Object.assign({}, component)

}

const _getComponentByName = (componentName) => {
    return _components.find((component) => {
        if (component.name === componentName) return component
    })
}

const _getElements = (selector) => {
    return Array.from(document.querySelectorAll(selector))
}

const _renderChildrenComponent = (component) => {
    const elements = _getElements(component.name)
    const state = getState()

    elements.forEach((element) => {
        const template = component.template()
        const attrs = _transformAttrs(element.attributes)
        const html = template.HTML(state, attrs)

        if (typeof html === 'function') {
            element.innerHTML = html(state, attrs)
        }
    })

    _bindStyles(component)
    _initListeners(component)
    if (component.children && component.children.length) {
        component.children.forEach(childComponent => _renderChildrenComponent(childComponent()))
    }
}

const _toCamelCase = (str) => {
    const arrStr = str.split('-')
    let name = null

    arrStr.forEach((strPart, index) => {
        if (index > 0) {
            name = `${arrStr[0]}${strPart.charAt(0).toUpperCase()}${strPart.slice(1,)}`
        }
    })
    return name
}

const _transformAttrs = (attrs) => {
    const tempAttrs = Array.from(attrs)
    let attributes = {}
    tempAttrs.forEach(attr => {
        const attrName = _toCamelCase(attr.name)
        attributes[attrName] = attr.value
    })
    return attributes
}

const render = (componentName, state, context) => {

    const component = _getComponentByName(componentName)
    const elements = _getElements(component.name)

    if (!context || !context.selectorComponent) {
        elements.forEach((element) => {
            const template = component.template()
            const attrs = _transformAttrs(element.attributes)
            const html = template.HTML(state, attrs)

            if (typeof html === 'function') {
                element.innerHTML = html(state, attrs)
            }
        })

        _bindStyles(component)
        _initListeners(component)
        _renderChildrenComponent(component)
        return
    }


    if ('selectorComponent' in context && 'routerElement' in context) {

        const element = document.createElement(context.selectorComponent)
        const template = component.template()
        const html = template.HTML(state)

        if (typeof html === 'function') {
            element.innerHTML = html()
        }

        context.routerElement.innerHTML = ''
        context.routerElement.insertAdjacentElement('beforeend', element)

        _bindStyles(component)
        _initListeners(component)
        return
    }

}

const _emitEvent = (componentName, eventName) => {
    eventDrive.fire(componentName, eventName)
}

const _getHandlers = (hook) => {
    return hook()
}

const _execHandlers = (hookName, handlers) => {
    if (!handlers || !handlers.length) return
    elm = Array.from(document.querySelectorAll(_component.name))
    handlers.forEach((handler) => {
        const handle = handler.bind(null, { elm, query, on })
        eventDrive.on(_component.name, hookName, handle)
    })
}

const _initHook = (hookName, hooks, methods) => {
    const hook = hooks.find((hook) => {
        if (hook.name === hookName) return hook
    })
    const handlers = _getHandlers(hook)
    _execHandlers(hook.name, handlers)
}

const _listenHooks = (componentName) => {
    const component = _components.find((component) => {
        if (component.name === componentName) return component
    })
    const { hooks, methods } = component
    hooks.forEach((hook) => {
        _initHook(hook.name, hooks, methods)
    })
}

const on = (eventName, context, callback) => {
    context.forEach((target) => {
        target[`on${eventName}`] = callback
    })
}

const query = (selector, context) => {
    return context.flatMap((parent) => {
        return Array.from(parent.querySelectorAll(selector))
    })
}

const _initListeners = (component) => {
    elm = Array.from(document.querySelectorAll(component.name))
    component.listeners.forEach((listener) => {
        listener({ elm, on, query }, component.methods)
    })

    _emitEvent(component.name, 'afterOnRender')
}

const logComponent = () => console.log(_component)

const setStyle = (style) => {
    if (!style) return
    _component['style'] = style.trim()
        .replace(/.+{/g, `${_component.name} $&`)
        // .replace(/\s{2,}/g, '')
        // .replace(/\s*\}/g, '} ')
        // .replace(/\n/g, '')
}

const _isEmptyStyle = () => {
    return !!_component.style === false
}

const _styleExists = (styleId) => {
    const styleElement = document.querySelector(`style#${styleId}`)
    return !!styleElement === true
}

const _bindStyles = (component) => {
    if (_styleExists(component.name)) return
    const styleElement = document.createElement('style')
    const css = component.template().CSS().trim().replace(/.+{/g, `${component.name} $&`)
    styleElement.setAttribute('id', component.name)
    styleElement.textContent = css
    document.body.insertAdjacentElement('beforeend', styleElement)
}
const renderer = (componentName, template) => {
    const component = _components.find((component) => {
        if (component.name === componentName) return component
    })

    const elements = Array.from(document.querySelectorAll(component.name))
    component.elements = elements
    component.template = template
}

const html = (tags, ...values) => {
    return tags.map((tag, index) => {
        return `${tag}${values[index] || ''}`
    }).join('')
}

export {
    setScope,
    createComponent,
    logComponent,
    renderer,
    render,
    setStyle,
    html,
    html as css
}