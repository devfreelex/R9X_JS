const template = ({ state, props }) => /*html*/ `
    <div class="child-wrapper" style="display:block;float:left;width:100%;background:#ebebeb">
        <h3>Child: </h3>
        <h3>state: ${state.title}</h3>
        <h3>props: ${props.title}</h3>
    </div>
`

const styles = () => {}


const appChild = ({ exposed }) => { 

    const state = exposed.state
    const props = exposed.props

    const hooks = ({ methods }) => ({
        beforeOnInit () {
        //    methods.updateState()
        }
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

            exposed.updatePropsTitle({ 
                props: getProps(),
                state: getState()
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