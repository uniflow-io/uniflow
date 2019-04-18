import EventEmitter from 'promise-events'

EventEmitter.prototype.getMaxListeners = function () {
  return this._maxListeners
}

export default class Bus {
  constructor () {
    this.events = new EventEmitter()
  }

  on () {
    return this.events.on.apply(this.events, arguments)
  }

  off (eventName, listener) {
    return this.events.removeListener.call(this.events, eventName, listener)
  }

  emit () {
    return this.events.emit.apply(this.events, arguments)
  }
}
