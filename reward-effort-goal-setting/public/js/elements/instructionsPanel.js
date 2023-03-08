// makes popup dialog box to display task instructions

// import our custom events centre for passsing info between scenes
import eventsCenter from '../eventsCenter.js'

// initialize diplay vars
var backgrCol; var titleCol; var buttonCol;

export default class InstructionsPanel {
    constructor(scene, x, y, pageNo, titleTxt, mainTxt, buttonTxt) {
    this.scene = scene;
    
    backgrCol = 0x1ea7e1;
    titleCol = 0x000000;
    buttonCol = 0x5e81a2;

    var instrPanel = createInstrPanel(scene, pageNo, titleTxt, mainTxt, buttonTxt)
        .setPosition(x, y)
        .layout()
        .popUp(500); 
    }  
}

////////////////////functions for making in-scene graphics//////////////////////////
///////////main panel////////////
var createInstrPanel = function (scene, pageNo, titleTxt, mainTxt, buttonTxt) {
    // create panel components
    var dialog = createDialog(scene, pageNo, titleTxt, mainTxt, buttonTxt);
    var mainPanel = scene.rexUI.add.fixWidthSizer({
        orientation: 'x' //vertical stacking
        }).add(
            dialog, // child
            0, // proportion
            'center', // align
            0, // paddingConfig
            false, // expand
        )
    .layout();
    
    dialog
        .once('button.click', function (button, groupName, index) {
            dialog.scaleDownDestroy();                     // destroy panel components
            eventsCenter.emit('page'+pageNo+'complete');   // emit completion event
        }, this)
        .on('button.over', function (button, groupName, index) {
            button.getElement('background').setStrokeStyle(2, 0xffffff); // when hover
        })
        .on('button.out', function (button, groupName, index) {
            button.getElement('background').setStrokeStyle();
        });
    
    return mainPanel;
};

///////////popup dialog box//////
var createDialog = function (scene, pageNo, titleTxt, mainTxt, buttonTxt) {
    var textbox = scene.rexUI.add.dialog({
    background: scene.rexUI.add.roundRectangle(0, 0, 400, 400, 20, backgrCol),
    
    title: scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, titleCol),
        text: scene.add.text(0, 0, titleTxt, {
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
        //fontSize: "20px",
        font: '20px monospace',
        align: 'center',
        color: '#000',
        underline: {color: '#000',
                    offset: 6,
                    thickness: 3}
    }),
        
    actions: [
        createLabel(scene, buttonTxt)
    ],
        
    space: {
        title: 25,
        content: 10,
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
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, buttonCol),
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