import { appFactory } from './src/app'
import { setScope, createComponent, logComponent, html, css } from './src/component'
import { routerFactory } from './src/router'
import { getState, watch, mapActions, logState } from './src/store'



//app module
export { appFactory }

//component modules
export { setScope }
export { createComponent }
export { logComponent }
export { html }
export { css }

//store modules
export { getState }
export { watch }
export { mapActions }
export { logState }

//router module
export { routerFactory }