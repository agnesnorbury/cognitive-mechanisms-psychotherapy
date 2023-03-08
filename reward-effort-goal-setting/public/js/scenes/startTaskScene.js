// Scene to inform participants they can now start the main task, routes to Main Task scene

// import task info from versionInfo file
import { approxTimeTask, nBlocks } from "../versionInfo.js";  // time participant will have to try and exert effort (ms)

// this function extends Phaser.Scene and includes the core logic for the scene
export default class StartTaskScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartTaskScene'
        });
    }

    preload() {
        // load cloud sprites to add texture to background
        this.load.image('cloud1', './assets/imgs/cloud1.png');
    }
    
    create() {
        // load a few cloud sprites dotted around
        const cloud1 = this.add.sprite(180, 100, 'cloud1');
        const cloud2 = this.add.sprite(320, 540, 'cloud1');
        const cloud3 = this.add.sprite(630,  80, 'cloud1');
        
        // add popup dialogue box with text
        var SoT = this.rexUI.add.dialog({
            background: this.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x1ea7e1),
            title: this.rexUI.add.label({
                background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x000000),
                text: this.add.text(0, 0, "Great job!", {
                    fontSize: '24px'
                    }),
                align: 'center',
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),
            content: this.rexUI.add.BBCodeText(0, 0, 
                   ("You are now ready to start the main part\n" +
                    "of the game.\n\n"+

                    "From now on, every coin you collect will count\n"+
                    "towards your bonus. However, in order to\n"+
                    "successfully collect the coins, you will have to\n"+
                    "'power-up' your umbrella by [color=#d0f4f7]pressing the\n"+
                    "POWER button as fast as possible[/color], until you reach\n"+
                    "the required power level for that route. Routes with\n"+
                    "[color=#d0f4f7]more coins[/color] will usually take [color=#d0f4f7]more power[/color] to cross.\n\n"+

                    "It is therefore [color=#d0f4f7]completely up to you[/color] to decide\n"+
                    "which routes you want to take!\n\n"+
                    
                    "The main part of the game will take [color=#d0f4f7]about "+approxTimeTask+" minutes[/color],\n"+
                    "  not including breaks. It is divided up into  \n"+
                    "[color=#d0f4f7]"+nBlocks+" 'blocks'[/color] of choices. You can choose to take\n"+
                    "  breaks for as long as you like between each block.  \n\n"+

                    "When you are ready, [b]press the\n"+
                    "button[/b] below to start!\n"),
                   {fontSize: '18px',
                    align: 'center',
                    color: '#000000'
                   }),
            actions: [
                createLabel(this, 'start game')
            ],
            space: {
                title: 25,
                content: 10,
                action: 10,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
            align: {
                actions: 'center',
            },
            expand: {
                content: false, 
            }
            });
        
        // control panel position and layout
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;
        SoT
        .setPosition(gameWidth/2, gameHeight/2)
        .layout()
        .popUp(500);
        
        // control action button functionality (click, hover)
        SoT
        .once('button.click', function (button) {
            SoT.scaleDownDestroy(500);
            this.nextScene();                           
        }, this)
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(2, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        });

        // !!while we're here...
        //this.registry.set('taskN', 0);    // initialize taskN (as a registry var so can pass between screens)
    }
    
    update(time, delta) {
    }
    
    nextScene() {
        this.scene.start('MainTask');
    } 
}

// generic function to create button labels
var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, 0x5e81a2),
        text: scene.add.text(0, 0, text, {
            fontSize: '20px',
            fill: '#000000'
        }),
        align: 'center',
        width: 40,
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
};