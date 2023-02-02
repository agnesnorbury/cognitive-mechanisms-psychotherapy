// Scene to hold multi-page intervention text

// import js game element modules (sprites, ui, outcome animations)
import InstructionsPanel from "../elements/instructionsPanel.js";
import MultipleChoicePanel from "../elements/multipleChoicePanel.js";

// import randomisation condition
import { randCond } from "../versionInfo.js";

// import our custom events center for passsing info between scenes and data saving function
import eventsCenter from "../eventsCenter.js";
import { saveTaskData } from "../saveData.js";

// initialize intervention-condition specific text vars
var intTitleText; var intText1; var intText2;
var intQuizText; var intQuizOptions;

// this function extends Phaser.Scene and includes the core logic for the scene
export default class InterventionScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'InterventionScene'
        });
    }

    preload() {
        // load cloud sprites to add texture to background
        this.load.image('cloud1', './assets/imgs/cloud1.png');
    }
    
    create() {
        // load a few cloud sprites dotted around and set sizing vars
        const cloud1 = this.add.sprite(180, 100, 'cloud1');
        const cloud2 = this.add.sprite(320, 540, 'cloud1');
        const cloud3 = this.add.sprite(630, 80, 'cloud1');
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;

        // get time;
        saveTaskData('interventionStartTime', Math.round(this.time.now));

        // set text depending on randomization condition
        if (randCond == "planning") {
            intTitleText = 'A note about goals';
            intText1 =  'Setting [color=#d0f4f7]realistic goals[/color] can help us make progress\n'+
                        'towards our overall aims.\n\n'+
                        'Trying to do too much too quickly can lead to feelings of \n'+
                        'frustration and discouragement if over-ambitious\n'+
                        'goals are not achieved. On the other hand,\n'+
                        'not setting goals at all can mean we feel a sense of failure\n'+
                        'because we don\'t make progress towards achieving our aims.\n\n'+
                        'Setting goals that are a [b]little bit ambitious[/b], but\n'+
                        'which we are sure [b]we can achieve[/b], means we are more\n'+
                        'likely to [color=#d0f4f7]feel a sense of achievement[/color] or [color=#d0f4f7]accomplishment[/color]\n'+
                        'upon hitting our targets. These feelings can help [b]motivate us[/b]\n'+
                        'to work further towards our overall aims, so that in the\n'+
                        'long run we are able to make more progress than if we had\n'+
                        'set ourselves too high a target, or none at all.\n\n';
            intQuizText = '[color=#111]Which statement below do you think [b]best summarises[/b]\n'+
                          'what you just read?\n\n'+
                          '[b]A[/b]. Not setting a goal at all makes us likely to succeed.\n\n'+
                          '[b]B[/b]. Setting an over-ambitious goal is the best way to\n'+
                          'achieve the most.\n\n'+
                          '[b]C[/b]. Setting goals which are somewhat ambitious but which are\n'+
                          'likely to be achievable helps keep us motivated.\n\n'+
                          '[b]D[/b]. Trying to do too much too quickly is a good\n'+
                          'way to achieve our goals.\n';
            intQuizOptions = ['A', 'B', 'C', 'D'];
            intText2 =  '\nWe will now ask you to play the game again,\n'+
                        '  but this time you will be [color=#d0f4f7]asked to set a goal[/color]  \n'+
                        'before starting each ‘block’ of choices.\n\n';
        } else {
            intTitleText = 'A note about games';
            intText1 =  'Research has shown that people have different feelings about\n'+
                        '[color=#d0f4f7]different kinds of online games[/color].\n\n'+
                        'Whilst some people enjoy playing games that require you to have\n'+
                        'quick reaction times, others can find these frustrating.\n\n'+
                        'Similarly, some people find that they gain the biggest\n'+
                        '[color=#d0f4f7]sense of achievement or accomplishment[/color] from working on\n'+
                        'puzzle-style games, whilst others can find the slower progress\n'+
                        'on these types of games discouraging.\n\n'+
                        'However we feel about different kinds of games, it is likely\n'+
                        'that these kinds of feelings can help [b]motivate us[/b]\n'+
                        'if/when we play them.\n\n';
            intQuizText = '[color=#111]Which statement below do you think [b]best summarises[/b]\n'+
                          'what you just read?\n\n'+
                          '[b]A[/b]. Everyone enjoys every kind of online game.\n\n'+
                          '[b]B[/b]. People never enjoy games which require you\n'+
                          'to have fast reactions.\n\n'+
                          '[b]C[/b]. Different people may find different features\n'+
                          'of different games enjoyable and motivating.\n\n'+
                          '[b]D[/b]. People never enjoy puzzle-style\n'+
                          'games as these are slow and boring.\n';
            intQuizOptions = ['A', 'B', 'C', 'D'];
            intText2 =  '\nWe will now ask you to play the game again,\n'+
                        ' but this time you will be [color=#d0f4f7]asked to rate how much \n'+
                        'you enjoy playing different kinds of games[/color]\n'+
                        'before starting each ‘block’ of choices.\n\n';
        }
        
        // let's do this the long-winded way for now...[should make this a function]
        ///////////////////PAGE ONE////////////////////
        var pageNo = 1;
        this.interventionPanel = new InstructionsPanel(this, 
                                                       gameWidth/2, gameHeight/2,
                                                       pageNo, intTitleText, intText1, "continue to quiz!");
        ///////////////////QUIZ////////////////////
        var questionNo = 1;
        var questName = 'interventionQuiz';
        var titleText = 'Quick quiz!';
        var gamePhase = 'postIntervention';
        eventsCenter.once('page1complete', function () {
            this.interventionQuiz = new MultipleChoicePanel(this, gameWidth/2, gameHeight/2,
                                                            questName, titleText, questionNo, 
                                                            intQuizText, intQuizOptions, gamePhase, true);
        }, this);

        eventsCenter.on('goback', function () {
            this.interventionPanel = new InstructionsPanel(this, 
                                               gameWidth/2, gameHeight/2,
                                               pageNo, intTitleText, intText1, "continue");
        }, this);
        
        ///////////////////PAGE TWO////////////////////
        eventsCenter.once(gamePhase+questName+'1complete', function () {
            saveTaskData('interventionQuizAnswer', this.registry.get(`${gamePhase}${questName}${questionNo}`));
            saveTaskData('interventionQuizCompleteTime', Math.round(this.time.now));
            pageNo = 2;
            this.interventionPanel = new InstructionsPanel(this, 
                                                           gameWidth/2, gameHeight/2,
                                                           pageNo, intTitleText, intText2, "start game!");
            }, this);
        
        // end scene
        eventsCenter.once('page2complete', function () {
            this.nextScene();
            }, this);
    }
    
    update(time, delta) {
    }
    
    nextScene() {
        this.scene.start('MainTask2');
    } 
}