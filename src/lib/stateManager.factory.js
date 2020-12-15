const stateManagerFactory = ({ state = {} }) => {

    const setState = (payload, callback) => {
        const deepPayload = JSON.parse(JSON.stringify(payload))
        Object.assign(state, deepPayload)
        callback()
    }

    return { setState, state }
}



const propsManagerFactory = ({ props = {} }, element = {}) => {

    const emptyProps = { dataset: {}}

    !element || !element.dataset ? 
        Object.assign(props, emptyProps) :
        Object.assign(props, element.dataset) 


    const setProps = (payload, callback) => {
        const deepPayload = JSON.parse(JSON.stringify(payload))
        Object.assign(props, deepPayload)
        callback()
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