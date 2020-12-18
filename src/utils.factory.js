const utilsFactory = (factory) => {
    
    const isFunction = (param) => {
        return param && typeof param === 'function'
    }

    const getFunction = (key, payload) => {
        const fn = factory()[key]
        const emptyObject = {}
        if(isFunction(fn)) return fn({ ...payload })
        return emptyObject
    }

    const getMethods = (factory) => {
        const emptyFunction = () => ({})

        if(!isFunction(factory))  return
        
        if(!isFunction(factory().methods)) return emptyFunction

        return factory().methods
    }

    return {
        isFunction, 
        getFunction,
        getMethods
    }

}

export { utilsFactory }