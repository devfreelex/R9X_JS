import { domFactory } from './dom.factory.js'

const stateManagerFactory = () => {
    let data = {
        state: {},
        props: {},
    }

    const listeners = []

    const onChange = (dataView, handler) => {
        data = dataView
        listeners.push( handler )
    }

    const update = (payload, type) => {
        listeners.forEach( handler => {
            const newData = {
                [type]: payload
            }

            const dataView = Object.assign(data, newData)
            handler(dataView)
        })
    }


    return { onChange, update, data }
}






export { 
    stateManagerFactory
}