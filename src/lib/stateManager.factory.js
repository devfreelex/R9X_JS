import { domFactory } from './dom.factory.js'

const stateManagerFactory = ({ state = {} }) => {

    const _DOM = domFactory()    

    const setState = (payload, render, params) => { console.log(params)
        const { element, events, methods } = params
        const deepPayload = JSON.parse(JSON.stringify(payload))
        Object.assign(state, deepPayload)
        render(params)
    }

    return { setState, state }
}



const propsManagerFactory = ({ props = {} }, element = {}) => {

    const emptyProps = { dataset: {}}

    !element || !element.dataset ? 
        Object.assign(props, emptyProps) :
        Object.assign(props, element.dataset) 


    const setProps = (payload, render, params) => {
        const deepPayload = JSON.parse(JSON.stringify(payload))
        Object.assign(props, deepPayload)
        render(params)
    }

    const updatePropsElement = (element, props) => {
        Object.assign(element.dataset, props)
    }

    return { setProps, props, updatePropsElement }
}



export { 
    stateManagerFactory,
    propsManagerFactory 
}