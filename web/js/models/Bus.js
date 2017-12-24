import { EventEmitter } from 'events'

let id = 1;

export default class Bus extends EventEmitter {
    constructor() {
        super()

        this.id = id
        id++
    }

    off(eventName, listener) {
        this.removeListener(eventName, listener)
    }
}
