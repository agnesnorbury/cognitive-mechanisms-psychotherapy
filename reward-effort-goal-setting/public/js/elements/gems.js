// Creates and animates a sprite. Call its update method from the scene's update and call its destroy method when you're done with it.

export default class Gems {
    constructor(scene, x, y, nGems) {
        this.scene = scene;

        // create coin spin animation
        scene.anims.create({
            key: 'gemspin',
            frames: scene.anims.generateFrameNumbers('gem', { start: 0, end: 7 }),
            frameRate: 8,   // display 10 frames per second
            repeat: -1       // loop animation
        });
        
        // create static physics group (allows multiple coins)
        this.sprite = scene.physics.add.staticGroup({    
        key: 'gem',                               
        repeat: nGems-1,    // creates repeat+1 children
        setXY: { x: x,   
                 y: y, 
                 stepX: 35   // scatters children along X with this step size
               }                        
        });
        
        var practiceGems = this.sprite; 
        practiceGems.children.iterate(function (child) {
            //child.setScale(2);      // increase in size a bit
            child.play('gemspin');
        });

    }

    update() { }
    
    destroy() {    
        var allGems = this.sprite.getChildren();
        allGems.destroy();
    }

}