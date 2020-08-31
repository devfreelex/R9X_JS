# R9X_JS

Uma maneira fácil de criar SPA's reativas com padrões javascript.

```js
import { appFactory } from './core/app'
import { store } from './store/store'

import { appMain } from './components/appMain/main.component'
import { appHeader } from './components/appHeader/appHeader.component'
import { appNotFound } from './components/appNotFound/appNotFound.component'
import { appSearch } from './components/appSearch/appSearch.component'

// component pages
import { appHome } from './components/appHome/appHome.component'
import { appDetailProduct } from './components/appDetailProduct/appDetailProduct.component'
import { appCart } from './components/appCart/appCart.component'
import { appDelivery } from './components/appDelivery/appDelivery.component'

const routes = [
    { title: 'Home', hashExp: /(#\/home)$/, component: appHome },
    { title: 'Produto', hashExp: /(#\/produto\/\w+)$/, component: appDetailProduct },
    { title: 'entrega', hashExp: /(#\/entrega)$/, component: appDelivery },
    { title: 'Cart', hashExp: /(#\/cesta)$/, component: appCart },
    { title: 'Not Found', hashExp: /^[#\/404]$/, component: appNotFound }
]

const app = appFactory()


app
    .use('components', {
        appMain,
        appHeader,
        appSearch
    })
    .use('routes', routes)
    .use('store', store)
    .init()
```
