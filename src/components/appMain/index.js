const template = ({ state, props }) => { 
    return /*html*/ `
        <div class="main-wrapper">
            <p>props: ${props.title}</p>
            <p>state: ${state.title}</p>

            <h1>Change value</h1>
        </div>
    `
}

const appMain = () => {

    let counter = 0

    const state = {
        title: counter,
    }

    const props = {
        title: counter
    }

    const hooks = ({ methods }) => ({
        beforeOnInit () {
            methods.setPropsAndState()
        }
    })

    const events = ({ on, queryOnce, methods }) => ({
        onClickTitle () {
            const title = queryOnce('h1')    
            on('click', title, methods.changeTitle)        
        }
    })

    const methods = ({ setProps, setState, getState, getProps }) => ({
        changeTitle () {
            counter = counter + 1
            setState({title: counter})
            setProps({title: counter})
        },
        setPropsAndState () {
            counter = counter + 1
            setState({title: counter})
            setProps({title: counter})
        },
    })


    return {
        state,
        props,
        template,
        events,
        methods,
        hooks
    }
}

export default appMain