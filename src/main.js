import { componentFactory } from './lib/component.js'

import appMain from './components/appMain/index.js'

const element = document.querySelector(`[data-component="appMain"]`)
const appComponent = componentFactory(appMain, element)
appComponent.init()
