const domFactory = () => {

    const _debounce = (handler, delay) => {
        let debounceTimer

        return (e) => {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => handler(e), delay)
        }
    }       

    const on = (eventName, eventTarget, handler, useDebounce = false, debounceTime = 0) => {

        if(!Array.isArray(eventTarget)) {

            if(useDebounce) {
                eventTarget[`on${eventName}`] =  _debounce(handler, debounceTime)
                return
            }

            eventTarget[`on${eventName}`] =  handler
            return
        }

        eventTarget.forEach( element => {
            if(useDebounce) {
                element[`on${eventName}`] =  _debounce(handler, debounceTime)
                return
            }            
            
            element[`on${eventName}`] =  handler
        })
    }    

    const _queryOnce = (selector, context) => {
        if(!context) document.querySelector(selector) 
        return context.querySelector(selector)
    }

    const _queryAll = (selector, context) => {
        if(!context) return Array.from(document.querySelectorAll(selector))
        return Array.from(context.querySelectorAll(selector))
    }   
    

    const bindEvents = (componentElement, events, methods) => {
        const params = { 
            on, 
            queryOnce: (selector) => _queryOnce(selector, componentElement), 
            queryAll: (selector) => _queryAll(selector, componentElement), 
            methods 
        }
        const handlers = events(params)
        for (let key in handlers) {
            handlers[key]()
        }
    }

    return {
        bindEvents
    }
}

export { domFactory }