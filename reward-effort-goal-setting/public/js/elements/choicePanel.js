// Displays panel with UI elements for a 2AFC (accept/reject proposed option)

// import our custom events centre for passsing info between scenes
import eventsCenter from '../eventsCenter.js'

// initialize diplay vars
var backgrCol; var titleCol; var buttonCol;

// make popup dialog box with instructions and choice buttons
export default class ChoicePanel {
    constructor(scene, x, y, trialReward1, trialEffortPropMax1, trialEffort1, trialReward2, trialEffortPropMax2, trialEffort2) {
    this.scene = scene;
    
    // set properties of the panel (text content and colours)    
    var titleTxt; var mainTxt; var buttonTxt;
    titleTxt = 'You have a choice!';
    mainTxt = ('[color=#FFD700]'+trialReward1+' coins[/color]        '+
               '[color=#FFD700]'+trialReward2+' coins[/color]\n'+
               '[color=#FFD700]'+(trialEffortPropMax1*100).toFixed()+'% POWER[/color]      '+        
               '[color=#FFD700]'+(trialEffortPropMax2*100).toFixed()+'% POWER[/color]');      ////#8BE1EB 
    backgrCol = 0x815532;
    titleCol = 0xf57f17;  
    buttonCol = 0xf57f17;

    var mainPanel = createMainPanel(scene, titleTxt, mainTxt, buttonTxt)
        .setPosition(x,y)
        .layout()
        //.drawBounds(scene.add.graphics(), 0xff0000) // for debugging only
        .popUp(750); 
    }
    
}

////////////////////functions for making in-scene graphics//////////////////////////
///////////create main panel////////////
var createMainPanel = function (scene, titleTxt, mainTxt, buttonTxt) {
    // create global registry var to pass choice output between scenes
    scene.registry.set('choice', []);
    
    // create components
    var dialog = createDialog(scene, titleTxt, mainTxt, buttonTxt);
    var mainPanel = scene.rexUI.add.fixWidthSizer({
        orientation: 'x' // vertical stacking
        }).add(
            dialog, // child
            0, // proportion
            'center', // align
            0, // paddingConfig
            false, // expand
        )
    .layout();
    
    // add some interactivity and ability to save choices
    dialog
        .once('button.click', function (button, groupName, index) {
            let choice = button.text;        // get chosen button label (string)
            //let choice = index;            // get chosen button index (0=accept, 1=reject)
            scene.registry.set('choice', choice);  // set choice value as global var
            dialog.scaleDownDestroy(250);          // destroy ratings panel components
            eventsCenter.emit('choiceComplete');   // emit choice completion event
        }, this)
        .on('button.over', function (button, groupName, index) {
            button.getElement('background').setStrokeStyle(2, 0xffffff); // when hover
        })
        .on('button.out', function (button, groupName, index) {
            button.getElement('background').setStrokeStyle();            // when un-hover
        });

    return mainPanel;
};

///////////create popup dialog box//////
var createDialog = function (scene, titleTxt, mainTxt, buttonTxt) {
    var textbox = scene.rexUI.add.dialog({
    background: scene.rexUI.add.roundRectangle(0, 0, 400, 400, 20, backgrCol),
    
    title: scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, titleCol),
        text: scene.add.text(0, 0, titleTxt, {
            fontSize: '22px'
            }),
        align: 'center',
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    }),

    content: scene.rexUI.add.BBCodeText(0, 0, mainTxt, {fontSize: '20px', 
                                                        //font: '20px monospace', 
                                                        align: 'center' //color: '#222222'
                                                        }),

    actions: [
        createLabel(scene, 'route 1'),
        createLabel(scene, 'route 2')
    ],

    space: {
        title: 25,
        content: 20,
        action: 60,
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

/////////create button labels/////////////////
var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, buttonCol),
        text: scene.add.text(0, 0, text, {
            //fontSize: '20px',
            font: '18px monospace',
        }),
        align: 'center',
        width: 40,
        space: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10
        }
    });
};
