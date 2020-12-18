import appChild from '../appChild/index.js'

const template = ({ state, props }) => { 
    return /*html*/ `
        <div class="main-wrapper">
            <p>props: ${props.title}</p>
            <p>state: ${state.title}</p>
            <h1>Change value</h1>
            <hr>
                <div data-component="appChild"></div>
                <div data-component="appChild"></div>
                <div data-component="appChild"></div>
                <div data-component="appChild"></div>
                <div data-component="appChild"></div>
            <hr>
        </div>
    `
}

const appMain = () => {

    let counter = 0

    const state = {
        title: 0,
    }

    const props = {
        title: 0
    }

    const expose = ({ methods }) => ({
        props,
        state,
        updatePropsTitle: methods.update,
    })

    const children = () => ({
        appChild
    })

    const events = ({ on, queryOnce, methods }) => ({
        onClickTitle () {
            const title = queryOnce('h1')    
            on('click', title, methods.setState)        
        }
    })

    const methods = ({ setProps, setState, getState, getProps }) => ({
        update () {
            counter = counter + 1
            setProps({ title: counter})
        },


    })


    return {
        state,
        props,
        template,
        events,
        methods,
        children,
        expose
    }
}

export default appMain