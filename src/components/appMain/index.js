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
        // beforeOnRender () {
        //     methods.loggerBefore()
        // },
        // afterOnRender () {
        //     methods.loggerAfter()
        // }
    })

    const events = ({ on, queryOnce, methods }) => ({
        onClickTitle () {
            const title = queryOnce('h1')    
            on('click', title, methods.changeTitle)        
        }
    })

    const methods = ({ setProps, setState }) => ({
        changeTitle () {
            counter = counter + 1
            setProps({title: counter})
            setState({title: counter})
        },
        loggerBefore () {
            console.log('beforeRender')
        },
        loggerAfter () {
            console.log('after on render')
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