export default ({ state, props }) => { 
    return /*html*/ `
        <div class="main-wrapper">
            <p>props: ${props.title}</p>
            <p>state: ${state.title}</p>
            <h1>Change value</h1>
            <hr>
                <div data-component="appChild"></div>
                <div data-component="appChild"></div>
            <hr>

            <hr>
            <hr>
            <hr>
                <div data-component="routerView"></div>
            <hr>
            <hr>
            <hr>
        </div>
    `
}