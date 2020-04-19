const pubsubFactory = function () {
	let events = {}


	const hasEvent = (eventName) => {
		return Object.keys(events).some(eventKey => eventName === eventKey)
	}

	const hasAction = (eventName, callback) => {
		if (!Array.isArray(events[eventName])) return false
		return events[eventName].some(action => callback === action)
	}

	const on = (eventName, action) => {
		if (!hasEvent(eventName)) {
			events[eventName] = [action]
			return action
		}

		if (hasEvent(eventName) && !hasAction(action)) {
			events[eventName].push(action)
			return action
		}

		return action
	}

	const off = (action) => {
		const eventKeys = Object.keys(events)

		eventKeys.forEach(eventKey => {
			events[eventKey] = events[eventKey].filter(listener => {
				if (action !== listener) return listener
			})
		})

	}

	const emit = (eventName, payload) => {

		const actions = events[eventName].map(action => {
			return action
		})

		actions.forEach(action => {
			action(payload)
		})

	}

	return { on, off, emit }
}

export { pubsubFactory }