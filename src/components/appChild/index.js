const template = ({ state, props }) => /*html*/ `
    <div class="child-wrapper" style="display:block;float:left;width:100%;background:#ebebeb">
        <h3>Child: </h3>
        <h3>state: ${state.title}</h3>
        <h3>props: ${props.title}</h3>
    </div>
`

const styles = () => {}


const appChild = ({state, props}) => { 

    return {
        state,
        props,
        template,
        styles
    }
}

export default appChild