// import our custom events centre for passsing info between scenes
import eventsCenter from '../eventsCenter.js'

// make popup dialog box to tell participants they can take a break between blocks
export default class EndOfBlockPanel {
    constructor(scene, x, y, nCoins) {
    this.scene = scene;
        
    var titleTxtB = 'End of block!'; 
    var mainTxtB = ('You have finished this block of the game.\n\n'+
                    'In this block, you collected [color=#FFD700]'+nCoins+' coins[/color].\n\n'+
                    'If you like, take a break now.\n\n'+
                    'Press the [b]continue[/b] button below \n'+
                    'when you\'re ready to get back to the game.');
    var buttonTxtB = 'continue';     
        
    var askBreakPanel = createBreakPanel(scene, titleTxtB, mainTxtB, buttonTxtB)
        .setPosition(x, y)
        .layout()
        //.drawBounds(scene.add.graphics(), 0xff0000) // for debugging only
        .once('button.click', function (button) {
            askBreakPanel.scaleDownDestroy();    // destroy panel
            eventsCenter.emit('breakover');      // emit completion event
        }, this)
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(2, 0xffffff); // when hover
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        });
    }
}

///////////popup dialog box//////
var createBreakPanel = function (scene, titleTxtB, mainTxtB, buttonTxtB) {
    var textboxB = scene.rexUI.add.dialog({
    background: scene.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x1ea7e1),
    
    title: scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x000000),
        text: scene.add.text(0, 0, titleTxtB, {
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

    content: scene.rexUI.add.BBCodeText(0, 0, mainTxtB, 
                                        {fontSize: '18px', align: 'center'}),

    actions: [
        createLabelB(scene, buttonTxtB)
    ],

    space: {
        title: 20,
        content: 20,
        action: 20,
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
    },
        
    align: {
        actions: 'center',
    },

    expand: {
        content: false, 
    }
    })
    .layout();
    
    return textboxB;
};

/////////button labels////////////////////////////
var createLabelB = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, 0x5e81a2),
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