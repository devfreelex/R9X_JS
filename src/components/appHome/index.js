import template from './template.js'
import styles from './styles.js'

const appHome = () => {


    let counter = 0

    const state = {
        title: 'App Home',
    }

    const props = {
        title: 0
    }

    const expose = ({ methods }) => ({
        props,
        state,
        updatePropTitle: methods.update,
    })

    const children = () => ({
        appChild
    })

    const events = ({ on, queryOnce, methods }) => ({
        onClickTitle () {
            const title = queryOnce('h1')    
            on('click', title, methods.setTitle)        
        }
    })

    const methods = ({ setProps, setState, getState, getProps }) => ({
        update () {
            const { title } = getProps()
            setProps({ title: parseInt(title + 1)})
        },
        setTitle () {
            counter = counter + 1
            const { title }  = getProps()
            setState({ title: counter })
            setProps({ title: parseInt(title + 1) })
        }
    })


    return {
        state,
        props,
        template,
        styles,
        events,
        methods,
        expose
    }
}

export default appHome