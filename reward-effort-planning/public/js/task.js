// import js modules that hold the game/experiment scenes
// instructions and practice/calibration task:
import InstructionsScene from "./scenes/instructionsScene.js";
import PracticeTask from "./scenes/practiceTask.js";
import StartTaskScene from "./scenes/startTaskScene.js";
// first run of task + questions:
import MainTask from "./scenes/mainTask.js";
import TaskEndScene from "./scenes/taskEndScene.js";
import PostTaskQuestions from "./scenes/postTaskQuestions.js";
// intervention scene:
import InterventionScene from "./scenes/interventionScene.js";
// second run of task (randomized cond) + questions:
import MainTask2 from "./scenes/mainTask2.js";
import TaskEndScene2 from "./scenes/taskEndScene2.js";
import PostTaskQuestions2 from "./scenes/postTaskQuestions2.js";
// finish up and return to any other content:
import TheEnd from "./scenes/theEnd.js";

// allow access to mobile devices?
import { allowDevices } from "./versionInfo.js";

// create the phaser game, based on the following config
const config = {
    type: Phaser.AUTO,           // rendering: webGL if available, otherwise canvas
    width: 800,  
    height: 600, 
    physics: {
        default: 'arcade',       // add light-weight physics to our world
        arcade: {
            gravity: { y: 600 }, // need some gravity for a side-scrolling platformer
            debug: false         // TRUE for debugging game physics, FALSE for deployment
        }
    },
    parent: 'game-container',    // ID of the DOM element to add the canvas to
    dom: {
        createContainer: true    // to allow text input DOM element
    },
    backgroundColor: "#d0f4f7",  // pale blue sky color [black="#222222"],
    scene: [//
            InstructionsScene,
            PracticeTask,
            StartTaskScene,
            //
            MainTask, 
            TaskEndScene,
            PostTaskQuestions,
            //
            InterventionScene,
            //
            MainTask2,           
            TaskEndScene2,
            PostTaskQuestions2,
            //
            TheEnd
            ],              // construct the experiment from componenent scenes
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: rexuiplugin,  // load the rexUI plugins here for all scenes
            mapping: 'rexUI'
        }]
    }
};

// wrap game creation in a function so that it isn't created until consent completed
export function runTask() {
    // create new phaser game configured as above
    var game = new Phaser.Game(config);  

    // if desired, allow game window to resize to fit available space 
    function resizeApp () {
        // Width-height-ratio of game resolution
        let game_ratio = 800 / 600;
        
        // Make div full height of browser and keep the ratio of game resolution
        let div = document.getElementById('game-container');
        div.style.width  = (window.innerHeight * game_ratio) + 'px';
        div.style.height = window.innerHeight + 'px';
        
        // Check if device DPI messes up the width-height-ratio
        let canvas  = document.getElementsByTagName('canvas')[0];
        let dpi_w   = parseInt(div.style.width) / canvas.width;
        let dpi_h   = parseInt(div.style.height) / canvas.height;       
        let height  = window.innerHeight * (dpi_w / dpi_h);
        let width   = height * game_ratio;
        
        // Scale canvas 
        canvas.style.width  = width + 'px';
        canvas.style.height = height + 'px';
    };
    window.addEventListener('resize', resizeApp);
};

// if desired, block access to game on phones/tablets
if (allowDevices == false) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
       alert("Sorry, this game does not work on mobile devices!");
    }
}
