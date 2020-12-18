export default ({ state, props, html }) => html`
    <div class="child-wrapper">
        <h3>Child: </h3>
        <h3>state: ${state.title}</h3>
        <h3>props: ${props.title}</h3>
    </div>
`