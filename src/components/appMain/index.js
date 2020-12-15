const template = ({ state, props }) => { 
    return /*html*/ `
        <div class="main-wrapper">
            <h1>${state.title}</h1>
        </div>
    `
}

const appMain = () => {


    const state = {
        title: 'App Main'
    }

    const events = ({ on, queryOnce, methods }) => ({
        onClickTitle () {
            const title = queryOnce('h1')    
            on('click', title, methods.changeTitle)        
        }
    })

    const methods = ({ setState, setProps }) => ({
        changeTitle ({ target}) {
            setState({ title: 'Outro título Props'})
        }
    })


    return {
        state,
        template,
        events,
        methods
    }
}

export default appMain