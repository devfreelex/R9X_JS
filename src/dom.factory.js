const domFactory = () => {
    let _context = null

    const _debounce = (handler, delay) => {
        let debounceTimer

        return (e) => {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => handler(e), delay)
        }
    }

    const setContext = (context) => _context = context

    const on = (eventName, elements, handler) => {
        elements.forEach( element => {
            element.addEventListener(eventName, _debounce(handler, 200))
        })
    }

    const query = (selector) => _context.querySelector(selector)

    const queryAll = (selector) => Array.from(_context.querySelectorAll(selector))

    const bindEventListeners = (handlers) => { 
        const keys = Object.keys(handlers)
        keys.forEach( key => handlers[key]())
    }

    const bindStyles = (tagName, styles) => { 
        if(!styles || !tagName) return 
        const styleExists = document.querySelector(`style#${tagName}`) ? true : false

        if(styleExists) return

        const styleElement = document.createElement('style')
        styleElement.setAttribute('id', tagName)
        styleElement.textContent = styles
        document.head.insertAdjacentElement('beforeend', styleElement)
    }

    return {
        bindEventListeners,
        bindStyles,
        setContext,
        queryAll,
        query,
        on
    }
}

export {domFactory}