import { getState } from './store'

const routerFactory = () => {
	let _routes = []
	let _routerElement

	//setters
	const _setRouterElement = () => {
		_routerElement = document.querySelector('router-view')
	}

	//getters
	const _getInitialRoute = () => {
		const initialPos = 0
		return _routes[initialPos]
	}

	const _getLastRoute = () => {
		const lastPos = _routes.length - 1
		return _routes[lastPos]
	}

	const _getHashByExp = (route) => {
		return `/${route.hashExp.toString().replace(/\W/g, '')}`
	}

	const _getRouteByHash = (hashParam) => {
		let _route = []
		
		_routes.forEach( route => {
			if (_isValidHash(route.hashExp, hashParam) > 0) {
				_route = route
			}
		})

		return _route
	}

	//validators 
const _isValidHash = (exp, hash) => {
	const result = exp.exec(hash)
	return Array.isArray(result) && result.length
}

	//executers
	const _goToHash = (hash) => {
		window.location.hash = hash
	}

	const _goToInitial = (e) => {
		const route = _getInitialRoute()
		const hash = _getHashByExp(route)
		_goToHash(hash)
	}

	const _hasChildrenComponent = (component) => {
		return component.children && Array.isArray(component.children)
	}

	const _getChildrenComponents = (children) => {
		return children.map(child => {
			return child()
		})
	}
	
	const _renderChild = (context, components) => {
		components.forEach( component => {
			component.init(getState(), context)
			if (_hasChildrenComponent(component)) {
				const children = component.children
				const contexts = Array.from(document.querySelectorAll(component.name))
				_renderChildrenComponent(children, contexts)
			}
		})
	}

	const _renderChildrenComponent = (children, contexts) => {
		const childrenComponents = _getChildrenComponents(children)
		contexts.forEach( context => {
			_renderChild(context, childrenComponents)
		})
	}

	const _renderComponent = (route) => {
		const component = route.component()
		const context = {
			selectorComponent: component.name, 
			routerElement: _routerElement
		}
		component.init(getState(), context)
		if (_hasChildrenComponent(component)) {
			const children = component.children
			const contexts = Array.from(document.querySelectorAll(component.name))
			_renderChildrenComponent(children, contexts)
		}
	}

	const _renderOnHashChange = () => {
		window.onhashchange = (e) => { 
			
			const hash = e.target.location.hash
			const route = _getRouteByHash(hash)
			const lastRoute = _getLastRoute()
			
			if (route && route.hashExp && _isValidHash(route.hashExp, hash) > 0) {
				_renderComponent(_getRouteByHash(hash))
				_goToHash(hash)
				return
			} 

			_renderComponent(lastRoute)
			_goToHash(hash)
			
		}
	}

	const use = (value) => {
		_routes = [..._routes, ...value]
	}

		const init = () => {
		window.addEventListener('DOMContentLoaded', (e) => {
			_setRouterElement()
			_goToInitial(e)
			_renderOnHashChange()
			_renderComponent(_getRouteByHash(e.target.location.hash))
		})
	}

	return {
		use, init
	}
}

export { routerFactory }