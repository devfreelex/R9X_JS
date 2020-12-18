const stateFactory = () => {
    const _state = {}
    const _listeners = []

    const _cloneState = (payload) => {
        if(!payload) return
        return JSON.parse(JSON.stringify(payload))
    }

    const _notify = (newState) => {
        const data = _cloneState(newState)
        _listeners.forEach(listener => {
            listener(data)
        })
    }    

    const watch = (listener) => {
        _listeners.push(listener)
    }

    const merge = (payload) => {
        return Object.assign(_state, _cloneState(payload))
    }

    const set = (payload) => {
        const newState = merge(payload)
        _notify(newState)
    }

    const get = () => {
        return _cloneState(_state)
    }

    const logger = () => console.log(_state)


    return {
        watch,
        merge,
        set,
        get,
        logger
    }
}

export { stateFactory }