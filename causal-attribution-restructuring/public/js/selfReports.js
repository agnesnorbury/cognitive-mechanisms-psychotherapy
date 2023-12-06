// Script to run a series of self-report questionnaires, using built-in JsPsych functionality

// import relevant task info
import { nQuests} from "./versionInfo.js";

// import data saving functions
import { saveQuestData, saveEndData } from "./saveData.js";

// initialize sizing vars
var scaleDisplayWidth = 600;  // in px

///////////////////////////////////////////// MISC TEXT /////////////////////////////////////////////////////////
var questsIntroText = {
  type: jsPsychHtmlButtonResponse,
  choices: ['start'],
  is_html: true,
  stimulus: ("<p><h2>Thank you! The main part of the study is now over.</h2></p>"+
            "<br>"+
            "<p>"+
            "<b>For the final part of the study, we will ask you to answer some short questions about "+
            "yourself and your personal circumstances</b>. "+
            "</p>"+
            "<p>"+
            "We appreciate that you have already answered a lot of questions at this point, "+
            "but it is <i>really important for the aims of our study that you answer each of the remaining questions as "+
            "accurately and truthfully as possible</i>. This will allow us to learn as much as possible "+
            "from the data you have already provided during the other parts of the study. "+
            "</p>"+
            "<p>"+
            "For this particular study, we will ask you to complete "+nQuests+" short questionnaires (all less "+
            "than 10 questions) "+
            "and to provide some information about yourself and your personal circumstances."+
            "</p>"+
            "<p>"+
            // "<b>The 'progress' bar at the top of the page shows you how many of the questions you have "+
            // "left to go.</b>"+
            "<br><br><br><br><br><br>"+
            "</p>"),
  on_start: function() {
    //this.type.jsPsych.setProgressBar(0);
    document.body.style.background = "aliceblue";
  }
};

var questsEndScreen = {
  type: jsPsychHtmlButtonResponse,
  timing_post_trial: 0,
  choices: ['finish the study'],
  is_html: true,
  stimulus: ("<p>"+
            "<h2>Thank you very much for your time. You have now finished the study.</h2>"+
            "</p>"+
            "If you would like to find out more about the ideas behind this study, "+
            "please see <a href=\"https://www.psychologytools.com/self-help/thoughts-in-cbt/\" target=\"_blank\">this article</a> "+
            "about why some psychologists believe the way we interpret events is key to understanding our feelings about them."+
            "</p>"+
            "If you became upset at any point during the study, "+
            "or are concerned about your mental health for any other reason, we recommend the below resources for further "+
            "information. You may also wish to discuss any concerns with your family doctor."+ 
            "</p>  " +
            "<ul>  " +
            "<p><li><a href=\"http://mind.org.uk\" target=\"_blank\">Mind Charity</a></li></p>"+
            "<p><li><a href=\"https://www.samaritans.org\" target=\"_blank\">The Samaritans</a></li></p>"+
            "<p><li><a href=\"https://www.nhs.uk/mental-health\" target=\"_blank\">NHS Choices mental health page</a></li></p>"+
            "</ul>"+
            "</p>"+
            "<b>Please click the button below to submit your data back to Prolific!</b>"+
            // ! use target=blank to ensure links open in new window, and don't mess with prolific submission
            "</p>"),
  on_finish: function() { 
    // redirect to study completion page 
    window.location = "https://app.prolific.co/submissions/complete?cc=7BD92407";
  } 
};  

///////////////////////////////////////////// SCALES /////////////////////////////////////////////////////////
//////////////////////////// DAS-SF ///////////////////////
// define response labels
var respOptsDAS = ["Totally Agree", "Agree", "Disagree", "Totally Disagree"];

// scale items
var DAS = {
  type: jsPsychSurveyLikert,
  preamble: ("<p>"+
            "The sentences below describe people’s attitudes. Please select how much each sentence describes "+
             "your attitude. Your answer should describe the way you think <b>most of the time</b>."+
             "</p>"),
  questions: [
    {prompt: "<b>If I don’t set the highest standards for myself, I am likely to end up a second-rate person</b>", 
      name: "DAS_1", labels: respOptsDAS, required:true, horizontal: true}, 
    {prompt: "<b>My value as a person depends greatly on what others think of me</b>", 
      name: "DAS_2", labels: respOptsDAS, required: true, horizontal: true},
    {prompt: "<b>People will probably think less of me if I make a mistake</b>", 
      name: "DAS_3", labels: respOptsDAS, required:true, horizontal: true},
    {prompt: "<b>I am nothing if a person I love doesn’t love me</b>", 
      name: "DAS_4", labels: respOptsDAS, required:true, horizontal: true},
    {prompt: "<b>If other people know what you are really like, they will think less of you</b>", 
      name: "DAS_5", labels: respOptsDAS, required:true, horizontal: true},
    {prompt: "<b>If I fail at my work, then I am a failure as a person</b>", 
      name: "DAS_6", labels: respOptsDAS, required:true, horizontal: true},
    {prompt: "<b>My happiness depends more on other people than it does me</b>", 
      name: "DAS_7", labels: respOptsDAS, required:true, horizontal: true},
    {prompt: "<b>I would consider a potato to be an animal</b>", 
      name: "catch_1", labels: respOptsDAS, required:true, horizontal: true},
    {prompt: "<b>I cannot be happy unless most people I know admire me.</b>", 
      name: "DAS_8", labels: respOptsDAS, required:true, horizontal: true},
    {prompt: "<b>It is best to give up your own interests in order to please other people.</b>", 
      name: "DAS_9", labels: respOptsDAS, required:true, horizontal: true}
  ],
  button_label: 'continue',
  scale_width: scaleDisplayWidth,  
  on_finish: function () {
    // set progress bar manually
    // this.type.jsPsych.setProgressBar(0.4);
    // get response and RT data
    var respData = this.type.jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = this.type.jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("DAS", respData, respRT);
  }
};

//////////////////////////// PHQs ///////////////////////
// define response labels
var respOptsPHQ9 = ["Not at all", "Several days", "More than half the days", "Nearly every day"];
var respOptsPHQ9Difficulty = ["Not difficult at all", "Somewhat difficult", "Very difficult", "Extremely difficult"];

// PHQ9 scale items
var PHQ9 = {
  type: jsPsychSurveyLikert,
  preamble: ("Over the <b>last two weeks</b>, how often have you been bothered by any of the following problems?\n "),
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
    // get response and RT data 
    var respData = this.type.jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = this.type.jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("PHQ9", respData, respRT);
  }
};

// PHQ2 scale items 
var PHQ2 = {
  type: jsPsychSurveyLikert,
  preamble: ("Over the <b>last two weeks</b>, how often have you been bothered by any of the following problems?\n "),
  questions: [
    {prompt: "<b>Little interest or pleasure in doing things</b>", 
      name: "PHQ9_1", labels: respOptsPHQ9, required:true, horizontal: true}, 
    {prompt: "<b>Feeling down, depressed, or hopeless</b>", 
      name: "PHQ9_2", labels: respOptsPHQ9, required: true, horizontal: true},
  ],
  button_label: 'continue',
  scale_width: scaleDisplayWidth,  
  on_finish: function(){
    // // set progress bar manually
    // this.type.jsPsych.setProgressBar(0.6);
    // get response and RT data 
    var respData = this.type.jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = this.type.jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("PHQ2", respData, respRT);
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
  on_finish: function() {
    // // set progress bar manually
    // this.type.jsPsych.setProgressBar(0.8);
    // get response and RT data
    var respData = this.type.jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = this.type.jsPsych.data.getLastTrialData().trials[0].rt;
    //console.log(respData, respRT);
    saveQuestData("miniSPIN", respData, respRT);
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
        prompt: "Do you consider yourself to be neurodivergent? "+
                "(Neurodivergence is a term for when someone processes or learns information in a different way to that which is considered 'typical': "+
                "common examples include autism and ADHD.)",
        name: 'demogs_neurodiv',
        options: ['yes', 'no', 'prefer not to say'],
        required: true
      },
      {
        type: 'multi-select',
        prompt: "Do you consider yourself to have a disability or form of neurodivergence that affects "+
                "your ability to do any of the below? Please select all that apply",
        name: 'demogs_disability',
        options: ['concentrate for extended periods of time',
                  'perform physically effortful activites',
                  'read, write, or do maths',
                  'deal with people you do not know',
                  'other form of impact not listed above',
                  'none of the above',
                  'prefer not to say'],
        required: true
      },
      {
        type: 'drop-down',
        prompt: "Do you consider yourself to have taken part in the 1917 Summer Olympic Games?",
        name: 'catch_2',
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
                "any aspect of the study (including the tasks and questionnaires)?", 
        name: 'study_feedback', 
        textbox_rows: 4,
        textbox_columns: 60,
        required: false
      },
    ]
  ],
  show_question_numbers: 'onPage',
  button_label_finish: 'submit',
  on_finish: function() {
    // get response and RT data
    var respData = this.type.jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = this.type.jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("demogs", respData, respRT);
    // all data backup
    saveEndData();
  }
};

///////////////////////////////////////////// CONCAT /////////////////////////////////////////////////////////
var timeline_quests = [];      
timeline_quests.push(questsIntroText);
timeline_quests.push(PHQ9);
timeline_quests.push(miniSPIN);
timeline_quests.push(DAS);
timeline_quests.push(demogs);
timeline_quests.push(questsEndScreen);


export { timeline_quests };

