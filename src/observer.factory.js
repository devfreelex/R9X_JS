const observerFactory = (data) => {

    let _listeners = []
    const _dataJSON = JSON.stringify(data)
    const _state = JSON.parse(_dataJSON)
    

    const on = (handler) => {
        _listeners.push(handler)
        return handler
    }

    const off = (handler) => {
        _listeners = _listeners.filter( listener => {
            return listener !== handler
        })
    }

    const update = (payload) => {
        const  payloadCopy = JSON.parse(JSON.stringify(payload))
        const newState = Object.assign(_state, payloadCopy)
        const newStateCopy = JSON.parse(JSON.stringify(newState))
        notify(newStateCopy)

    }

    const notify = (state) => { 
        _listeners.forEach( handler => {
            handler({...state})
        })
    }

    const get = (storeKey) => {
        if(storeKey) return JSON.parse(JSON.stringify(_state[storeKey]))
        return JSON.parse(JSON.stringify(_state))
    }


    return { on, off, update, get }


}

export default observerFactory 