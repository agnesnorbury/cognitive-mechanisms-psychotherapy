// Scene to hold post-task questions, routes participants to the Game End scene

// import js game element modules (sprites, ui, outcome animations)
import MultipleChoicePanel from "../elements/multipleChoicePanel.js";

// import our custom events centre for passing info between scenes
import eventsCenter from '../eventsCenter.js'

// import relevant data saving function
import { savePostTaskData } from "../saveData.js";

// initialise global saving vars
var gamePhase; var questName; var questionNo; var questionText;

// this function extends Phaser.Scene and includes the core logic for the scene
export default class PostTaskQuestions2 extends Phaser.Scene {
    constructor() {
        super({
            key: 'PostTaskQuestions2'
        });
    }

    preload() {
        
    }
    
    create() {
        // sizing vars
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;

        // quest and task stage vars
        gamePhase = 'postTask1';
        questName = 'PHQstate';

        ///////////////////QUEST1////////////////////
        var titleText = 'Right now...';
        questionText = ('....how much are you bothered by\n\n'+
                   '[color=#111]little interest or pleasure in doing things?[/color]\n'
                   );
        questionNo = 1;
        var responseOptions = ['not at all', 'a bit', 'somewhat', 'a lot'];
        this.mcPanel = new MultipleChoicePanel(this, 
                                               gameWidth/2, gameHeight/2,
                                               questName, titleText, questionNo, 
                                               questionText, responseOptions, gamePhase, false);
        ///////////////////QUEST1////////////////////
        questName = 'PHQstate';
        var responseOptions = ['not at all', 'a bit', 'somewhat', 'a lot'];
        var titleText = 'Right now...';

        eventsCenter.once('page1complete', function () {
            questionText = ('....how much are you bothered by\n\n'+
                       '[color=#111]little interest or pleasure in doing things?[/color]\n'
                       );
            questionNo = 1;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST2////////////////////
        eventsCenter.once(gamePhase+questName+'1complete', function () {
            savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('....how much are you bothered by\n\n'+
                       '[color=#111]feeling down, depressed, or hopeless?[/color]\n'
                       );
            questionNo = 2;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST3////////////////////
        eventsCenter.once(gamePhase+questName+'2complete', function () {
            savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('....how much are you bothered by\n\n'+
                       '[color=#111]feeling tired or having little energy?[/color]\n'
                       );
            questionNo = 3;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST4////////////////////
        eventsCenter.once(gamePhase+questName+'3complete', function () {
            savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('....how much are you bothered by\n\n'+
                       '[color=#111]feeling bad about yourself - or \n'+
                       'that you are a failure or have let yourself down?[/color]\n'
                       );
            questionNo = 4;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST5////////////////////
        eventsCenter.once(gamePhase+questName+'4complete', function () {
            savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('....how much are you bothered by\n\n'+
                       '[color=#111]trouble concentrating?[/color]\n'
                       );
            questionNo = 5;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST6////////////////////
        eventsCenter.once(gamePhase+questName+'5complete', function () {
            savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('....how much are you bothered by\n\n'+
                       '[color=#111]feeling like you are slowed down?[/color]\n'
                       );
            questionNo = 6;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        ///////////////////QUEST7////////////////////
        eventsCenter.once(gamePhase+questName+'6complete', function () {
            savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            questionText = ('....how much are you bothered by\n\n'+
                       '[color=#111]feeling fidgety or more restless\n'+
                       'than usual?[/color]\n'
                       );
            questionNo = 7;
            this.mcPanel = new MultipleChoicePanel(this, 
                                                   gameWidth/2, gameHeight/2,
                                                   questName, titleText, questionNo, 
                                                   questionText, responseOptions, gamePhase, false);
            }, this);

        // end scene
        eventsCenter.once(gamePhase+questName+'7complete', function () {
            savePostTaskData(gamePhase+questName+questionNo, this.registry.get(`${gamePhase}${questName}${questionNo}`));
            this.nextScene();
            }, this);
       
    }
        
    update(time, delta) {
    }

    nextScene() {
        this.scene.start('TheEnd');
    } 
}
