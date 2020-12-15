const template = ({ state, props }) => { 
    return /*html*/ `
        <div class="main-wrapper">
            <h1>${state.title}</h1>
        </div>
    `
}

const appMain = () => {

    let counter = 0
    const state = {
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

    const methods = (params) => ({
        changeTitle () {
            console.log(params)
            params.setState({title: 'outro'})
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
        template,
        events,
        methods,
        hooks
    }
}

export default appMain