// End scene to inform participants they have finished the task, and route them to the post-task questions

// import js game element modules (sprites, ui, outcome animations)
import InstructionsPanel from "../elements/instructionsPanel.js";

// import our custom events centre for passsing info between scenes and data saving function
import eventsCenter from "../eventsCenter.js";

// this function extends Phaser.Scene and includes the core logic for the scene
export default class TaskEndScene2 extends Phaser.Scene {
    constructor() {
        super({
            key: 'TaskEndScene2'
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
        const cloud3 = this.add.sprite(630, 80, 'cloud1');
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;

        var titleText = 'Game Over!'
        ///////////////////PAGE ONE////////////////////
        var mainTxt = ("Thank you for playing.\n\n" +
                       
                        "  We will now ask you to answer  \n"+
                        "again the short questions about\n"+
                        "how you are feeling right now,\n"+
                        "  before moving on to the final part of the study.\n\n  "+
                       
                        "Press the button below to continue.\n\n");
        var buttonTxt = "continue";
        var pageNo = 1;
        this.endPanel2 = new InstructionsPanel(this, gameWidth/2, gameHeight/2,
                                                pageNo, titleText, mainTxt, buttonTxt);
        // end scene
        eventsCenter.once('page1complete', function () {
            this.nextScene();
        }, this);
    }
    
    update(time, delta) {
    }
    
    nextScene() {
        this.scene.start('PostTaskQuestions2');
    } 
}