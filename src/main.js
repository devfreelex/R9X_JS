import { componentFactory } from './lib/component.js'

import { appFactory } from './lib/app.factory.js'

import appMain from './components/appMain/index.js'

const app = appFactory({
    appMain
})

app.init()