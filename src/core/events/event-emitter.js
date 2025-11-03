const EventEmitter = require('events');
const logger = require('@utils/logger');

class AppEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20);
  }

  emitEvent(eventName, data) {
    logger.info(`Event emitted: ${eventName}`);
    this.emit(eventName, data);
  }

  onEvent(eventName, handler) {
    this.on(eventName, handler);
    logger.info(`Event listener registered: ${eventName}`);
  }
}

module.exports = new AppEventEmitter();
