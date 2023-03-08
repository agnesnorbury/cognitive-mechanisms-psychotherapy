// import task info from versionInfo file
import { nBlocksChoice, debugging, allowDevices } from "./versionInfo.js"; 
import { trials } from "./trials.js"; 

// import our data saving function
import { saveTaskData, saveQuestData } from "./saveData.js";

// import jspsych object so can access modules
import { jsPsych } from "./constructStudy.js";

// initialize task vars
var nTrialsChoice;          
var blockNo = 0;
var nRepeatTrials = 3;                  // only if using self-consistency check
var trialTimeoutTime;                   // only if using trial time-outs
var nTimeouts = 0;                      // only if using trial time-outs
var trialEvents;
var trialValence;
var trialAttrIntGlob;
var trialAttrIntSpec;
var trialAttrExtGlob;
var trialAttrExtSpec;

// initialize task no        
var taskNo = 0;

// grab trial info
trialEvents = trials.events;
trialValence = trials.event_valence;
trialAttrIntGlob = trials.int_glob;
trialAttrIntSpec = trials.int_spec;
trialAttrExtGlob = trials.ext_glob;
trialAttrExtSpec = trials.ext_spec

// separate items into choice and learning trials 
// choice trials are composed of interleaved top 64 discriminability items, aross internal and global outcome measures: the 2 versions are balance in valence and interpersonal content
var choice_items_1 = [0,   1,   2,   3,   5,   7,   8,  13,  15,  17,  18,  22,  24,  32,  39,  41,  43,  54,  62,  68,  72,  74,  79,  93,  99, 101, 104, 105, 112, 113, 116, 127];
var choice_items_2 = [11,  21,  25,  28,  29, 31,  35,  37,  44,  45,  47,  53,  55,  56,  59,  61,  67,  73,  75,  76,  77,  78,  83,  84,  97, 100, 102, 108, 110, 115, 120, 125];
// learning trials are ordered to produce 3 blocks of 20 trials, balanced in terms of valence and interpersonal content
var learning_items = [4,6,9,10,12,14,16,19,20,23,26,27,30,33,49,36,38,111,42,46,48,126,50,51,52,57,58,60,63,64,65,66,69,70,71,80,81,82,85,86,87,88,89,90,91,92,94,95,96,98,103,34,107,119,121,114,117,118,109,40];

// set number of trials, blocklength, and max trial length according to debug condition
if (debugging == false) {
    nTrialsChoice = choice_items_1.length;
    //trialTimeoutTime = 15000;
} else {
    nTrialsChoice = 6;
    //trialTimeoutTime = 4000;
}
var blockLengthChoice = Math.round(nTrialsChoice/nBlocksChoice); 

///////////////////////////////////////////// CHOICE TASK TIMELINE /////////////////////////////////////////////////////////
// define trial stimuli and choice arrays for use as a timeline variable 
//var choice_items_1_shuffled = shuffle(choice_items_1, 1);
var events_causes_choice_1 = [];
//for (var i = 0; i < (nTrialsChoice - nRepeatTrials); i++ ) {
for (var i = 0; i < nTrialsChoice; i++ ) {
    var itemNo = choice_items_1[i];
    events_causes_choice_1[i] = { stimulus: trialEvents[itemNo],
                                  valence: trialValence[itemNo],
                                  intGlob: trialAttrIntGlob[itemNo],
                                  intSpec: trialAttrIntSpec[itemNo],
                                  extGlob: trialAttrExtGlob[itemNo],
                                  extSpec: trialAttrExtSpec[itemNo],
                                  itemNo: itemNo,
                                  trialIndex: i,
                                  taskNo: taskNo };
};
// // add repeat items for self-consistency testing
// var repeatTrials1 = events_causes_choice_1.slice(0, nRepeatTrials);
// events_causes_choice_1 = events_causes_choice_1.concat(repeatTrials1);   // add first 4 events again

var events_causes_choice_2 = [];
for (var i = 0; i < nTrialsChoice; i++ ) {
    var itemNo = choice_items_2[i];
    events_causes_choice_2[i] = { stimulus: trialEvents[itemNo],
                                  valence: trialValence[itemNo],
                                  intGlob: trialAttrIntGlob[itemNo],
                                  intSpec: trialAttrIntSpec[itemNo],
                                  extGlob: trialAttrExtGlob[itemNo],
                                  extSpec: trialAttrExtSpec[itemNo],
                                  itemNo: itemNo,
                                  trialIndex: i,
                                  taskNo: taskNo };
};

// define individual choice trials
var choiceTrialNo = 0;
var choice_types = ['intGlob', 'intSpec', 'extGlob', 'extSpec'];
var choice_trial = {
    // jsPsych plugin to use
    type: jsPsychHtmlButtonResponseCA,
    // trial info
    prompt: null,
    stimulus: () => {
        var stim = "<p style='font-size:30px; font-weight: bold;'>"+jsPsych.timelineVariable('stimulus')+"</p>"+
                   "<div class='center-content'><img src='../assets/imgs/head_why.png' style='width:200px;'></img></div>";  // placeholder for fb img
        return stim;
    },
    choices: function () {
        var display_order = jsPsych.randomization.repeat(choice_types, 1);
        var choices_ordered = [ jsPsych.timelineVariable(display_order[0]), 
                                jsPsych.timelineVariable(display_order[1]), 
                                jsPsych.timelineVariable(display_order[2]), 
                                jsPsych.timelineVariable(display_order[3]) ];
        return choices_ordered;
    },
    save_trial_parameters: {
        choices: true
    },
    // // trial timing - timeout version
    // trial_duration: trialTimeoutTime,       // after this time, move on to next trial (but trial re-added)
    // stimulus_duration: null,                // stim text remains on screen indefinitely
    // time_before_choice: 750,                // time in ms before the ppt can enter a choice
    // response_ends_trial: true,              // trial ends only when response entered
    // time_after_choice: 750,                 // time in ms to leave trial info on screen following choice
    // post_trial_gap: 0,                      // time in ms, between the current trial and the next trial
    // // trial timing - infinite wait version
    trial_duration: null,                   // wait indefinitely for response
    stimulus_duration: null,                // stim text remains on screen indefinitely
    time_before_choice: 1500,               // time in ms before the ppt can enter a choice
    response_ends_trial: true,              // trial ends only when response entered
    time_after_choice: 750,                 // time in ms to leave trial info on screen following choice
    post_trial_gap: 750,                    // time in ms, between the current trial and the next trial                   
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
        data.taskNo = jsPsych.timelineVariable('taskNo'); 
        data.trialNo = choiceTrialNo;
        // did participant enter a choice for the trial?
        if (data.response == null) {
            // if the participant didn't respond...
            data.timedout = true;
            data.chosen_attr_type = null;
            nTimeouts++;
        } else {
            // if the participant responded...
            data.timedout = false;
            data.chosen_attr = data.choices[data.response];
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
        saveTaskData("choiceTask"+taskNo+"_"+choiceTrialNo, respData);
        choiceTrialNo++;
        // // manually update progress bar so just reflects task progress
        // var curr_progress_bar_value = this.type.jsPsych.getProgressBarCompleted();
        // this.type.jsPsych.setProgressBar(curr_progress_bar_value + 1/nTrials);
    }
};

// define break screen (between blocks)
var takeABreak = {
    type: jsPsychHtmlButtonResponse,
    choices: ['continue'],
    is_html: true,
    stimulus: function () {
        var stim_br;
        console.log(blockNo);
        if ( blockNo < nBlocksChoice-1) {
            stim_br = ("<p><h2>Thank you!</h2></p>"+
                        "<br>"+
                        "<p>"+
                        "You are <b>half-way through this part of the study</b>."+
                        "</p>"+
                        "<p>"+
                        "If you like, you can take a short break now. "+
                        "</p>"+
                        "<p>"+
                        "When you are ready, <b>press continue</b> " +
                        "to finish the second half of the questions. "+
                        "<br><br><br>"+
                        "</p>")
        } else {
            stim_br = ("<p><h2>Thank you!</h2></p>"+
                        "<br>"+
                        "<p>"+
                        "You are now finished with this part of the study."+
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
        // if end of final block, also increment taskNo and reset blockNo
        if ( blockNo >= nBlocksChoice-1 ) {
            taskNo++;
            choiceTrialNo = 0;
            blockNo = 0;
        } else {
            // increment blockNo
            blockNo++;
        }
    }
};

// if trial timed out, loop trial and feedback again until participant responds
var choice_trial_node = {
    timeline: [ choice_trial ],
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
var choice_break_node = {
    timeline: [ takeABreak ],
    conditional_function: function () {
        var trialIndex = jsPsych.timelineVariable('trialIndex')                // use trialIndex not absolute trialNo
        if ( (trialIndex+1) % blockLengthChoice == 0  && trialIndex !=nTrialsChoice ) {
            return true;
        } else {
            return false;
        }
    }
};

// finally, define the whole set of choice trials based on above logic and timeline variables
var choice_trials_1 = {
    timeline: [ choice_trial_node, choice_break_node ],
    timeline_variables: events_causes_choice_1     
};

var choice_trials_2 = {
    timeline: [ choice_trial_node, choice_break_node ],
    timeline_variables: events_causes_choice_2     
};

// brief re-instructions for choice test 2
var preamble_choice_2 = {
    type: jsPsychHtmlButtonResponse,
    choices: ['continue'],
    is_html: true,
    stimulus: (`
               <p><h2>Last main part of the study!</p></h2>
               <p>
               For the final main part of the study, we would like you to ask you to think
               about <b>a new set of events</b>. (This is the last time we will ask you do this!)
               </p>
               <p>
               Like the first part of the study, we would like you to read the description of each event, 
               then <b><i>select the main reason you think that event would have happened, if it actually happened 
               to you</i></b>. 
               </p>
               <p>
               For this part of the study, there are <b>no right or wrong answers</b>. All we ask if that you
               try and choose the answer that <i>most accurately reflects the main reason you think would be behind
               the event, if it happened to you right now</i>.
               </p>
               <p>
               We will again ask you to think about 32 different events. Like the first part of the study, we
               will let you know when you are half-way through, and you can take a short break then if you like.
               </p>
               <p>
               Please press the <b>continue</b> button when you are ready to start!
               </p>
               `)
};

///////////////////////////////////////////// CONCAT ////////////////////////////////////////////////////////
var timeline_choice_1 = [];
timeline_choice_1.push(choice_trials_1);

var timeline_choice_2 = [];
timeline_choice_2.push(preamble_choice_2);
timeline_choice_2.push(choice_trials_2);           
 
export { timeline_choice_1, timeline_choice_2 };  

// ////////////// non jspsych shuffle to run at the start before object init/////
// function shuffle(array) {
//   let currentIndex = array.length,  randomIndex;
//   // While there remain elements to shuffle.
//   while (currentIndex != 0) {
//     // Pick a remaining element.
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;
//     // And swap it with the current element.
//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex], array[currentIndex]];
//   }
//   return array;
// }