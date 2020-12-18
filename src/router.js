import { componentFactory } from './component.js'

const routerFactory = () => {

    let _config = {}
    let _routerElement = null

    const _setRouterElement = () => {
        _routerElement = document.querySelector('[data-component="routerView"]')
    }

    const _redirectTo = (hash) => window.location.hash = hash

    const _createTagName = (text) => {
        return text.replace(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/g, '-$&').slice(1).toLowerCase()
    }    

    const _createElement = (name) => { 
        const element = document.createElement('div')
        element.dataset.component = name
        return element
    }

    const _injectElementNode = (nodeElement) => {
        _routerElement.innerHTML = nodeElement.outerHTML
    }

    const _initFirstRoute = () => {
        const hash = _config['firstRoute'].hash
        _redirectTo(hash)
        _initRouteByHash(hash)
    }

    const _getRouteByHash = (hash) => {
        const {defaultRoute, otherRoutes: routes} = _config
        const selectedRoute = routes.find( route => {
            if(route.hashExp.test(hash)) return route
        })
        return selectedRoute ? selectedRoute : defaultRoute
    }

    const _renderComponents = (factory) => {
        const selector = `[data-component="${factory.name}"]`
        const element = _createElement(factory.name)
        _injectElementNode(element)

        const componentElement = _routerElement.querySelector(selector)
        const component = componentFactory(factory, componentElement)
        component.init()
    }

    const _initRouteByHash = (hash) => {
        const { component: factory } = _getRouteByHash(hash)
        _renderComponents(factory)

    }

    const _listenOnHashChange = () => {
        window.onhashchange = () => {
            const hash = window.location.hash
            _initRouteByHash(hash)
        }
    }

    const _hasRoutes = () => { 
        if(!_config) return false
        return Object.keys(_config).length ? true : false
    }

    const _getHash = () => window.location.hash

    const setRoutes = (routeSettings) => _config = routeSettings

    const init = () => {
        if(!_hasRoutes()) return
        const hashChanged = _getHash()
        _setRouterElement()
        hashChanged ? _initRouteByHash(hashChanged) : _initFirstRoute()
        _listenOnHashChange()
    }

    return {
        init,
        setRoutes
    }
}

export { routerFactory }