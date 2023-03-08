// Creates and animates a sprite. Call its update method from the scene's update and call its destroy method when you're done with it.

export default class Coins {
    constructor(scene, x, y, nCoins) {
        this.scene = scene;

        // create coin spin animation
        scene.anims.create({
            key: 'coinspin',
            frames: scene.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
            frameRate: 10,   // display 10 frames per second
            repeat: -1       // loop animation
        });
        
        // create static physics group (allows multiple coins)
        this.sprite = scene.physics.add.staticGroup({    
        key: 'coin',                               
        repeat: nCoins-1,    // creates repeat+1 children
        setXY: { x: x,   
                 y: y, 
                 stepX: 30   // scatters children along X with this step size
               }                        
        });
        
        var rewardCoins = this.sprite; 
        rewardCoins.children.iterate(function (child) {
            child.setScale(1.5);      // increase in size a bit
            child.play('coinspin');
        });

    }

    update() { }
    
    destroy() {    
        var allCoins = this.sprite.getChildren();
        allCoins.destroy();
    }

}