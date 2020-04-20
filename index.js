import { appFactory } from './src/app'
import { setScope, createComponent, logComponent, html, css } from './src/component'
import { routerFactory } from './src/router'
import { getState, watch, mapActions, logState } from './src/store'

const r9x = {
    //app module
    appFactory,
    //component modules
    setScope,
    createComponent,
    logComponent,
    html,
    css

}

const router = { routerFactory }

const store = {
    getState,
    watch,
    mapActions,
    logState
}


export { r9x, router, store }