// Displays panel with UI elements for a 2AFC (accept/reject proposed option)

// import our custom events centre for passsing info between scenes
import eventsCenter from '../eventsCenter.js'

// initialize diplay vars
var backgrCol; var titleCol; var buttonCol;
var buttons; var choice;

// make popup dialog box with instructions and choice buttons
export default class MultipleChoicePanel {
    constructor(scene, x, y, questName, titleText, questionNo, questionText, responseOptions, gamePhase, allowBack) {
    this.scene = scene;
    
    // set properties of the panel (text content and colours)     
    backgrCol = 0x1ea7e1;
    titleCol = 0x000000;
    buttonCol = 0x5e81a2;

    var mainPanel = createMainPanel(scene, questName, titleText, questionNo, questionText, responseOptions, gamePhase, allowBack)
        .setPosition(x,y)
        .layout()
        //.drawBounds(scene.add.graphics(), 0xff0000) // for debugging only
        .popUp(250);  

    if (allowBack == true) {
        // add buttons to allow navigation forward/back
        buttons = scene.rexUI.add.buttons({
            x: 400,
            y: 535,
            align: 'center',
            buttons: [ createButton(scene, 'go back')]
        })
        .layout();

        buttons
        .on('button.click', function (button, groupName, index) {
            if (button.text == 'go back') {
                eventsCenter.emit('goback');
            }
        }, this)
        .on('button.over', function (button, groupName, index) {
            button.getElement('background').setStrokeStyle(2, 0x000000); // when hover
        })
        .on('button.out', function (button, groupName, index) {
            button.getElement('background').setStrokeStyle();
        });
    }
    }
}

////////////////////functions for making in-scene graphics//////////////////////////
///////////create main panel////////////
var createMainPanel = function (scene, questName, titleText, questionNo, questionText, responseOptions, gamePhase, allowBack) {
    // create global registry var to pass choice output between scenes
    scene.registry.set(gamePhase+questName+questionNo, []);
    
    // create components
    var dialog = createDialog(scene, titleText, questionNo, questionText, responseOptions);
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
            choice = button.text;        // get chosen button label (string)
            scene.registry.set(gamePhase+questName+questionNo, choice);  // set choice value as global var
            dialog.scaleDownDestroy(250);          // destroy ratings panel components
            eventsCenter.emit(gamePhase+questName+questionNo+'complete');   // emit choice completion event
            if (allowBack == true){
                buttons.scaleDownDestroy();
            }
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
var createDialog = function (scene, titleText, questionNo, questionText, responseOptions) {
    var textbox = scene.rexUI.add.dialog({
    background: scene.rexUI.add.roundRectangle(0, 0, 400, 400, 20, backgrCol),
    
    title: scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, titleCol),
        text: scene.add.text(0, 0, titleText, {
            fontSize: '20px'
            }),
        align: 'center',
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    }),

    content: scene.rexUI.add.BBCodeText(0, 0, questionText, {fontSize: '18px', 
                                                        //font: '20px monospace', 
                                                        align: 'center' //color: '#222222'
                                                       }),
    actions: [
        createLabel(scene, responseOptions[0]),
        createLabel(scene, responseOptions[1]),
        createLabel(scene, responseOptions[2]),
        createLabel(scene, responseOptions[3]),
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

var createButton = function (scene, text) {
    return scene.rexUI.add.label({
        width: 100,
        height: 40,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, buttonCol),
        text: scene.add.text(0, 0, text, {
            fontSize: 18
        }),
        space: {
            left: 10,
            right: 10,
        }
    });
}
