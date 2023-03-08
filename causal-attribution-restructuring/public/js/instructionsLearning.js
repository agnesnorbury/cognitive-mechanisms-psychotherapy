// Script to run task instructions and looping quiz, using built in JsPsych functionality
import { nScenarios, bonusRate, maxBonus } from "./versionInfo.js";

///////////////////////////////////////////// INSTR TEXT /////////////////////////////////////////////////////////
var timeline_instructions_learning = [];

var introText = {
  type: jsPsychInstructions,
  allow_backward: true,
  show_clickable_nav: true,
  allow_keys: false,
  button_label_previous: "back",
  button_label_next: "next",
  pages: [ /////////////////////page one////////////////////////
          "<p>"+
          "<h2>Thank you</h2>"+
          "</p>"+
          "<br>"+
          "<p>"+
          "Now we would like you to move on the <b>second part of the study</b>, "+
          "which is a little different to the first."+
          "<br><br><br><br><br><br>"+
          "</p>",
          /////////////////////page two////////////////////////
          "<p>"+
          "<h2>What do I need to do?</h2>"+
          "<br>"+
          "</p>"+
          "<p>"+
          "Some researchers believe that <b>the kinds of reasons we think are likely to be responsible "+
          "for events can differ, depending on our moods</b>."+
          "</p>"+
          "<p>"+
          "In this part of the study, we will ask you to think about a new series of events, that occur in <b>"+nScenarios+" different scenarios</b>. "+
          "<b>Each scenario represents a different kind of mood a person can be in</b> (although we won’t tell you "+
          "what kind of mood it is!)"+
          "</p>"+
          "<br>"+
          "<div class='center-content'><img src='../assets/imgs/3_scenarios.png' style='width:600px;'></img></div>"+
          "<p>"+
          "This means that, although the events that occur during each mood scenario will all be different, "+
          "<b>the same kind of underlying reasons will be thought to be responsible for events <i>within</i> each scenario</b>. "+
          "</p>"+
          "<p>"+
          "For each scenario or mood state, it is now your job to try and work out <i>what kinds of reasons are "+
          "thought to be responsible for events</i>."+
          "<br><br><br><br><br><br>"+
          "</p>",
          /////////////////////page three////////////////////////
          "<p>"+
          "<h2>What do I need to do?</h2>"+
          "<br>"+
          "</p>"+
          "<p>"+
          "Specifically, you will be asked to <b>read a new series of sentences describing everyday events</b>. "+
          "</p>"+
          "<p>"+
          "Below each sentence, are <b>two different potential explanations</b> for why that event occurred. "+
          "</p>"+
          "<br>"+
          "<div class='center-content'><img src='../assets/imgs/eg3.png' style='width:450px;'></img></div>"+
          "<br>"+
          "<p>"+
          "For each event, you must <b>choose which you think the most likely explanation is</b>, by clicking "+
          "on the relevant thought bubble."+
          "<br><br><br><br><br><br>"+
          "</p>",
          /////////////////////page four////////////////////////
          "<p>"+
          "<h2>What do I need to do?</h2>"+
          "<br>"+
          "</p>"+
          "<p>"+
          "You will then <b>discover if that explanation was correct or not, for <i>this particular scenario or mood</i></b>. "+
          "</p>"+
          "<p>"+
          "If you chose the correct explanation, you will see a tick symbol, and the word CORRECT. "+
          "If you chose the incorrect explanation, you will see a cross symbol, and the word INCORRECT. "+
          "<p style='color:green;'>The correct explanation will be highlighted in green text. "+
          "</p>"+
          "<div class='center-content'><img src='../assets/imgs/corr_incorr.png' style='width:450px;'></img></div>"+
          "<p>"+
          "As we would like people to stay focused on learning during each scenario, there is a <b>time limit</b> "+
          "to enter your answer for each event. If no choice is made within the time limit (<b>15 seconds</b>), then the screen "+
          "will show the message 'You didn't choose in time!'. You will then be asked to choose for that event "+
          "again. "+
          "</p>"+
          "<p>"+
          "We ask that people try and not have too many timed-out choices. Submissions with a very high rate of time-out choices "+
          "may not be approved. <b>Each scenario should take around 3 minutes</b> to run through ("+nScenarios+" scenarios in total) "+
          " - and you can take a short break between scenarios if you like."+
          "<br><br><br><br><br><br>"+
          "</p>",
          /////////////////////page five////////////////////////
          "<p>"+
          "<h2>What do I need to do?</h2>"+
          "<br>"+
          "</p>"+
          "<p>"+
          "To recap, <b>for each scenario or mood, there is one kind of explanation that is the correct answer</b>. This will stay the same "+
          "all the way through each scenario, but may change <i>between</i> scenarios."+
          "</p>"+
          "<p>"+
          "Your job during the study is therefore to learn, through trial and error, <b>what you think the "+
          "right kind of explanation is for that scenario or mood</b>. "+
          "</p>"+
          "</p>"+
          "<div class='center-content'><img src='../assets/imgs/head_why.png' style='width:150px;'></img></div>"+
          "<p>"+
          "In order to motivate you to learn the right explanations, all approved submissions will <b>earn a bonus</b> payment, "+
          "the size of which depends on <b> how many answers you get right</b>. Specifically, you will earn an extra "+bonusRate+" pence "+
          "for every correct explanation you choose (<b>max possible bonus £"+maxBonus.toFixed(2)+"</b>)."+
          "</p>"+
          // "<p>"+
          // "We know that reading descriptions of many different events can, over time, "+
          // "start to feel repetitive. However, it is really important for the purposes of our research that "+
          // "we understand how well people can learn about different kinds of explanations for events. "+
          // "</p>"+
          // "<p>"+
          // "We have tried to design our study in a way that makes it as easy as possible for our participants "+
          // "to provide accurate answers. Specifically, as well as giving a <b>bonus payment</b>, we have tried to make sure we have allowed <b>plenty "+
          // "of time in the study completion estimate</b> to fully read all the questions and answers. "+
          // //"A <b>‘progress’ bar</b> has also been included to show <b>how far through the study you are</b> at any one point in time. "+
          // "(If you have any other suggestions - please let us know!)."+
          "<br><br><br>"+
          "</p>",
          // /////////////////////page six////////////////////////
          // "<p>"+
          // "<h2>Approval rules for this part of the study</h2>"+
          // "<br>"+
          // "</p>"+
          // "<p>"+
          // "As ensuring that our data is as high quality as possible forms part of our responsibility to the "+
          // "bodies that fund our research, we will also be <b>applying two quality control rules</b> to the "+
          // "data we receive for this study. "+
          // "</p>"+
          // "<ul>"+
          //   "<p><li><b>1. Choice times</b>. Submissions with reading and choice times of <i>less than 1 second "+
          //   "for a majority of trials</i> will not be approved, as it is not possible to properly process "+
          //   "the question and answer information in this time. </li></p>"+
          //   "<p><li><b>2. Time-outs</b>. Submissions with a <i>high number of time-outs (10% or more of choices)</i> "+
          //   "may also not be approved, as it's important for the study results that people try and stay "+
          //   "focused on learning during each scenario. </li></p>"+
          // "</ul>"+
          // "<p>"+
          // "We hope that the above measures are reasonable and clearly explained. If you don't think this is the case, "+
          // "please get in touch and let us know."+
          // "</p>"+
          // "<div class='center-content'><img src='../assets/imgs/thank-you.png' style='width:150px;'></img></div>"+
          // "<p>"+
          // "Above all, <b>we are very grateful to our study participants for volunteering their time to help us "+
          // "with our research</b>. Having quality control checks like the above on our data means that we can "+
          // "be more confident in the conclusions we can draw from online studies, and be more likely "+
          // "to be able to conduct these kind of studies in the future."+
          // "<br>"+
          // "</p>",
          /////////////////////page seven////////////////////////
          "<br>"+
          "<p>"+
          "Before you continue to the second part of the study, we will ask you to <b>answer some quick questions</b>. "+
          "This is in order to make sure we have explained the new information clearly enough."+
          "</p>"+
          "<div class='center-content'><img src='../assets/imgs/quiz.png' style='width:200px;'></img></div>"+
          "<p>"+
          "<b>If you don't get all the questions right, you will be routed back to the start of these instructions "+
          "to try again</b>."+
          "<br><br><br><br><br><br>"+
          "</p>"
          ],
  on_start: function() {
    //this.type.jsPsych.setProgressBar(0);
  },
  on_finish: function() {
    // var startTime = performance.now(); // this.type.jsPsych.getStartTime();
    // saveStartData(startTime);
  }
};

var quizQuestions = [
  { prompt: "<p><b>1. The point of this part of the the study is to...</b></p>"+
            "<p><b>A</b>  Select the reason you think is most likely to be correct, according to how you think most people would explain the causes of different events</p>"+
            "<p><b>B</b>  Select the reason you think is most likely to be correct, according to what you think would be the main cause behind an event if it happened to you right now</p>"+
            "<p><b>C</b>  Select the reason you think is most likely to be correct, thinking about the kinds of reasons that have been responsible for events so far for this scenario or mood</p>",
    options: ["A", "B", "C"],
    required: true,
    horizontal: true
  },
  { prompt: "<p><b>2. This part of the study will ask me to think about events that happen in "+nScenarios+" different scenarios. The best way to think about these different scenarios is...</b></p>"+
            "<p><b>A</b>  That each scenario represents a different kind of mood a person can be in. This means that events within each scenario will have all kinds of different underlying reasons, which it is impossible to learn</p>"+
            "<p><b>B</b>  That each scenario represents a different kind of mood a person can be in. This means that events within each scenario are thought to be caused by similar reasons, but that when the scenario or mood changes, the kind of reasons thought to be correct may also change</p>"+
            "<p><b>C</b>  That each scenario represents a different kind of mood a person can be in. This means that events are likely to be explained by the same kinds of reasons all the way through the study</p>",
    options: ["A", "B", "C"],
    required: true,
    horizontal: true
  },
  { prompt: "<p><b>3. After I select the reason I think is responsible for each event, I will find out whether my choice was correct or incorrect.</b></p>"+
            "<p><b>A</b>  To help me learn, the incorrect explanation will disappear from the screen. For every correct answer, I will earn a sense of personal satisfaction</p>"+
            "<p><b>B</b>  To help me learn, the correct explanation will be highlighted in green text. For every correct answer, "+bonusRate+" pence will be subtracted from my total payment"+
            "<p><b>C</b>  To help me learn, the correct explanation will be highlighted in green text. For every correct answer, I will earn a bonus payment of "+bonusRate+" pence</p>",
    options: ["A", "B", "C"],
    required: true,
    horizontal: true
  },
  // { prompt: "<p><b>4. I understand that some quality-control rules will be applied to my submission. "+
  //           "</b></p>"+
  //           "<p><b>A</b>  Submissions with a high number of timed-out choices from this part of the study will definitely be approved</p>"+
  //           "<p><b>B</b>  Submissions with a high number of timed-out choices from this part of the study may not be approved</p>"+
  //           "<p><b>C</b>  Submissions with a high number of correct choices from this part of the study may not be approved</p>",
  //   options: ["A", "B", "C"],
  //   required: true,
  //   horizontal: true
  // }
];

var nCorrect = 0;
var nQuests = 4;
var introQuiz = {
  type: jsPsychSurveyMultiChoice,
  questions: quizQuestions,
  data: {
    correct_answers: ["C", "B", "C"]  
    //correct_answers: ["C", "B", "C", 'B']
  },
  randomize_question_order: false,
  button_label: "check answers", 
  on_finish: function (data) {
    // compare answers to correct answers
    nCorrect = 0;
    for (var i=0; i < nQuests; i++) {
      var questID = "Q"+i;
      if (data.response[questID] == data.correct_answers[i]) {
        nCorrect++;
      }
    }
    data.nCorrect = nCorrect;
  }
};

var sorryText = {
  type: jsPsychInstructions,
  allow_backward: false,
  show_clickable_nav: true,
  allow_keys: true,
  button_label_next: "continue",
  pages: ["<p><h2>Sorry, you didn’t get all the answers right this time!</h2></p>"+ 
          "<p>"+
          "To check we have explained everything clearly, please re-read the "+
          "information and try the quiz again."+
          "</p>"]
};

var if_node = {
  timeline: [ sorryText ],
  condition_function: function(data) {
    if ( nCorrect < nQuests ) {
        return false;
    } else {
        return true;
    }
  }
}

var loop_node = {
  timeline: [ introText, introQuiz ],
  loop_function: function(data) {
    if ( nCorrect >= nQuests ) {
        return false;
    } else {
        return true;
    }
  }
};

var continueText= {
  type: jsPsychInstructions,
  allow_backward: false,
  show_clickable_nav: true,
  allow_keys: true,
  //button_label_previous: "back",
  button_label_next: "continue",
  pages: ["<p><h2>Thank you! You got all the questions correct!</h2></p>"+
          "<p>"+
          "Just to remind you one more time, what we would like you to do for this "+
          "part of the study is read the description of each event, then <b>select the reason you think "+
          "is most likely to be correct</b> for the event, thinking about <b>the kinds of reasons "+
          "that have been thought to be correct for events so far for during this particular scenario or mood</b>."+
          "</p>"+
          "<p>"+
          "Please try and choose your answer as accurately as possible. <i>If you try and "+
          "click on an answer too quickly after the description has been displayed, it may not register yet</i>. "+
          "</p>"+
          "<p>"+
          "<b>Each scenario should take around 3 minutes</b> to run through, and we will task you about "+nScenarios+" different scenarios in total. "+
          "If you like, you can take a short break between each of the scenarios."+
          "</p>"+
          // "<p>"+
          // "<b>The progress bar at the top of the screen shows you how far you are through this part of the study</b>."+
          // "</p>"
          "<p>"+
          "Please press the <b>continue</b> button when you are ready to start!"+
          "</p>"
          ]
};

///////////////////////////////////////////// CONCAT ////////////////////////////////////////////////////////
timeline_instructions_learning.push(loop_node);        // loop through instructions and quiz until correct
timeline_instructions_learning.push(continueText);     // loop through instructions and quiz until correct
 
export { timeline_instructions_learning };

