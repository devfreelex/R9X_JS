const pubSub = () => {
	const _listeners = {}

	const hasEvent = (componentName, eventName) => {
		return false
	}

	const on = (componentName, eventName, callback) => { 
		// console.log(componentName, eventName)
		if(!componentName || !eventName || !callback) return
		
		if (_listeners.hasOwnProperty(componentName)) {
			!Array.isArray(_listeners[componentName][eventName])
				? _listeners[componentName][eventName] = [callback]
				: _listeners[componentName][eventName].push(callback)

			return
		}
		
		_listeners[componentName] = {
			[eventName]: [callback]
		}
	}

	const fire = (componentName, eventName) => { componentName
		if(!_listeners[componentName]) return 
		if (!_listeners[componentName][eventName]) return

		_listeners[componentName][eventName].forEach(handler => {
			handler()
		})
	}	

	const logger = () => console.log(_listeners)
	return { on, fire, logger }
}

const eventDrive = pubSub()

export { eventDrive }