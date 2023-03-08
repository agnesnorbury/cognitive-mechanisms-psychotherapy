// Scene to hold multi-page instructions text

// import js game element modules (sprites, ui, outcome animations)
import InstructionsPanel from "../elements/instructionsPanel.js";

// import our custom events centre for passsing info between scenes and data saving function
import eventsCenter from "../eventsCenter.js";
import { saveStartData } from "../saveData.js";

// initialize global start time var
var startTime;

// this function extends Phaser.Scene and includes the core logic for the scene
export default class InstructionsScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'InstructionsScene',
            autoStart: true
        });
    }

    preload() {
        // load cloud sprites to add texture to background
        this.load.image('cloud1', './assets/imgs/cloud1.png');
        // load button and coin sprites
        this.load.image('button', './assets/imgs/button.png');
        this.load.spritesheet('coin', './assets/spritesheets/coin.png', { 
            frameWidth: 15.8, 
            frameHeight: 16 
        });
    }
    
    create() {
        // load a few cloud sprites dotted around
        const cloud1 = this.add.sprite(180, 100, 'cloud1');
        const cloud2 = this.add.sprite(320, 540, 'cloud1');
        const cloud3 = this.add.sprite(630, 80, 'cloud1');
        
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;
        
        var titleText = 'Welcome to the game!'

        startTime = Math.round(this.time.now);
        
        // let's do this the long-winded way for now...[should make this a function]
        ///////////////////PAGE ONE////////////////////
        var mainTxt = ("  You are travelling through a strange land,  \n"+
                        "covered in rivers and streams.\n\n" +

                        "At regular points along your journey,\n"+
                        "you will have to use your [b]magic umbrella[/b]\n"+
                        "to help you fly across the water!\n\n"+

                        " At each crossing point, you will have to [color=#d0f4f7]make \n"+
                        "a choice[/color] between [color=#d0f4f7]different routes[/color]\n"+
                        "across the water.\n");
        var buttonTxt = "next page";
        var pageNo = 1;
        this.instructionsPanel = new InstructionsPanel(this, 
                                                       gameWidth/2, gameHeight/2,
                                                       pageNo, titleText, mainTxt, buttonTxt);
        
        ///////////////////PAGE TWO////////////////////
        eventsCenter.once('page1complete', function () {
            mainTxt = ("Different routes give you the chance to collect\n"+
                       "different numbers of [img=coin] [color=#FFD700]coins[/color] [img=coin], which\n" +
                       "will be converted into a real bonus payment\n"+
                       "at the end of the game!\n\n" +  

                       "However, different routes also require different\n"+
                       "levels of [img=button] [color=#e45404]POWER[/color] [img=button] in order to cross.\n\n"+
                       
                       "For each route, you will have to 'power-up'\n"+
                       " your umbrella by [color=#e45404]clicking or pressing[/color] \n"+
                       " the POWER button [color=#e45404]as fast as you can[/color], \n"+
                       " until you reached the required level (indicated \n"+
                       " by a full power bar). \n"
                       );
            pageNo = 2;
            this.instructionsPanel = new InstructionsPanel(this, 
                                                           gameWidth/2, gameHeight/2,
                                                           pageNo, titleText, mainTxt, buttonTxt);
            }, this);
        
        ///////////////////PAGE THREE////////////////////
        eventsCenter.once('page2complete', function () {
            mainTxt = ("  It is [b]completely up to you to decide[/b], at each  \n"+
                       "crossing, [b]which route you want to take[/b].\n\n" +  

                       "  Your bonus amount will depend  \n" +
                       "on how many coins you collect - but you will [color=#d0f4f7]need\n"+
                       "to reach the required level of power[/color] each time in\n"+
                       "order to collect them!\n\n" +
                       
                       "Before you start the real game, you will\n" +
                       "  have a chance to practice powering up your umbrella.  \n\n" + 

                       " When you are ready,\n" +
                       "press [b]start practice[/b] to begin.\n");
            buttonTxt = "start practice"
            pageNo = 3;
            this.instructionsPanel = new InstructionsPanel(this, 
                                                           gameWidth/2, gameHeight/2,
                                                           pageNo, titleText, mainTxt, buttonTxt);
            }, this);
        
        // end scene
        eventsCenter.once('page3complete', function () {
            this.nextScene();
            }, this);

    }
        
    update(time, delta) {
    }
    
    nextScene() {
        saveStartData(startTime);           // [for firebase]
        this.scene.start('PracticeTask');
    } 
}
