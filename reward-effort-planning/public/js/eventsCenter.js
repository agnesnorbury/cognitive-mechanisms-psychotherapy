// create our own events emitter for passing information about events between scenes (without conflicting with this.game.events which is not recommended for this purpose)

const eventsCenter = new Phaser.Events.EventEmitter()

export default eventsCenter