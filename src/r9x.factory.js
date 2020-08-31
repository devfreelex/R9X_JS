import { componentFactory } from './component.factory.js'
import { routerFactory } from './router.factory.js'

const r9x = () => {

    let _main = null
    let _routes = null

    const componentsManager = componentFactory()
    const routesManager = routerFactory()

    const use = (config) => {
        const { main, routes } = config
        _main = main
        _routes = routes
    }

    const init = () => {
        componentsManager.render(_main, [document.body])
        routesManager.setRoutes(_routes)
        routesManager.init()
    }


    return {
        use,
        init
    }
}

export { r9x }