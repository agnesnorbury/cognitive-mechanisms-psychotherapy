// Script to run a series of self-report questionnaires, using build in JsPsych functionality

// import data saving functions
import { nQuests} from "./versionInfo.js";
import { saveQuestData, saveEndData } from "./saveData.js";

///////////////////////////////////////////// MISC TEXT /////////////////////////////////////////////////////////
var introText = {
  type: jsPsychHtmlButtonResponse,
  choices: ['start questionnaires'],
  is_html: true,
  stimulus: ("<p>"+
            "<b>For the final part of the study, we will ask you to answer some questions about "+
            "your feelings, mood, and personal circumstances</b>. "+
            "</p>"+
            "<p>"+
            "We appreciate that filling in these kinds of questionnaires can sometimes feel repetitive, "+
            "but it is <i>really important for the aims of our study that you answer each question as "+
            "accurately and truthfully as possible</i>. This will allow us to learn as much as possible "+
            "from the data you have provided during the other parts of the study. "+
            "</p>"+
            "<p>"+
            "In order to make this possible, we have tried to allow plenty of time in the overall study "+
            "completion estimate. We will be monitoring as we go along how much time people "+
            "need to complete the questionnaires, to check this is sufficient. If you felt that we did not allow "+
            "enough time for you to answer each question carefully, please let us know!"+
            "</p>"+
            "<p>"+
            "For this particular experiment, we will ask you to complete "+nQuests+" questionnaires, "+
            "and to provide some information about yourself and your personal circumstances."+
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
  on_finish: function(){ 
    // redirect to study completion page 
    window.location = "https://app.prolific.co/submissions/complete?cc=7BD92407";
  } 
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
  preamble: ("Over the <b>last two weeks</b>, how often have you been bothered by any of the following problems?\n "+
             "(<i>Although you have already answered some questions like this during the study, we "+
             "would now like you to think about the <u>last two weeks overall</u>, rather than how you feel right now.</i>)"),
  questions: [
    {prompt: "<b>Little interest or pleasure in doing things</b>", 
      name: "PHQ9_1", labels: respOptsPHQ9, required:true, horizontal: true}, 
    {prompt: "<b>Feeling down, depressed, or hopeless</b>", 
      name: "PHQ9_2", labels: respOptsPHQ9, required: true, horizontal: true},
    {prompt: "<b>Trouble falling/staying asleep, sleeping too much</b>", 
      name: "PHQ9_3", labels: respOptsPHQ9, required:true, horizontal: true},
    {prompt: "<b>Feeling tired or having little energy</b>", 
      name: "PHQ9_4", labels: respOptsPHQ9, required:true, horizontal: true},
    {prompt: "<b>Poor appetite or overeating</b>", 
      name: "PHQ9_5", labels: respOptsPHQ9, required:true, horizontal: true},
    {prompt: "<b>Feeling bad about yourself or that you are a failure or have let yourself or your family down</b>", 
      name: "PHQ9_6", labels: respOptsPHQ9, required:true, horizontal: true},
    {prompt: "<b>Trouble concentrating on things, such as reading the newspaper or watching television.</b>", 
      name: "PHQ9_7", labels: respOptsPHQ9, required:true, horizontal: true},
    {prompt: "<b>Moving or speaking so slowly that other people could have noticed.\n"+
            "Or the opposite; being so fidgety or restless that you have been moving around a lot more than usual.</b>", 
      name: "PHQ9_8", labels: respOptsPHQ9, required:true, horizontal: true},
    {prompt: "<b>Thoughts that you would be better off dead or of hurting yourself in some way.</b>", 
      name: "PHQ9_9", labels: respOptsPHQ9, required:true, horizontal: true},
    {prompt: "If you have been bothered by any of the above, how difficult have these problems "+
             "made it for you to do your work, take care of things at home, or get along with other people?", 
      name: "PHQ9_D", labels: respOptsPHQ9Difficulty, required:true, horizontal: true}
  ],
  button_label: 'continue',
  scale_width: scaleDisplayWidth,  
  on_finish: function(){ 
    var respData = jsPsych.data.getLastTrialData().select('response').values[0];
    var timeElapsed = jsPsych.getTotalTime();
    //console.log(respData); console.log(timeElapsed);  // for debugging only
    saveQuestData("PHQ9", respData, timeElapsed);
  }
};

//////////////////////////// SHAPS ///////////////////////
// define response labels
var respOptsSHAPS = ["Strongly disagree", "Disagree", "Agree", "Strongly agree"];

// scale items
var SHAPS = {
  type: jsPsychSurveyLikert,
  preamble: ("For each statement below, please select how much you agree or disagree, "+
             "depending on <b>how you have generally felt over the past two weeks.</b>"),
  questions: [
    {prompt: "<b>I would enjoy my favourite television or radio programme.</b>", 
    name: "SHAPS_1", labels: respOptsSHAPS, required:true, horizontal: true}, 
    {prompt: "<b>I would enjoy being with my family or close friends.</b>", 
    name: "SHAPS_2", labels: respOptsSHAPS, required: true, horizontal: true},
    {prompt: "<b>I would find pleasure in my hobbies and pastimes.</b>", 
    name: "SHAPS_3", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would be able to enjoy my favourite meal.</b>", 
    name: "SHAPS_4", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would enjoy a warm bath or refreshing shower.</b>", 
    name: "SHAPS_5", labels: respOptsSHAPS, required:true, horizontal: true,},
    {prompt: "<b>I would find pleasure in the scent of flowers or the smell of a fresh sea breeze or freshly baked bread.</b>", 
    name: "SHAPS_6", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would enjoy seeing other people's smiling faces.</b>", 
    name: "SHAPS_7", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would enjoy looking smart when I have made an effort with my appearance.</b>", 
    name: "SHAPS_8", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would enjoy reading a book, magazine or newspaper.</b>", 
    name: "SHAPS_9", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would consider a potato to be an animal.</b>", 
    name: "catch_1", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would enjoy a cup of tea or coffee or my favorite drink.</b>", 
    name: "SHAPS_10", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would find pleasure in small things, e.g. bright sunny day, a telephone call from a friend.</b>", 
    name: "SHAPS_11", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would be able to enjoy a beautiful landscape or view.</b>", 
    name: "SHAPS_12", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would get pleasure from helping others.</b>", 
    name: "SHAPS_13", labels: respOptsSHAPS, required:true, horizontal: true},
    {prompt: "<b>I would feel pleasure when I receive praise from other people.</b>", 
    name: "SHAPS_14", labels: respOptsSHAPS, required:true, horizontal: true}
  ],
  button_label: 'continue',
  scale_width: scaleDisplayWidth,
  on_finish: function(){ 
    var respData = jsPsych.data.getLastTrialData().select('response').values[0];
    var timeElapsed = jsPsych.getTotalTime();
    //console.log(respData); console.log(timeElapsed);  // for debugging only
    saveQuestData("SHAPS", respData, timeElapsed);
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
             "Select <i>Completely True</i> if the statement describes you perfectly, and <i>Completely "+
             "Untrue</i> if the statement does not describe you at all, "+
             "thinking about <b>the last two weeks</b>. "+
             "</p>"),
  questions: [
    {prompt: "<b>I feel sad or upset when I hear bad news.</b>", 
    name: "AMI_1", labels: respOptsAMI, required:true, horizontal: true}, 
    {prompt: "<b>I start conversations with random people.</b>", 
    name: "AMI_2", labels: respOptsAMI, required: true, horizontal: true},
    {prompt: "<b>I enjoy doing things with people I have just met.</b>", 
    name: "AMI_3", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>I suggest activities for me and my friends to do.</b>", 
    name: "AMI_4", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>I make decisions firmly and without hesitation.</b>", 
    name: "AMI_5", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>After making a decision, I will wonder if I have made the wrong choice.</b>",
    name: "AMI_6", labels: respOptsAMI, required:true, horizontal: true}, 
    {prompt: "<b>I competed in the 1917 Summer Olympic Games.</b>", 
    name: "catch_2", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>Based on the last two weeks, I would say I care deeply about how my loved ones think of me.</b>", 
    name: "AMI_7", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>I go out with friends on a weekly basis.</b>", 
    name: "AMI_8", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>When I decide to do something, I am able to make an effort easily.</b>", 
    name: "AMI_9", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>I don't like to laze around.</b>", 
    name: "AMI_10", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>I get things done when they need to be done, without requiring reminders from others.</b>", 
    name: "AMI_11", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>When I decide to do something, I am motivated to see it through to the end.</b>", 
    name: "AMI_12", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>I feel awful if I say something insensitive.</b>", 
    name: "AMI_13", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>I start conversations without being prompted.</b>", 
    name: "AMI_14", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>When I have something I need to do, I do it straightaway so it is out of the way.</b>", 
    name: "AMI_15", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>I feel bad when I hear an acquaintance has an accident or illness.</b>", 
    name: "AMI_16", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>I enjoy choosing what to do from a range of activities.</b>", 
    name: "AMI_17", labels: respOptsAMI, required:true, horizontal: true},
    {prompt: "<b>If I realise I have been unpleasant to someone, I will feel terribly guilty afterwards.</b>", 
    name: "AMI_18", labels: respOptsAMI, required:true, horizontal: true}
  ],
  button_label: 'continue',
  scale_width: scaleDisplayWidth,
  on_finish: function(){ 
    var respData = jsPsych.data.getLastTrialData().select('response').values[0];
    var timeElapsed = jsPsych.getTotalTime();
    //console.log(respData); console.log(timeElapsed);  // for debugging only
    saveQuestData("AMI", respData, timeElapsed);
  }
};

////////////////////MINI-SPIN//////////////////////////////
// define response labels
var respOptsMiniSPIN = ["Not at all", "A little bit", "Somewhat", "Very much", "Extremely"];

// scale items
var miniSPIN = {
  type: jsPsychSurveyLikert,
  preamble: ("<p>"+
             "For each statement below, please select how well it describes you. "+
             "</p>"),
  questions: [
    {prompt: "<b>Fear of embarrassment causes me to avoid doing things or speaking to people.</b>", 
    name: "miniSPIN_1", labels: respOptsMiniSPIN, required:true, horizontal: true}, 
    {prompt: "<b>I avoid activities in which I am the center of attention.</b>", 
    name: "miniSPIN_2", labels: respOptsMiniSPIN, required:true, horizontal: true}, 
    {prompt: "<b>Being embarrassed or looking stupid are among my worst fears.</b>", 
    name: "miniSPIN_3", labels: respOptsMiniSPIN, required:true, horizontal: true}
  ],
  button_label: 'continue',
  scale_width: scaleDisplayWidth,
  on_finish: function(){ 
    var respData = jsPsych.data.getLastTrialData().select('response').values[0];
    var timeElapsed = jsPsych.getTotalTime();
    //console.log(respData); console.log(timeElapsed);  // for debugging only
    saveQuestData("miniSPIN", respData, timeElapsed);
  }
};

//////////////////////////// DEMOGS ///////////////////////
//age in years, gender identity, income bracket, employment status, housing status
var demogs = {
  type: jsPsychSurvey,
  pages: [
    [
      {
        type: 'html',
        prompt: "<b>Finally, we would like to ask you some questions about yourself "+
                "and your personal circumstances.</b>",
      },
      {
        type: 'text',
        prompt: "How old are you (in years)?", 
        name: 'demogs_age', 
        textbox_columns: 5,
        required: true,
        validation: "^[18-100]$"  // doesn't seem to work currently
      },
      {
        type: 'drop-down',
        prompt: "What is your gender identity?", 
        name: 'demogs_gender', 
        options: ['man', 'woman', 'non-binary', 'other', 'prefer not to say'], 
        required: true
      }, 
      {
        type: 'drop-down',
        prompt: "Which of the options below best describes your current employment status?", 
        name: 'demogs_employment', 
        options: ['employed (including full-time and part-time employment)', 
                  'unemployed (job seekers and those unemployed owing to ill health)',
                  'not seeking employment (stay-at-home parents, students, and retirees)'
                  ], 
        required: true
      },
      {
        type: 'drop-down',
        prompt: "Which of the options below best describes your current financial situation?", 
        name: 'demogs_financial', 
        options: ['doing okay financially',
                  'just about getting by',
                  'struggling financially'], 
        required: true
      },
      {
        type: 'drop-down',
        prompt: "Which of the options below best describes your current housing situation?", 
        name: 'demogs_housing', 
        options: ['homeowner (including those with a mortgage)',
                  'tenant',
                  'other (living with family or friends, homeless, or living in a hostel)'], 
        required: true
      },
      {
        type: 'multi-select',
        prompt: "Have you ever previously received treatment for a mental health problem? Please select all that apply",
        name: 'demogs_tx',
        options: ['yes - talking therapy (including cognitive-behavioural therapies)',
                  'yes - medication',
                  'yes - self-guided (e.g., workbooks or apps)',
                  'yes - other',
                  'no',
                  'prefer not to say'],
        required: true
      },
      {
        type: 'drop-down',
        prompt: "Do you consider yourself to be neurodivergent? (Neurodivergence is a term for when someone processes "+
                "or learns information in a different way to that which is considered 'typical': "+
                "common examples include autism and ADHD.)",
        name: 'demogs_neurodiv',
        options: ['yes', 'no', 'prefer not to say'],
        required: true
      },
      {
        type: 'drop-down',
        prompt: "In the future, would you be willing to play more games like "+
                "the ones in this study, if you thought they could be used to "+
                "give you information about your thought processes or decision-making?", 
        options: ['yes', 'no', 'not sure'],
        //rows: 1,
        name: 'study_acceptability', 
        required: true
      }, 
      {
        type: 'text',
        prompt: "Is there any feedback you would like to give us about "+
                "any aspect of the study (including the games and questionnaires)?", 
        name: 'study_feedback', 
        textbox_rows: 4,
        textbox_columns: 60,
        required: false
      },
    ]
  ],
  show_question_numbers: 'onPage',
  button_label_finish: 'submit',
  on_finish: function(){ 
    var respData = jsPsych.data.getLastTrialData().select('response').values[0];
    var timeElapsed = jsPsych.getTotalTime();
    //console.log(respData); console.log(timeElapsed);  // for debugging only
    saveQuestData("demogs", respData, timeElapsed);
    // questionnaire data backup
    saveEndData();
    // saveEndData(jsPsych.data.get());
  }
};


///////////////////////////////////////////// RUN /////////////////////////////////////////////////////////
// init jsPsych
var jsPsych = initJsPsych({
  show_progress_bar: true,             // participants like to see how far they are through questionnaires
  message_progress_bar: 'progress'
});

// create global jsPysch object which defines what the participant wil see in what order
var timeline = [];      
timeline.push(introText);
timeline.push(PHQ9);
timeline.push(SHAPS);
timeline.push(AMI);
timeline.push(miniSPIN);
timeline.push(demogs);
timeline.push(endScreen);

// run timeline
export function runQuests() {
  jsPsych.run(timeline); 
};



