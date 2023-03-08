// End scene to thank participants for their time

// import js game element modules (sprites, ui, outcome animations)
import InstructionsPanel from "../elements/instructionsPanel.js";

// import our custom events centre for passsing info between scenes and data saving function
import eventsCenter from "../eventsCenter.js";

// import relevant data saving function
import { saveTaskEndData } from "../saveData.js";
import { runQuests } from "../selfReports.js";

// This function extends Phaser.Scene and includes the core logic for the scene
export default class TheEnd extends Phaser.Scene {
    constructor() {
        super({
            key: 'TheEnd'
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

        // save task data backup
        saveTaskEndData(this.registry.getAll()); 

        var titleText = 'Thank you!'
        ///////////////////PAGE ONE////////////////////
        var mainTxt = ("\n" +
                       "  This part of the study is now over.  \n\n" +
                       " Please press the button below to finish. \n\n");
        var buttonTxt = "finish";
        var pageNo = 1;
        this.endPanel2 = new InstructionsPanel(this, gameWidth/2, gameHeight/2,
                                                pageNo, titleText, mainTxt, buttonTxt);
        // end scene
        eventsCenter.once('page1complete', function () {
            document.getElementById('game-container').style.display = "none";
            runQuests();
        }, this);
    }
    
    update(time, delta) {
    }
    
}
