// Scene to hold the the pre-task practice / effort callibration scene. Routes to the Main Task scene.

// import js game element modules (sprites, ui, outcome animations, etc.)
import Player from "../elements/player.js";
import Gems from "../elements/gems.js";
import InstructionsPanel from "../elements/instructionsPanel.js";       
import TimerPanel from "../elements/timerPanelClicks.js";

// import our custom events center for passsing info between scenes annd relevant data saving function
import eventsCenter from '../eventsCenter.js'
import { savePracTaskData } from "../saveData.js";

// import effort info from versionInfo file
import { effortTime, pracTrialEfforts, debugging } from "../versionInfo.js";  

// initialize some global vars
var gameHeight;
var gameWidth;
var mapWidth;
var platforms;
var gemHeight;
const decisionPointX = 370;    // where the info panel will be triggered (x coord in px)
const midbridgeX = 735;        // where gems will be displayed (x coord in px)
const playerVelocity = 1000;   // baseline player velocity (rightward)
// initialize practice task vars
var pracTrial = 0;
var nGems = 0;
var pracTrialRewards = [  4,   2,   6,   8,   5];
var gemHeights       = [255, 315, 195,  85, 135];
var nPracTrials;
var pracTrialReward;
var pracTrialEffort;
var gemHeight;
var gemText;
var feedback;
var pressCount;
var pressTimes;
var trialSuccess;
var maxPressCount;
if (debugging == false) {
    nPracTrials = pracTrialRewards.length;
} else {
    nPracTrials = 1;
}
// initiliaze timing and response vars
var pracFeedbackTime = 1500;
const practiceOrReal = 0;

// this function extends Phaser.Scene and includes the core logic for the game
export default class PracticeTask extends Phaser.Scene {
    constructor() {
        super({
            key: 'PracticeTask'
        });
    }

    preload() {
        ////////////////////PRELOAD GAME ASSETS///////////////////////////////////
        // load tilemap and tileset created using Tiled (see below)
        this.load.tilemapTiledJSON('pmap', './assets/tilemaps/tilemap-practice.json'); 
        this.load.image('tiles', './assets/tilesets/tiles_edited_70px_extruded.png');

        // load player sprite
        this.load.spritesheet('player', './assets/spritesheets/player1.png', { 
            frameWidth: 90, 
            frameHeight: 96
        });
        
        // load rock and plant sprites to add some texture to background
        this.load.image('rock1', './assets/imgs/rockMoss.png');
        this.load.image('rock2', './assets/imgs/rockMossAlt.png');
        this.load.image('plant', './assets/imgs/plantPurple.png');
        this.load.image('button', './assets/imgs/button.png');

        // load animated coin sprite (these will represent offered reward level)
        this.load.spritesheet('gem', './assets/spritesheets/crystal-qubodup-ccby3-32-pink.png', { 
            frameWidth: 32, 
            frameHeight: 32
        });
        
    }
    
    create() {
        ////////////////////////CREATE WORLD//////////////////////////////////////
        // game world created in Tiled (https://www.mapeditor.org/)
        // import practice world tilemap
        var pmap = this.make.tilemap({ key: "pmap" });
        var tileset = pmap.addTilesetImage("tiles_edited_70px_extruded", "tiles"); // first arg must be name used for the tileset in Tiled

        // grab some size variables that will be helpful later
        gameHeight = this.sys.game.config.height;
        gameWidth = this.sys.game.config.width;
        mapWidth = pmap.widthInPixels;

        // import scene layers (using names set up in Tiled)
        platforms = pmap.createStaticLayer("platforms", tileset, 0, 0);
        
        // set up collision property for tiles that can be walked on (set in Tiled)
        platforms.setCollisionByProperty({ collide: true });

        // add rock and plant sprites for texture (randomly positioned on each trial)
        this.rocks1 = this.physics.add.staticGroup();
        for (var i = 0; i < 2; i++) {
            var x = Phaser.Math.RND.between(0, mapWidth);
            var y = gameHeight/2 + 80;        // only at ground height
            this.rocks1.create(x, y, 'rock1').setScale(1.2).refreshBody();
        }
        this.rocks2 = this.physics.add.staticGroup();
        for (var i = 0; i < 2; i++) {
            var x = Phaser.Math.RND.between(0, mapWidth);
            var y = gameHeight/2 + 80;        // only at ground height
            this.rocks2.create(x, y, 'rock2').setScale(1.2).refreshBody();
        }
        this.plants = this.physics.add.staticGroup();
        for (var i = 0; i < 4; i++) {
            var x = Phaser.Math.RND.between(0, mapWidth);
            var y = gameHeight/2 + 80;        // only at ground height
            this.rocks2.create(x, y, 'plant').setScale(1.2).refreshBody();
        }
        
        // set the boundaries of the world
        this.physics.world.bounds.width = mapWidth;
        this.physics.world.bounds.height = gameHeight;

        //////////////ADD PLAYER SPRITE////////////////////
        this.player = new Player(this, 0, 300); // (this, spawnPoint.x, spawnPoint.y);
        this.physics.add.collider(this.player.sprite, platforms);    // player walks on platforms      

        //////////////CONTROL CAMERA///////////////////////
        this.cameras.main.startFollow(this.player.sprite);           // camera follows player
        this.cameras.main.setBounds(0, 0, mapWidth, gameHeight);
        
        ///////////INSTRUCTIONS & SCORE TEXT///////////////
//        // add instructions text in a fixed position on the screen
//        this.add
//            .text(16, 16, "practice powering up to collect gems!", {
//                font: "18px monospace",
//                fill: "#ffffff",
//                padding: { x: 20, y: 10 },
//                backgroundColor: "#1ea7e1"
//            })
//            .setScrollFactor(0);
        // add coin count text in a fixed position on the screen
        gemText = this.add
            .text(gameWidth-160, 16, "gems: "+nGems, {
                font: "18px monospace",
                fill: "#fc94c4",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);
        
        /////////////UI: CHOICES AND RATINGS///////////////
        // UI functionality built using Rex UI plugins for phaser3 
        // (see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/). 
        // These plugins are globally loaded from the min.js src in index.html
        
        //////////////////////////GET TRIAL INFO//////////////////////////////////  
        // set the two trial options info from trial number
        pracTrialReward = pracTrialRewards[pracTrial];
        if (debugging == false) {
            pracTrialEffort = pracTrialEfforts[pracTrial];
        } else {
            pracTrialEffort = 2;
        }
        
        //////////////////////////TRIAL CONTROL POINTS///////////////////////////
        // 0. First, let's add some invisible to sprites regions of space that key trial 
        // events depend on, so that our player can collide (interact) with them
        // 0.1 point where the choice panel is triggered:
        this.decisionPoint = this.physics.add.sprite(decisionPointX, gameHeight/2);   
        this.decisionPoint.displayHeight = gameHeight;  
        this.decisionPoint.immovable = true;
        this.decisionPoint.body.moves = false;
        this.decisionPoint.allowGravity = false;
        // 0.2 point where a new trial is triggered:
        this.trialEndPoint = this.physics.add.sprite(mapWidth-20, gameHeight/2);
        this.trialEndPoint.displayHeight = gameHeight;  
        this.trialEndPoint.immovable = true;
        this.trialEndPoint.body.moves = false;
        this.trialEndPoint.allowGravity = false;   
        
        // 1. Upon entering scene, player moves right until they encounter the decisionPoint
        this.player.sprite.setVelocityX(playerVelocity*2.5);  // positive X velocity -> move R
        this.player.sprite.anims.play('run', true);
        this.physics.add.collider(this.player.sprite, this.decisionPoint, 
                          function(){eventsCenter.emit('infoPanelOn');}, null, this); // once the player has collided with invisible decision point, emit event
        // once this event is detected, perform the function displayInfoPanel (only once)
        eventsCenter.once('infoPanelOn', displayInfoPanel, this);  
        
        // 2. After trial outcome (reject, accept+successful, accept+unsuccessful), 
        // player moves right again until they encounter the trial end point
        this.physics.add.collider(this.player.sprite, this.trialEndPoint, 
                          function(){eventsCenter.emit('practiceTrialEndHit');}, null, this); // once the player has collided with invisible trial end point, emit event
        // once this event us detected, perform the function trialEnd (only once)
        eventsCenter.once('practiceTrialEndHit', pracTrialEnd, this);
        
        // // 3. if desired, add listener functions to pause game when focus taken away
        // // from game browser tab/window [necessary for mobile devices]
        // window.addEventListener('blur', () => { 
        //     //console.log('pausing game content...');      // useful for debugging pause/resume
        //     this.scene.pause();
        // }, false);
        // // and resume when focus returns
        // window.addEventListener('focus', () => { 
        //     setTimeout( () => { 
        //         //console.log('resuming game content...'); 
        //         this.scene.resume();
        //     }, 250); 
        // }, false);
    }
    
    update(time, delta) {
        ///////////SPRITES THAT REQUIRE TIME-STEP UPDATING FOR ANIMATION//////////
        // allow player to move
        this.player.update(); 
        
        ////////////MOVE ON TO NEXT SCENE WHEN ALL TRIALS HAVE RUN////////////////
        if (pracTrial == nPracTrials) {
            this.registry.set('maxPressCount', maxPressCount);
            this.nextScene();
        }
    }
    
    nextScene() {
        this.scene.start('StartTaskScene');
    }
}

///////////////////////////////FUNCTIONS FOR CONTROLLING TRIAL SEQUENCE/////////////////////////////////////
// 1. Once player has hit the decision point, pop up the choice panel with info for that trial
var displayInfoPanel = function () {
    // update some stuff (stop player moving and remove decisionPoint sprite)
    this.player.sprite.setVelocityX(0);
    this.player.sprite.anims.play('wait', true); 
    this.decisionPoint.destroy();
    
    // display gems for this practice go - at a height proportional to the number of gems available
    gemHeight = gemHeights[pracTrial];
    this.gems = new Gems(this, midbridgeX-(pracTrialReward*30)/2, gemHeight, pracTrialReward); 
    
    // popup choice panel with relevant trial info
    let titleTxt = ("Practice "+(pracTrial+1)+" of "+nPracTrials+"!");
    let mainTxt = ("Press the [color=#ffffff]POWER[/color] button as fast as you can,\n"+
                   //"until the power bar shows you are [color=#ffffff]100% charged[/color].\n\n"+
                   "until the power bar shows you are [color=#ffffff]fully charged[/color].\n\n"+
                   "More power will allow you to collect more gems!\n\n"+
                   " When you are ready, press the button below. ");
    let buttonTxt = "ready";
    let pageNo = 4;
    this.instructionsPanel = new InstructionsPanel(this, 
                                                   decisionPointX+20, gameHeight/2-120, 
                                                   pageNo, titleTxt, mainTxt, buttonTxt);
    
    // once choice is entered, get choice info and route to relevant next step
    eventsCenter.once('page4complete', doChoice, this);       
};

// 2. Once participant has indicated they are ready, let them try out the effort panel 
var doChoice = function () {
    // timer panel pops up  
    this.timerPanel = new TimerPanel(this, decisionPointX+20, gameHeight/2-130, effortTime, pracTrialEffort, practiceOrReal); 
    // and play player 'power-up' animation
    this.player.sprite.anims.play('powerup', true);
    
    // until time limit reached:
    eventsCenter.once('practicetimesup', effortOutcome, this) 
};

// 3. If participant accepts effort proposal, record button presses and see if they meet threshold
var effortOutcome = function() {
    // get number of achieved button presses 
    pressCount = this.registry.get('pressCount');
    pressTimes = this.registry.get('pressTimes');  // [?we want this - might make code run slow...]
    
    // if ppt chooses high effort and clears trial effort threshold, fly across sky and collect coins!
    if (pressCount >= pracTrialEffort) {
        trialSuccess = 1;
        // add overlap colliders so coins  on either route disappear when overlap with player body
        this.physics.add.overlap(this.player.sprite, this.gems.sprite, collectGems, null, this); 
        // display success message for a couple of seconds,
        feedback = this.add.text(decisionPointX+20, gameHeight/2-100,  
                                 "Woohoo! You did it!", {
                                    font: "20px monospace",
                                    fill: "#ffffff",
                                    align: 'center',
                                    padding: { x: 20, y: 10 },
                                    backgroundColor: "#1ea7e1"
                                 })
            .setOrigin(0.5, 1);
        this.tweens.add({        
            targets: feedback,
            scaleX: { start: 0, to: 1 },
            scaleY: { start: 0, to: 1 },
            ease: 'Back',    
            duration: pracFeedbackTime,
            repeat: 0,      
            yoyo: true
        });
        // then player floats across 'high route' and collects coins
        this.time.addEvent({delay: pracFeedbackTime+250, 
                            callback: function(){
                                feedback.destroy();
                                this.player.sprite.anims.play('float', true);    
                                this.player.sprite.setVelocityX(playerVelocity/3);
                                this.time.addEvent({ delay: 150, 
                                                     callback: function(){this.player.sprite.setVelocityY(-420+gemHeight);},
                                                     callbackScope: this, 
                                                     repeat: 5 });
                            },
                            callbackScope: this});
    }
    else {  // else if fail to reach trial effort threshold
        trialSuccess = 0;
        // display failure message for a couple of seconds
        feedback = this.add.text(decisionPointX, gameHeight/2-100,  
                                 "Sorry, not quite enough\npower this time!", {
                                    font: "20px monospace",
                                    fill: "#ffffff",
                                    align: 'center',
                                    padding: { x: 20, y: 10 },
                                    backgroundColor: "#000000"
                                 })
            .setOrigin(0.5, 1);
        this.tweens.add({        
            targets: feedback,
            scaleX: { start: 0, to: 1 },
            scaleY: { start: 0, to: 1 },
            ease: 'Back',    
            duration: pracFeedbackTime,
            repeat: 0,      
            yoyo: true
        });
        // then play powerup fail anim and progress via slow route
        this.time.addEvent({delay: pracFeedbackTime+250, 
                            callback: function(){
                                feedback.destroy();
                                // then play short 'powerup fail' anim:
                                this.player.sprite.anims.play('powerupfail', true);
                                // and progress via bridge route (with sad face)
                                this.player.sprite.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                                    // player progresses via bridge and earns no extra reward
                                    this.player.sprite.setVelocityX(playerVelocity/4);   // 4,5,6
                                    this.player.sprite.anims.play('run', true);
                                    });
                            },                         
                            callbackScope: this});
    }
};



// 4. When player hits end of scene, save trial data and move on to the next trial (reload the scene)
var pracTrialEnd = function () {
    // determine if pressCount exceeded previous practice trials
    if (pracTrial == 0) {
        maxPressCount = pressCount;
        this.registry.set('maxPressCount', maxPressCount);
    } else if ( pressCount > this.registry.get('maxPressCount') ) {    
       maxPressCount = pressCount;
       this.registry.set('maxPressCount', maxPressCount);
    }
    // set data to be saved into registry
    this.registry.set("pracTrial"+pracTrial, {pracTrialNo: pracTrial, 
                                              trialReward: pracTrialReward,
                                              trialEffort: pracTrialEffort,
                                              pressCount: pressCount,
                                              pressTimes: pressTimes,
                                              trialSuccess: trialSuccess,
                                              gemsRunningTotal: nGems,
                                              maxPressCount: this.registry.get('maxPressCount')
                                             });
    // save data
    savePracTaskData(pracTrial, this.registry.get(`pracTrial${pracTrial}`));    // [for firebase]
    
    // iterate trial number
    pracTrial++; 
    // move to next trial
    this.scene.restart();        // [?wrap in delay function to ensure saving works] 
};


//////////////////////MISC FUNCTIONS/////////////////////
// function to make coin sprites disappear upon contact with player
// (so player appears to 'collect' them)
var collectGems = function(player, gem){
    gem.disableBody(true, true);      // individual gems from physics group become invisible upon overlap
    nGems++; 
    gemText.setText('gems: '+nGems);  // and gems total and text updates
};