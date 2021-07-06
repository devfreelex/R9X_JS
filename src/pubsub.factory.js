const pubsubFactory = () => {

  const _listeners = {}

  const _HandlerExistsError = 'The handler you are trying to register has already been registered for the same event and cannot be registered again.';
  const _eventExistsError = 'The event you are trying to register already exists and cannot be registered again.';
  const _eventNotExistsError = 'The event you are trying to execute has not yet been declared and needs to be.';

  const _getListener = (eventName, handler) => ({
    eventName,
    handler: _listeners[eventName].find(listener => listener === handler)
  })

  const on = (eventName, handler) => {

    if (!_listeners.hasOwnProperty(eventName)) {
      _listeners[eventName] = [handler]
      return _getListener(eventName, handler)
    }

    if (_listeners.hasOwnProperty(eventName) && !_listeners[eventName].includes(handler)) {
      _listeners[eventName].push(handler)
      return _getListener(eventName, handler)
    }


    if (_listeners.hasOwnProperty(eventName) && _listeners[eventName].includes(handler)) {
      throw new Error(
        `
        ${_eventExistsError}

        or

        ${_HandlerExistsError}
        `
      )
    }

  }

  const emit = (eventName, data) => {

    if (!_listeners[eventName]) {
      throw new Error(_eventNotExistsError)
    }
    
    _listeners[eventName].forEach(handler => {
      handler(data)
    })

  }

  const off = (eventName, handler) => {
    const listeners = _listeners[eventName].map(listener => listener !== handler)
    _listeners[eventName] = [...listeners]
  }

  return { on, emit, off }
}

export { pubsubFactory }