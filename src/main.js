import { componentFactory } from './lib/component.js'

import { appFactory } from './lib/app.factory.js'

import appMain from './components/appMain/index.js'
import appHome from './components/appHome/index.js'
import appOther from './components/appOther/index.js'
import appNotFound from './components/appNotFound/index.js'

const routes = {
    firstRoute: { hash: '#/', component: appHome },
    defaultRoute: { hash: '#/404', component: appNotFound },
    otherRoutes: [
        { hashExp: /^#\/$/, component: appHome },
        { hashExp: /^#\/other$/, component: appOther },
    ]
} 

const app = appFactory({
    appMain,
    routes
})

app.init()