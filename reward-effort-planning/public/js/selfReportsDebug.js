// Script to run a series of self-report questionnaires, using build in JsPsych functionality

// import data saving functions
// import { nQuests} from "./versionInfo.js";
// import { saveQuestData } from "./saveData.js";

///////////////////////////////////////////// MISC TEXT /////////////////////////////////////////////////////////
var introText = {
  type: jsPsychHtmlButtonResponse,
  choices: ['start questionnaires'],
  is_html: true,
  stimulus: ("<p>"+
            "For the final part of the study, we would like to ask you to answer some questions about "+
            "your feelings, mood, and personal circumstances. "+
            "</p>"+
            "<p>"+
            "We appreciate that filling in these kinds of questionnaires can be a bit boring and repetitive, "+
            "but it is really important for the aims of our study that you answer each question as "+
            "accurately and truthfully as possible. This will allow us to learn as much as possible "+
            "from the data you have provided during the other parts of the study. "+
            "</p>"+
            "<p>"+
            "In order to make this possible, we have tried to allow plenty of time in the study "+
            "completion estimate. We will be monitoring as we go along how much time people "+
            "need to complete the questionnaires, to check this is sufficient. If you felt that we did not allow "+
            "enough time for you to answer carefully, please let us know!"+
            "</p>"+
            "<p>"+
            //"For this particular experiment, we will ask you to complete "+nQuests+" short questionnaires"+
            "about your feelings and mood. "+
            "For this particular experiment, we will ask you to complete 3 short questionnaires "+
            "about your feelings and mood. "+
            "</p>"+
            "<p>"+
            "<b>The 'progress' bar at the top of the page shows you how far you are through all the questions.</b>"+
            "</p>")
};

var endScreen = {
  type: jsPsychHtmlButtonResponse,
  timing_post_trial: 0,
  choices: ['finish the study'],
  is_html: true,
  stimulus: ("<p>"+
            "Thank you very much for your time. You have now finished the study."+
            "</p>"+
            "<p>"+
            "<b>Please click the button below to submit your data back to Prolific!</b>"+
            "</p>"),
  // on_start: function(){
  //   // // record time ended questionnaires
  //   // var questEndTime = new Date().toLocaleTimeString();
  //   // db.collection('tasks').doc('rew-eff').collection(version).doc(uid).collection('quest-data').doc('data').set({questEndTime: questEndTime});
  // },
  on_finish: function(){ window.location = "https://app.prolific.co/submissions/complete?cc=7BD92407"; } // redirect to study completion page 
};  

///////////////////////////////////////////// SCALES /////////////////////////////////////////////////////////
var scaleDisplayWidth = 600;  // in px

//////////////////////////// PHQ9 ///////////////////////
// define response labels
var respOptsPHQ9 = ["Not at all", "Several days", "More than half the days", "Nearly every day"];
var respOptsPHQ9Difficulty = ["Not difficult at all", "Somewhat difficult", "Very difficult", "Extremely difficult"];

// scale items
var PHQ9 = {
  type: jsPsychSurveyLikert,
  preamble: ("Over the <b>last two weeks</b>, how often have you been bothered by any of the following problems?"),
  questions: [
    {prompt: "<b>Little interest or pleasure in doing things</b>", 
      name: "PHQ9_1", labels: respOptsPHQ9, required:true, horizontal: true}, 
    {prompt: "<b>Feeling down, depressed, or hopeless</b>", 
      name: "PHQ9_2", labels: respOptsPHQ9, required: true, horizontal: true},
    // {prompt: "<b>Trouble falling/staying asleep, sleeping too much</b>", 
    //   name: "3", labels: respOptsPHQ9, required:true, horizontal: true},
    // {prompt: "<b>Feeling tired or having little energy</b>", 
    //   name: "PHQ9_4", labels: respOptsPHQ9, required:true, horizontal: true},
    // {prompt: "<b>Poor appetite or overeating</b>", 
    //   name: "PHQ9_5", labels: respOptsPHQ9, required:true, horizontal: true},
    // {prompt: "<b>Feeling bad about yourself or that you are a failure or have let yourself or your family down</b>", 
    //   name: "PHQ9_6", labels: respOptsPHQ9, required:true, horizontal: true},
    // {prompt: "<b>Trouble concentrating on things, such as reading the newspaper or watching television.</b>", 
    //   name: "PHQ9_7", labels: respOptsPHQ9, required:true, horizontal: true},
    // {prompt: "<b>Moving or speaking so slowly that other people could have noticed.\n"+
    //         "Or the opposite; being so fidgety or restless that you have been moving around a lot more than usual.</b>", 
    //   name: "PHQ9_8", labels: respOptsPHQ9, required:true, horizontal: true},
    // {prompt: "<b>Thoughts that you would be better off dead or of hurting yourself in some way.</b>", 
    //   name: "PHQ9_9", labels: respOptsPHQ9, required:true, horizontal: true},
    // {prompt: "If you have been bothered by any of the above, how difficult have these problems "+
    //          "made it for you to do your work, take care of things at home, or get along with other people?", 
    //   name: "PHQ9_D", labels: respOptsPHQ9Difficulty, required:true, horizontal: true}
  ],
  button_label: 'continue',
  scale_width: scaleDisplayWidth,  
  on_finish: function(){ 
    var respData = jsPsych.data.getLastTrialData().select('responses').values;
    console.log(jsPsych.data.get(LastTrialData()));
    console.log(jsPsych.data.get().select('rt').values);
    //saveQuestData("PHQ9", respData);
  }
};

//////////////////////////// SHAPS ///////////////////////
// define response labels
var respOptsSHAPS = ["Strongly disagree", "Disagree", "Agree", "Strongly agree"];

// scale items
var SHAPS = {
  type: jsPsychSurveyLikert,
  preamble: ("For each statement below, please select how much you agree or disagree, "+
             "depending on <b>how you have generally felt over the past two weeks</b>"),
  questions: [
    {prompt: "<b>I would enjoy my favourite television or radio programme.</b>", 
    name: "SHAPS_1", labels: respOptsSHAPS, required:true, horizontal: true}, 
    {prompt: "<b>I would enjoy being with my family or close friends.</b>", 
    name: "SHAPS_2", labels: respOptsSHAPS, required: true, horizontal: true},
    {prompt: "<b>I would find pleasure in my hobbies and pastimes.</b>", 
    name: "SHAPS_3", labels: respOptsSHAPS, required:true, horizontal: true},
    // {prompt: "<b>I would be able to enjoy my favourite meal.</b>", 
    // name: "SHAPS_4", labels: respOptsSHAPS, required:true, horizontal: true},
    // {prompt: "<b>I would enjoy a warm bath or refreshing shower.</b>", 
    // name: "SHAPS_5", labels: respOptsSHAPS, required:true, horizontal: true,},
    // {prompt: "<b>I would find pleasure in the scent of flowers or the smell of a fresh sea breeze or freshly baked bread.</b>", 
    // name: "SHAPS_6", labels: respOptsSHAPS, required:true, horizontal: true},
    // {prompt: "<b>I would enjoy seeing other people's smiling faces.</b>", 
    // name: "SHAPS_7", labels: respOptsSHAPS, required:true, horizontal: true},
    // {prompt: "<b>I would enjoy looking smart when I have made an effort with my appearance.</b>", 
    // name: "SHAPS_8", labels: respOptsSHAPS, required:true, horizontal: true},
    // {prompt: "<b>I would enjoy reading a book, magazine or newspaper.</b>", 
    // name: "SHAPS_9", labels: respOptsSHAPS, required:true, horizontal: true},
    // {prompt: "<b>I would enjoy a cup of tea or coffee or my favorite drink.</b>", 
    // name: "SHAPS_10", labels: respOptsSHAPS, required:true, horizontal: true},
    // {prompt: "<b>I would find pleasure in small things, e.g. bright sunny day, a telephone call from a friend.</b>", 
    // name: "SHAPS_11", labels: respOptsSHAPS, required:true, horizontal: true},
    // {prompt: "<b>I would be able to enjoy a beautiful landscape or view.</b>", 
    // name: "SHAPS_12", labels: respOptsSHAPS, required:true, horizontal: true},
    // {prompt: "<b>I would get pleasure from helping others.</b>", 
    // name: "SHAPS_13", labels: respOptsSHAPS, required:true, horizontal: true},
    // {prompt: "<b>I would feel pleasure when I receive praise from other people.</b>", 
    // name: "SHAPS_14", labels: respOptsSHAPS, required:true, horizontal: true}
  ],
  button_label: 'continue',
  scale_width: scaleDisplayWidth,
  on_finish: function(){ 
    var respData = jsPsych.data.getLastTrialData().select('responses').values;
    console.log(respData);
  }
};

///////////////////////////////////////////// AMI /////////////////////////////////////////////////////////
// define response labels
var respOptsAMI = ["Completely UNTRUE", "Mostly untrue", "Neither true nor untrue", "Quite true", "Completely TRUE"];

// scale items
var AMI = {
  type: jsPsychSurveyLikert,
  preamble: ("<p>"+
             "For each statement below, please select how appropriately it describes you. "+
             "</p>"+
             "<p>"+
             "Select <i>Completely true</i> if the statement describes you perfectly, and <i>Completely "+
             "untrue</i> if the statement does not describe you at all, "+
             "thinking about <b>the last two weeks</b>. "+
             "</p>"),
  questions: [
    {prompt: "<b>I feel sad or upset when I hear bad news.</b>", 
    name: "AMI_1", labels: respOptsAMI, required:true, horizontal: true}, 
    {prompt: "<b>I start conversations with random people.</b>", 
    name: "AMI_2", labels: respOptsAMI, required: true, horizontal: true},
    // {prompt: "<b>I enjoy doing things with people I have just met.</b>", 
    // name: "AMI_3", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>I suggest activities for me and my friends to do.</b>", 
    // name: "AMI_4", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>I make decisions firmly and without hesitation.</b>", 
    // name: "AMI_5", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>After making a decision, I will wonder if I have made the wrong choice.</b>", 
    // name: "AMI_6", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>Based on the last two weeks, I would say I care deeply about how my loved ones think of me.</b>", 
    // name: "AMI_7", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>I go out with friends on a weekly basis.</b>", 
    // name: "AMI_8", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>When I decide to do something, I am able to make an effort easily.</b>", 
    // name: "AMI_9", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>I don't like to laze around.</b>", 
    // name: "AMI_10", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>I get things done when they need to be done, without requiring reminders from others.</b>", 
    // name: "AMI_11", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>When I decide to do something, I am motivated to see it through to the end.</b>", 
    // name: "AMI_12", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>I feel awful if I say something insensitive.</b>", 
    // name: "AMI_13", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>I start conversations without being prompted.</b>", 
    // name: "AMI_14", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>When I have something I need to do, I do it straightaway so it is out of the way.</b>", 
    // name: "AMI_15", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>I feel bad when I hear an acquaintance has an accident or illness.</b>", 
    // name: "AMI_16", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>I enjoy choosing what to do from a range of activities.</b>", 
    // name: "AMI_17", labels: respOptsAMI, required:true, horizontal: true},
    // {prompt: "<b>If I realise I have been unpleasant to someone, I will feel terribly guilty afterwards.</b>", 
    // name: "AMI_18", labels: respOptsAMI, required:true, horizontal: true}
  ],
  button_label: 'continue',
  scale_width: scaleDisplayWidth,
  on_finish: function(){ 
    var respData = jsPsych.data.getLastTrialData().select('responses').values;
    console.log(respData);
  }
};


///////////////////////////////////////////// AMI /////////////////////////////////////////////////////////
// init jsPsych
var jsPsych = initJsPsych({
  show_progress_bar: true,
  message_progress_bar: 'progress'
});

// create global jsPysch object which defines what the participant wil see in what order
var timeline = [];      
timeline.push(introText);
timeline.push(PHQ9);
timeline.push(SHAPS);
timeline.push(AMI);
timeline.push(endScreen);

// run timeline
// export function runQuests() {
jsPsych.run(timeline); 
// };
