import { componentFactory } from './component.js'

const appFactory = ({ appMain, routes = [] }) => {
    
    if(!appMain || typeof appMain !== 'function') {
        throw new Error('appMain not is an function and must be.')
    }

    const init = () => {
        const elements = document.querySelectorAll(`[data-component="appMain"]`)

        elements.forEach( element => {
            const component = componentFactory(appMain, element)
            component.init()    
        })

    }

    return {
        init
    }
}

export { appFactory }