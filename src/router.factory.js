import { componentFactory } from './component.factory.js'

const routerFactory = () => {

    let _config = {}
    let _routerElement = null
    const _componentsManager = componentFactory()

    const _setRouterElement = () => {
        _routerElement = document.querySelector('router-view')
    }

    const _redirectTo = (hash) => window.location.hash = hash

    const _createTagName = (text) => {
        return text.replace(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/g, '-$&').slice(1).toLowerCase()
    }    

    const _createElement = (tagName) => document.createElement(tagName)

    const _injectElementNode = (nodeElement) => _routerElement.innerHTML = nodeElement.outerHTML

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

    const _initRouteByHash = (hash) => {
        const route = _getRouteByHash(hash)
        const tagName = _createTagName(route.component.name)
        const componentElement = _createElement(tagName)
        _injectElementNode(componentElement)
        _componentsManager.render(route.component, [_routerElement])
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