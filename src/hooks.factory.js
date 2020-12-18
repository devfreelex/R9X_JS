import { utilsFactory } from './utils.factory.js'

const hooksFactory = (hooks, methods) => {
    const _utils = utilsFactory()
    
    const emptyHooks = {
        beforeOnInit () {},
        afterOnInit () {},
        beforeOnRender () {},
        afterOnRender () {},
    }
 
    if(!_utils.isFunction(hooks)) return emptyHooks

    const hooksMethods = hooks({ methods })
    const hooksLength = Object.keys(hooksMethods).length
    if(!hooksLength) return emptyHooks

    return Object.assign(emptyHooks, hooksMethods)

}

export { hooksFactory }