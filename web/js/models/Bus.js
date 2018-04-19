import EventEmitter from 'promise-events'

export default class Bus {
    constructor() {
        this.events = new EventEmitter()
    }

    on() {
        return this.events.on.apply(this.events, arguments)
    }

    off(eventName, listener) {
        this.events.removeListener(eventName, listener)
    }

    emit() {
        return this.events.emit.apply(this.events, arguments)
    }
}
