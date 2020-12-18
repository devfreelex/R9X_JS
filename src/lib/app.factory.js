import { componentFactory } from './component.js'
import { routerFactory } from './router.js'

const appFactory = ({ appMain, routes = [] }) => {

    const _router = routerFactory()
    
    if(!appMain || typeof appMain !== 'function') {
        throw new Error('appMain not is an function and must be.')
    }

    const _initRouter = () => {
            _router.setRoutes(routes)
            _router.init()       
    }

    const init = () => {
        const elements = document.querySelectorAll(`[data-component="appMain"]`)

        elements.forEach( element => {
            const component = componentFactory(appMain, element)
            component.init(_initRouter)    
        })

    }

    return {
        init
    }
}

export { appFactory }