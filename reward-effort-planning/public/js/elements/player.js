// Creates, animates and moves a sprite [in response to arrow keys]. Call its update method from the scene's update and call its destroy method when you're done with the player.

// import our custom events centre for passsing info between scenes
import eventsCenter from '../eventsCenter.js'

const endbridgeX = 980;

export default class Player {
    constructor(scene, x, y) {
    this.scene = scene;
    
    // Create animations for the player (from sprite sheet frames)
    const anims=scene.anims;
    // walk/run:
    anims.create({
        key: 'run',
        frames: anims.generateFrameNumbers('player', { start: 2, end: 5 }),
        frameRate: 10,    // display 10 frames per second
        repeat: -1        // loop animation
    });
    // waiting:
    anims.create({
        key: 'wait',
        frames: anims.generateFrameNumbers('player', { start: 0, end: 1 }),
        frameRate: 2, 
        repeat: -1      
    });
    // power up!:
    anims.create({
        key: 'powerup',
        frames: anims.generateFrameNumbers('player', { start: 6, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    // happy float (power up success):
    anims.create({
        key: 'float',
        frames: anims.generateFrameNumbers('player', { start: 14, end: 15 }),
        frameRate: 5,
        repeat: -1
    });
    // stumble/fall (power up failure):
    anims.create({
        key: 'powerupfail',
        frames: anims.generateFrameNumbers('player', { start: 8, end: 13 }),
        frameRate: 5,
        repeat: 0        // don't loop this one
    });
//    // sad float:
//    anims.create({
//        key: 'sadfloat',
//        frames: anims.generateFrameNumbers('player', { start: 16, end: 17 }),
//        frameRate: 10,   
//        repeat: -1       
//    });
//    // neutral float:
//    anims.create({
//        key: 'neutfloat',
//        frames: anims.generateFrameNumbers('player', { start: 18, end: 19 }),
//        frameRate: 10,   
//        repeat: -1       
//    });
    // sad walk/run:
    anims.create({
        key: 'sadrun',
        frames: anims.generateFrameNumbers('player', { start: 20, end: 23 }),
        frameRate: 10,    // display 10 frames per second
        repeat: -1        // loop animation
    });    
        
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, 'player', 0)      // will generate sprite at desired location (x,y)
      .setCollideWorldBounds(true)    // prevent running off edges of the world
      .setFriction(0)                 // don't slow down too much after impact with surfaces
      .setBounce(0.2);                // add a bit of dynamism (bounce values range [0,1])
      
//    // Ability to move player around using keyboard not required for this task but 
//    // leaving dead code here for future ref/functionality changes (also can be use to 
//    // use for debugging scene physics): 
//        
//    // Track the arrow keys
//    var { LEFT, RIGHT, UP} = Phaser.Input.Keyboard.KeyCodes;
//    this.keys = scene.input.keyboard.addKeys({
//      left: LEFT,
//      right: RIGHT,
//      up: UP
//    });    
    }
        
    update() { 
//        const sprite = this.sprite;
//        const velocity = 250;
//        const cursors = this.keys;
        
//          // and float where appropriate
//          eventsCenter.on('floatme', function(){
//              while(sprite.x < endbridgeX) {
//                sprite.setVelocityY(-500); 
//              }
//          }, this.scene);
//        
//        // update sprite according keyboard input:
//        // for running left/right:
//        if (cursors.left.isDown) {
//            sprite.setVelocityX(-velocity);  // negative horizontal velocity -> move L
//            sprite.anims.play('run', true);
//            sprite.flipX=true;               // mirror flip right running frames
//            }
//        else if (cursors.right.isDown) {
//            sprite.setVelocityX(velocity);   // positive horizontal velocity -> move R
//            sprite.anims.play('run', true);
//            sprite.flipX=false; 
//            }
//        else {
//            sprite.setVelocityX(0);          // 0 horizontal velocity -> still
//            sprite.anims.play('wait');
//            }
//        // for jumping:
//        if (cursors.up.isDown && sprite.body.onFloor()) {
//            sprite.anims.play('jump', true);
//            sprite.setVelocityY(-300);       // negative vertical velocity -> move up 
//            }
    }
    
    destroy() {
        this.sprite.destroy();
    }

}