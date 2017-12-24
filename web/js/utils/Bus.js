import { EventEmitter } from 'events'

export default class Bus extends EventEmitter {
    off(eventName, listener) {
        this.removeListener(eventName, listener)
    }
}
    