// import our custom events centre for passsing info between scenes
import eventsCenter from '../eventsCenter.js'

// make popup dialog box with instructions and number bar for participant to enter ratings
export default class SetGoalPanel {
    constructor(scene, x, y, block, maxRewBlock) {
    this.scene = scene;

    var mainTxt =  'Please set a goal for the number of coins\n'+
                   'you want to try and collect during\n'+
                   'this "block" of choices.\n\n'+
                   'For this block, [color=#FFD700]if you choose the highest\n'+
                   ' power option every single time[/color] you could collect\n'+
                   '[color=#FFD700]'+maxRewBlock+' coins[/color] (this is the maximum possible).\n\n'+
                   'Please set your personal goal for this block\n'+
                   'using the slider below. Press [b]enter answer[/b]\n'+
                   'when you are ready to continue.\n\n';
    
    var buttonTxt = 'enter answer';    

    var mainPanel = createMainPanel(scene, mainTxt, buttonTxt, block, maxRewBlock)
        .setPosition(x,y)
        .layout()
        //.drawBounds(scene.add.graphics(), 0xff0000) //for debugging only
        .popUp(500); 
    }
    
}

////////////////////functions for making in-scene graphics//////////////////////////
///////////main panel////////////
var createMainPanel = function (scene, mainTxt, buttonTxt, block, maxRewBlock) {
    // create global registry var to pass ratings data between scenes
    scene.registry.set('block'+block+'goal', []);
    // create panel components
    var dialog = createDialog(scene, mainTxt, buttonTxt);
    var slider = createNumberBar(scene, maxRewBlock);
    var mainPanel = scene.rexUI.add.fixWidthSizer({
        orientation: 'x' //vertical stacking
        }).add(
            dialog, // child
            0, // proportion
            'center', // align
            0, // paddingConfig
            false, // expand
        )
        .add(
            slider, // child
            0, // proportion
            'center', // align
            0, // paddingConfig
            true, // expand
        )
    .layout();
    
    slider
    .once('valuechange', function () {
        //only allow answer to be entered once ppt has interacted with slider
        dialog
            .once('button.click', function (button, groupName, index) {
                let answer = Math.round(slider.getValue(0, maxRewBlock));   // get final slider value
                scene.registry.set('block'+block+'goal', answer);
                dialog.scaleDownDestroy();            // destroy ratings panel components
                slider.scaleDownDestroy();            // destroy ratings panel components
                eventsCenter.emit('block'+block+'goalset');   // emit completion event
            }, this)
            .on('button.over', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle(2, 0xffffff); // when hover
            })
            .on('button.out', function (button, groupName, index) {
                button.getElement('background').setStrokeStyle();
            });
    });
    
    return mainPanel;
};

///////////popup dialog box//////
var createDialog = function (scene, mainTxt, buttonTxt) {
    var textbox = scene.rexUI.add.dialog({
    background: scene.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x815532),
    
    title: scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0xf57f17),
        text: scene.add.text(0, 0, 'Set your goal!', {
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

    content: scene.rexUI.add.BBCodeText(0, 0, mainTxt, {
        font: '20px monospace',
        align: 'center'
    }),

    actions: [
        createLabel(scene, buttonTxt)
    ],

    space: {
        title: 25,
        content: 20,
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
    })
    .layout();
    
    return textbox;
};

/////////button labels////////////////////////////
var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, 0xf57f17),
        text: scene.add.text(0, 0, text, {
            fontSize: '20px'
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

////////number bar//////////////////////////////////
var createNumberBar = function (scene, maxRewBlock) {
    var numberBar = scene.rexUI.add.numberBar({ 
        width: 494,                 // fixed width slider
        orientation: 'horizontal',

        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x815532),
        icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0xf57f17),

        slider: {
            track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x7b8185),
            indicator: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0xf57f17),
            input: 'click',
        },

        text: scene.rexUI.add.BBCodeText(0, 0, '', {
            fontSize: '20px', fixedWidth: 50, fixedHeight: 45,
            valign: 'center', halign: 'center'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10,
            slider: 10,
        },

        valuechangeCallback: function (value, oldValue, numberBar) {
            numberBar.text = Math.round(Phaser.Math.Linear(0, maxRewBlock, value));
            return value;
        },
        
    })
    .setValue(0, 0, maxRewBlock)
    .layout();
    
    return numberBar;
};