import template from './template.js'
import styles from './styles.js'

const appChild = ({ exposed }) => { 

    const state = exposed.state
    const props = exposed.props

    const hooks = ({ methods }) => ({

    })


    const events = ({ on, queryOnce, methods }) => ({
        onClick () {
            const elm = queryOnce('.child-wrapper')
            on('click', elm, () => {
                methods.update()
            })
        }
    })

    const methods = ({ setState, setProps, getState, getProps }) => ({

        update () {

            exposed.updatePropTitle({ 
                props: getProps()
             })
        }
    })

    return {
        state,
        props,
        template,
        styles,
        events,
        methods,
        hooks
    }
}

export default appChild