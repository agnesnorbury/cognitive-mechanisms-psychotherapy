// import task info from versionInfo file
import { nBlocksLearning, debugging, allowDevices } from "./versionInfo.js"; 
import { trials } from "./trials.js"; 
 
// import our data saving function
import { saveTaskData, saveQuestData } from "./saveData.js";

// import jspsych object so can access modules
import { jsPsych } from "./constructStudy.js";

// initialize task vars
var nTrialsChoice;
var nTrialsLearning;
var timeBeforeChoice = 750;         // time in ms before choice can be entered
var trialTimeoutTime;               // time in ms after which trial times out
var feedbackTime = 2500;            // time in ms feedback is displayed on screen
var nTimeouts = 0;
var blockNo = 0;
var trialEvents;
var trialValence;
var trialAttrIntGlob;
var trialAttrIntSpec;
var trialAttrExtGlob;
var trialAttrExtSpec;
var scenarioColours = ["#D5D6EA", "#D7ECD9", "#F6F6EB"];

// initialize intervention condition variables (can be "baseline", "control", or "psychoed")
var taskType;                
let taskNo = 0;

// grab trial info
trialEvents = trials.events;
trialValence = trials.event_valence;
trialAttrIntGlob = trials.int_glob;
trialAttrIntSpec = trials.int_spec;
trialAttrExtGlob = trials.ext_glob;
trialAttrExtSpec = trials.ext_spec

// separate out items into choice and learning trials 
// choice trials are composed of interleaved top 64 discriminability items, aross internal and global outcome measures: the 2 versions are balance in valence and interpersonal content
var choice_items_1 = [0,   1,   2,   3,   5,   7,   8,  13,  15,  17,  18,  22,  24,  32,  39,  41,  43,  54,  62,  68,  72,  74,  79,  93,  99, 101, 104, 105, 112, 113, 116, 127];
var choice_items_2 = [11,  21,  25,  28,  29, 31,  35,  37,  44,  45,  47,  53,  55,  56,  59,  61,  67,  73,  75,  76,  77,  78,  83,  84,  97, 100, 102, 108, 110, 115, 120, 125];
// learning trials are ordered to produce 3 blocks of 20 trials, balanced in terms of valence and interpersonal content
var learning_items = [4,6,9,10,12,14,16,19,20,23,26,27,30,33,49,36,38,111,42,46,48,126,50,51,52,57,58,60,63,64,65,66,69,70,71,80,81,82,85,86,87,88,89,90,91,92,94,95,96,98,103,34,107,119,121,114,117,118,109,40];

// set number of trials, blocklength, and max trial length according to debug condition
if (debugging == false) {
    nTrialsLearning = learning_items.length;
    trialTimeoutTime = 15000;
} else {
    nTrialsLearning = 12;
    trialTimeoutTime = 4000;
}
var blockLengthLearning = Math.round(nTrialsLearning/nBlocksLearning); 

///////////////////////////////////////////// LEARNING TASK TIMELINE /////////////////////////////////////////////////////////
var timeline_learning = [];

// define trial stimuli and choice array for use as a timeline variable 
var events_causes_learning = [];
for ( var i = 0; i < nTrialsLearning; i++ ) {
    var itemNo = learning_items[i];
    events_causes_learning[i] = { 
                               trialIndex: i,
                               stimulus: trialEvents[itemNo],
                               valence: trialValence[itemNo],
                               intGlob: trialAttrIntGlob[itemNo],
                               intSpec: trialAttrIntSpec[itemNo],
                               extGlob: trialAttrExtGlob[itemNo],
                               extSpec: trialAttrExtSpec[itemNo],
                               itemNo: itemNo,
                               blockNo: null,
                               choice1: null,
                               choice2: null,
                               correct_answer: null };
    if ( i <= blockLengthLearning-1 ) {
        events_causes_learning[i].choice1 = trialAttrIntGlob[itemNo];
        events_causes_learning[i].choice2 = trialAttrIntSpec[itemNo];
        if ( trialValence[itemNo] == "negative") {
            events_causes_learning[i].correct_answer = trialAttrIntSpec[itemNo];
        } else {
            events_causes_learning[i].correct_answer = trialAttrIntGlob[itemNo];
        }
        events_causes_learning[i].blockNo = 1;
    } else if ( i <= blockLengthLearning*2-1 ) {
        events_causes_learning[i].choice1 = trialAttrIntGlob[itemNo];
        events_causes_learning[i].choice2 = trialAttrExtGlob[itemNo];
        if ( trialValence[itemNo] == "negative") {
            events_causes_learning[i].correct_answer = trialAttrExtGlob[itemNo];
        } else {
            events_causes_learning[i].correct_answer = trialAttrIntGlob[itemNo];
        }
        events_causes_learning[i].blockNo = 2;
    } else if ( i <= blockLengthLearning*3-1 ) {
        events_causes_learning[i].choice1 = trialAttrIntGlob[itemNo];
        events_causes_learning[i].choice2 = trialAttrExtSpec[itemNo];
        if ( trialValence[itemNo] == "negative") {
            events_causes_learning[i].correct_answer = trialAttrExtSpec[itemNo];
        } else {
            events_causes_learning[i].correct_answer = trialAttrIntGlob[itemNo];
        }
        events_causes_learning[i].blockNo = 3;
    }
};

// define individual choice trials
var learningTrialNo = 0;
var learning_choice_types = ['choice1', 'choice2'];
var learning_trial = {
    // jsPsych plugin to use
    type: jsPsychHtmlButtonResponseCA,
    // trial info
    prompt: null,  
    stimulus: function () {
        var stim = "<p style='font-size:30px; font-weight: bold;'>"+jsPsych.timelineVariable('stimulus')+"</p>"+
                   "<div class='center-content'><img src='../assets/imgs/head_why.png' style='width:200px;'></img></div>";  // placeholder for fb img
        return stim;
    },
    choices: function () {
        var display_order = jsPsych.randomization.repeat(learning_choice_types, 1);
        var choices_ordered = [ jsPsych.timelineVariable(display_order[0]), 
                                jsPsych.timelineVariable(display_order[1]) ];
        return choices_ordered;
    },
    save_trial_parameters: {
        choices: true
    },
    // trial timing
    trial_duration: trialTimeoutTime,       // after this time, move on to next trial (but trial re-added)
    stimulus_duration: null,                // stim text remains on screen indefinitely
    time_before_choice: timeBeforeChoice,   // time in ms before the ppt can enter a choice
    response_ends_trial: true,              // trial ends only when response entered
    time_after_choice: 750,                 // time in ms to leave trial info on screen following choice
    post_trial_gap: 0,                     
    // styling
    margin_vertical: '0px',                 // vertical margin of the button (px)
    margin_horizontal: '20px',              // horizontal margin of the button (px)
    button_html: function() {
        var cloud_button =  "<div class='thought'>%choice%</div>";  // our custom 'thought cloud' css button
        return cloud_button;
    },
    // at end of each trial
    on_finish: function(data, trial) {
        // add chosen interpretation type to output
        data.stimulus = jsPsych.timelineVariable('stimulus');
        data.valence = jsPsych.timelineVariable('valence');
        data.itemNo = jsPsych.timelineVariable('itemNo'); 
        data.trialNo = learningTrialNo;
        data.blockNo = jsPsych.timelineVariable('blockNo'); 
        // did participant enter a choice for the trial?
        if (data.response == null) {
            // if the participant didn't respond...
            data.timedout = true;
            data.correct = null;
            data.chosen_attr_type = null;
            //nTrials++;
            nTimeouts++;
        } else {
            // if the participant responded...
            data.timedout = false;
            // was chosen attribution the 'correct' option?
            data.chosen_attr = data.choices[data.response];
            if ( data.chosen_attr == jsPsych.timelineVariable('correct_answer')) {
                data.correct = 1;
            } else {
                data.correct = 0;
            };
            // what attribution type was chosen?
            data.chosen_attr_type = '';
            if ( data.chosen_attr == jsPsych.timelineVariable('intGlob') ) {
                data.chosen_attr_type = "internal_global";
            } else if ( data.chosen_attr  == jsPsych.timelineVariable('intSpec') ) {
                data.chosen_attr_type = "internal_specific";
            } else if ( data.chosen_attr == jsPsych.timelineVariable('extGlob') ) {
                data.chosen_attr_type = "external_global";
            } else if ( data.chosen_attr  == jsPsych.timelineVariable('extSpec') ) {
                data.chosen_attr_type = "external_specific";
            }; 
        }
        data.nTimeouts = nTimeouts;
        // save data and increment trial number
        var respData = jsPsych.data.getLastTrialData().trials[0];
        saveTaskData("learningTask_"+learningTrialNo, respData);
        learningTrialNo++;
        // // manually update progress bar so just reflects task progress
        // var curr_progress_bar_value = this.type.jsPsych.getProgressBarCompleted();
        // this.type.jsPsych.setProgressBar(curr_progress_bar_value + 1/nTrials);
    }
};

var feedback = {
    type: jsPsychHtmlButtonResponse,
    is_html: true,
    // display previous choice options
    choices: function () {
        var prev_data = jsPsych.data.getLastTrialData().trials[0];
        return prev_data.choices;
    },
    button_html: function() {
        var cloud_button =  "<div class='thought'>%choice%</div>";  // our custom 'thought cloud' css button
        var prev_data = jsPsych.data.getLastTrialData().trials[0];
        if ( prev_data.timedout == false ) {
            return cloud_button;
        } else {
            return "";
        }
    },
    // highlight correct response in green text
    on_load: function () {
        var prev_data = jsPsych.data.getLastTrialData().trials[0];
        if ( prev_data.timedout == false & prev_data.choices[0] == jsPsych.timelineVariable('correct_answer') ) {
            document.getElementById('jspsych-html-button-response-button-0').style.color = 'green';
        } else if ( prev_data.timedout == false ) {
            document.getElementById('jspsych-html-button-response-button-1').style.color = 'green';
        }
    },
    // and give response-contingent feedback
    stimulus: function () {
        var prev_data = jsPsych.data.getLastTrialData().trials[0];
        var stim_fb;
        if ( prev_data.timedout == false & prev_data.correct == 1 ) {
            stim_fb = "<p style='font-size:30px; font-weight: bold;'>"+jsPsych.timelineVariable('stimulus')+"</p>"+
                          "<div class='center-content'><img src='../assets/imgs/head_correct.png' style='width:200px;'></img></div>";
        } else if ( prev_data.timedout == false ) {
            stim_fb = "<p style='font-size:30px; font-weight: bold;'>"+jsPsych.timelineVariable('stimulus')+"</p>"+
                          "<div class='center-content'><img src='../assets/imgs/head_incorrect.png' style='width:200px;'></img></div>"; 
        } else {
            stim_fb = "<p style='font-size:30px; font-weight: bold; color: red;'><br> You didn't choose in time!<br></p>"
        }
        return stim_fb;
    },
    // feedback displayed for set amount of time for all outcome types
    trial_duration: feedbackTime,           // feedback displayed for this time
    response_ends_trial: false,             // despite any participant repsonses
    stimulus_duration: feedbackTime,        // feedback displayed for this time
    post_trial_gap: 750                     // post trial gap (ITI)              
};

// define intro text screen
var task_intro = {
    type: jsPsychHtmlButtonResponse,
    choices: ['start'],
    is_html: true,
    stimulus: function () {
        var stim_br = ("<p><h2>Welcome to the task</h2></p>"+
                    "<br>"+
                    "<p>"+
                    "<b>You are now ready to start learning about the first scenario</b>."+
                    "</p>"+
                    "<p>"+
                    "Remember, each scenario can be be thought of as representing a <i>a different "+
                    "kind of mood a person can be in.</i>"+
                    "</p>"+
                    "<p>"+
                    "Press the button below when you are ready to start!</b>. "+
                    "</p>"+
                    "<br><br><br>"+
                    "</p>")
        return stim_br;
    },
    on_start: function () {
        document.body.style.background = scenarioColours[blockNo];
        blockNo++;
    }
};

// define free text description screen (at end of block)
var freeTextFeedback = {
    type: jsPsychSurvey,
    pages: [
    [
      {
        type: 'text',
        prompt: `Please describe your general impression of the correct reasons for NEGATIVE EVENTS 
                 during the previous scenario. A single phrase or sentence is fine!`, 
        name: 'answer_neg', 
        textbox_rows: 2,
        textbox_columns: 60,
        required: true
      },
      {
        type: 'text',
        prompt: `Now, please describe your general impression of the correct reasons for POSITIVE EVENTS 
                during the previous scenario.`, 
        name: 'answer_pos', 
        textbox_rows: 2,
        textbox_columns: 60,
        required: true
      },
    ]
    ],
    button_label_finish: 'submit answer',
    on_finish: function() {
        // get response and RT data
        var respData = jsPsych.data.getLastTrialData().trials[0].response;
        var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
        saveQuestData(["freeText_block"+blockNo], respData, respRT);
    }
};

// define cause rating screen (for at the start then after each block)
var causeRatingNeg = {
    type: jsPsychHtmlMultiSliderResponse,
    stimulus: function () {
        var stim_text;
        if ( blockNo == 0 ) {
            stim_text = `<div style="width:750px;">
            <h2> Before you start! </h2>
            <p>Before you start the task, we'd like you to <b>think about something NEGATIVE
            that happened to you over the past few weeks</b>. For example, 
            something that didn’t go the way you would have liked it to at work, or in a social situation.</p>
            <p>How would you describe the main reasons behind this event on the below scales?</p>
            <p>Click and drag the sliders below until you are happy with your answer,
            then press the 'enter answer' button to continue. You will have to move all the sliders 
            before your answer can be entered.</p>
            <p><b>The NEGATIVE event was caused...</b></p>
            </div>`; 
        } else {
            stim_text = `<div style="width:750px;">
            <p><b> Still thinking about the previous mood scenario, how would you describe  
            the kind of reasons thought to be behind NEGATIVE events on the below scales?</b></p>
            <p>Click and drag the sliders below until you are happy with your answer,
            then press the 'enter answer' button to continue. You will have to move all the sliders 
            before your answer can be entered.</p>
            <p><b>The NEGATIVE events were thought to be caused...</b></p>
            </div>`; 
        }
        return stim_text;
    },
    require_movement: true,
    labels: [ ["completely by other people or circumstances", 
               'completely by myself'],
              ['by things related to the specific circumstances', 
               'by things that affect all areas of my life']
    ],
    button_label: 'enter answer',
    //min: 1, max: 100, slider_start: 50,  // default values
    slider_width: 500,                     // width in px, if null, sets equal to widest element of display
    on_finish: function() {
    // get response and RT data
        var respData = jsPsych.data.getLastTrialData().trials[0].response;
        var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
        saveQuestData(["ratings_neg_block"+blockNo], respData, respRT);
    }
};
var causeRatingPos = {
    type: jsPsychHtmlMultiSliderResponse,
    stimulus: function () {
        var stim_text;
        if ( blockNo == 0 ) {
            stim_text = `<div style="width:750px;">
            <h2> Before you start! </h2>
            <p>Next, we'd like you to <b>think about something POSITIVE
            that happened to you over the past few weeks</b>. For example, 
            something that went well at work, socially, or when taking part in a leisure or hobby activity.</p>
            <p>How would you describe the main reasons behind this event on the below scales?</p>
            <p>Click and drag the sliders below until you are happy with your answer,
            then press the 'enter answer' button to continue. You will have to move all the sliders 
            before your answer can be entered.</p>
            <p><b>The POSITIVE event was caused...</b></p>
            </div>`; 
        } else {
            stim_text = `<div style="width:750px;">
            <p><b> Still thinking about the previous mood scenario, how would you describe  
            the kind of reasons thought to be behind POSITIVE events on the below scales?</b></p>
            <p>Click and drag the sliders below until you are happy with your answer,
            then press the 'enter answer' button to continue. You will have to move all the sliders 
            before your answer can be entered.</p>
            <p><b>The POSITIVE events were thought to be caused...</b></p>
            </div>`; 
        }
        return stim_text;
    },
    require_movement: true,
    labels: [ ["completely by other people or circumstances", 
               'completely by myself'],
              ['by things related to the specific circumstances', 
               'by things that affect all areas of my life']
    ],
    button_label: 'enter answer',
    //min: 1, max: 100, slider_start: 50,  // default values
    slider_width: 500,                     // width in px, if null, sets equal to widest element of display
    on_finish: function() {
    // get response and RT data
        var respData = jsPsych.data.getLastTrialData().trials[0].response;
        var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
        saveQuestData(["ratings_pos_block"+blockNo], respData, respRT);
    }
};
// var causeRatingLikeMe = {
//     type: jsPsychHtmlMultiSliderResponse,
//     stimulus: (`<div style="width:750px;">
//                 <p>Finally, would you describe the kind of reasons that were were correct  
//                 in the previous scenario to be <b>similar</b> or <b>not similar</b> to the way 
//                 <b>you tend to think about things</b>?</p>
//                 </div>`),
//     require_movement: true,
//     labels: [ ["completely UNLIKE the way I think", 
//                'completely LIKE the way I think']
//     ],
//     button_label: 'enter answer',
//     //min: 1, max: 100, slider_start: 50,  // default values
//     slider_width: 500,                     // width in px, if null, sets equal to widest element of display
//     on_finish: function() {
//     // get response and RT data
//         var respData = jsPsych.data.getLastTrialData().trials[0].response;
//         var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
//         saveQuestData(["ratings_likeMe_block"+blockNo], respData, respRT);
//     }
// };

// define break screen (between blocks)
var takeABreak = {
    type: jsPsychHtmlButtonResponse,
    choices: ['continue'],
    is_html: true,
    stimulus: function () {
        var stim_br;
        if ( blockNo < nBlocksLearning) {
            stim_br = ("<p><h2>Well done!</h2></p>"+
                        "<br>"+
                        "<p>"+
                        "You are <b>now finished with this scenario</b>!"+
                        "</p>"+
                        "<p>"+
                        "When you are ready, <b>press continue to move " +
                        "on</b>. "+
                        "</p>"+
                        "<p>"+
                        "Remember, each scenario represents a different kind of mood a person can be in. "+
                        "</p>"+
                        "<p>"+
                        "The kinds of reasons thought to be behind events in the new scenario may be different "+
                        "to the kinds of reasons thought to be correct during the previous scenario."+
                        "</p>"+
                        "<br><br><br>"+
                        "</p>")
        } else {
            stim_br = ("<p><h2>Well done!</h2></p>"+
                        "<br>"+
                        "<p>"+
                        "You are <b>now finished with this scenario</b>!"+
                        "</p>"+
                        "<p>"+
                        "When you are ready, <b>press continue to move " +
                        "on</b>. "+
                        "</p>"+
                        "<br><br><br>"+
                        "</p>")
        }
        return stim_br;
    },
    on_finish: function () {
        // change background colour to indicate new scenario and increment blockNo
        document.body.style.background = scenarioColours[blockNo];
        blockNo++;
    }
};

// if trial timed out, loop trial and feedback again until participant responds
var learning_trial_node = {
    timeline: [ learning_trial, feedback ],
    loop_function: function () {
        var prev_trial_to = jsPsych.data.getLastTimelineData().trials[0].timedout;
        if ( prev_trial_to == true ) {
            return true; 
        } else {
            return false; 
        }
    }
};

// display these screens if at the end of a block
var learning_break_node = {
    timeline: [ freeTextFeedback, causeRatingNeg, causeRatingPos, takeABreak ],
    conditional_function: function () {
        var trialIndex = jsPsych.timelineVariable('trialIndex')                // use trialIndex not absolute trialNo
        if ( (trialIndex+1) % blockLengthLearning == 0  && trialIndex !=nTrialsLearning ) {
            return true;
        } else {
            return false;
        }
    }
};

// finally, define the whole set of choice trials based on above logic and timeline variables
var learning_trials = {
    timeline: [ learning_trial_node, learning_break_node ],
    timeline_variables: events_causes_learning         
};

///////////////////////////////////////////// CONCAT ////////////////////////////////////////////////////////
timeline_learning.push(causeRatingNeg);
timeline_learning.push(causeRatingPos);
timeline_learning.push(task_intro);
timeline_learning.push(learning_trials);        
 
export { timeline_learning };
