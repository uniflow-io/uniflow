import EventEmitter from 'promise-events';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'getMaxListeners' does not exist on type ... Remove this comment to see the full error message
EventEmitter.prototype.getMaxListeners = function () {
  return this._maxListeners;
};

export default class Bus {
  constructor() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type 'Bus'.
    this.events = new EventEmitter();
  }

  on() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type 'Bus'.
    return this.events.on.apply(this.events, arguments);
  }

  off(eventName, listener) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type 'Bus'.
    return this.events.removeListener.call(this.events, eventName, listener);
  }

  emit() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'events' does not exist on type 'Bus'.
    return this.events.emit.apply(this.events, arguments);
  }
}
