// import task info from versionInfo file
import { allowDevices } from "./versionInfo.js"; 
 
// import study elements
import { timeline_instructions_choice } from "./instructionsChoice.js";
import { timeline_choice_1, timeline_choice_2 } from "./taskChoice.js";
import { timeline_instructions_learning } from "./instructionsLearning.js";    
import { timeline_learning } from "./taskLearning.js";
import { timeline_intervention } from "./intervention.js";
import { timeline_PHQstate, timeline_quests } from "./selfReports.js";

//////////////////////////////////////initialise jsPsych///////////////////////////////////
var jsPsych = initJsPsych({
        show_progress_bar: false  
        // // show_progress_bar: true,      
        // message_progress_bar: 'progress',
        // auto_update_progress_bar: false
});
// export jsPsych object so can be accessed by other study modules
export { jsPsych };

////////////////////////////construct overall study timeline///////////////////////////////
export function runStudy(){

    // initialise overall study timeline
    var timeline = [];

    // construct the study timeline...
    // 1. initial instructions, choice test 1, PHQstate 1 
    timeline = timeline.concat(timeline_instructions_choice);    
    timeline = timeline.concat(timeline_choice_1);               
    timeline = timeline.concat(timeline_PHQstate);               
    // 2. learning test
    timeline = timeline.concat(timeline_instructions_learning);  
    timeline = timeline.concat(timeline_learning);                
    // 3. intervention (active or control)
    timeline = timeline.concat(timeline_intervention);           
    // 4. choice test 2, PHQstate 2 
    timeline = timeline.concat(timeline_choice_2);                   
    timeline = timeline.concat(timeline_PHQstate);               
    // 5. self-reports, debrief and study end screens
    timeline = timeline.concat(timeline_quests);                    
    
    // ...and run it!
    jsPsych.run(timeline);

}; 

///////////////////////////////////// misc functions //////////////////////////////////////
// allow access on mobile devices?
if (allowDevices == false) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
       alert("Sorry, this study does not work on mobile devices!");
    }
};

