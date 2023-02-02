// Script to run a mixture of text and interactive screens, using built-in and custom jsPsych functionality

// import task info from versionInfo file
import { randCond } from "./versionInfo.js"; 

// import our data saving function
import { saveTaskData, saveQuestData } from "./saveData.js";

// import jspsych object so can access modules
import { jsPsych } from "./constructStudy.js";

// initialize sizing vars
var scaleDisplayWidth = 600;  // in px

///////////////////////////////////////////// INTERVENTION TEXT /////////////////////////////////////////////////////////
var introText= {
  type: jsPsychInstructions,
  allow_backward: false,
  show_clickable_nav: true,
  allow_keys: true,
  //button_label_previous: "back",
  button_label_next: "continue",
  pages: [`<p><h2>Learning time!</h2></p>
           <p>
           Before you move on to the final part of the study, we would like you to give you some
           background information. 
           </p>
           <p>
           We hope that you will find this interesting.
           </p>
           `
           ],
  on_start: function () {
    document.body.style.background = "aliceblue";
  }
};

var continueText= {
  type: jsPsychInstructions,
  allow_backward: false,
  show_clickable_nav: true,
  allow_keys: true,
  //button_label_previous: "back",
  button_label_next: "continue",
  pages: [`<p><h2>Thank you. You are now ready to continue to the final main part of the study</h2></p>`],
  on_finish: function() {
    var intEndTime = performance.now(); // this.type.jsPsych.getStartTime();
    saveTaskData('interventionEndTime', intEndTime);
  }
};

////////////////////////////////// PSYCHOEDUCATION (ACTIVE) ////////////////////////////////////////
var pe_background = {
  type: jsPsychInstructions,
  allow_backward: true,
  show_clickable_nav: true,
  allow_keys: true,
  button_label_previous: "back",
  button_label_next: "next",
  pages: [ /////////////////////page one////////////////////////
          `<p><h2>Thoughts affect feelings: A core idea behind cognitive therapy</h2></p>
          <p>
          Some psychologists think that it is often the way people <i>interpret</i> events, rather 
          than the events themselves, that leads to upsetting thoughts and feelings.
          </p>
          <p>
          <blockquote>For example, if a person has the belief “I’m a failure”, they may interpret 
          all negative things that happen to them as somehow resulting from their own actions,  
          regardless of the actual reasons behind events.</blockquote>
          </p>
          <p>
          This idea is helpful, because it explains why people experiencing the same event can
          react in different ways.
          </p>
          <br>
          <div class='center-content'><img src='../assets/imgs/emotions.jpg' style='width:450px;'></img></div>
          <br><br>
          `,
          /////////////////////page two/////////////////////////
          `<p><h2>Thoughts affect feelings: A core idea behind cognitive therapy</h2></p>
          <p>
          Over time, people who tend to interpret events in an unhelpful way may become more 
          vulnerable to feeling low. This is because the upsetting thoughts and feelings may 
          trigger a negative cycle of thoughts, feelings, and behaviour. 
          </p>
          <p>
          <blockquote> For example, a person who believes they are a failure may give up trying to take 
          part in activities that might lead to positive feelings (talking with friends or 
          doing something they enjoy), as they already assume it will end up badly.</blockquote>
          </p>
          <p>
          In cognitive therapy, this relationship between thoughts, feelings, and behaviours 
          is known as the <b>cognitive triangle</b>.
          </p>
          <br>
          <div class='center-content'><img src='../assets/imgs/cognitive_triangle.png' style='width:450px;'></img></div>
          <br><br>
          `,
          /////////////////////page three///////////////////////
          `<p><h2>Thoughts affect feelings: A core idea behind cognitive therapy</h2></p>
          <p>
          One of the core ideas behind cognitive therapy is that it is possible to <i>identify</i> 
          and then <i>challenge</i> unhelpful thoughts and beliefs.
          </p>
          <p>
          Cognitive therapists believe that challenging unhelpful thoughts can change the way 
          we interpret events, and therefore <b>change our emotional reactions to them</b>.
          </p>
          <br>
          <div class='center-content'><img src='../assets/imgs/identify_challenge.jpg' style='width:450px;'></img></div>
          <br><br>  
          `,
          /////////////////////page four/////////////////////////
          `<p><h2>Thoughts affect feelings: A core idea behind cognitive therapy</h2></p>
          <p>
          <br><br><br><br><br>
          Let's walk through some examples to see how this might work in practice.
          </p>
          <br><br><br><br><br>
          `
          ],
  on_start: function() {
    var intStartTime = performance.now(); 
    saveTaskData('interventionStartTime', intStartTime);
  }
};

var pe_example_1 = {
  type: jsPsychSurvey,
  //title: null,
  pages: [
    [
      {
        type: 'html',
        prompt: `<p><h2>Thoughts affect feelings: A core idea behind cognitive therapy</h2></p>
                 <br>
                 <p>
                 <b>Example one</b>
                 </p>
                 <p>
                 <blockquote>Imagine a friend walks past you without acknowledging you</blockquote>
                 </p>
                 Below are two different ways you could think about this event.
                 <div class='float-container'>

                  <div class='float-child'>
                  <p><b>Interpretation 1</b></p>
                    <div class='thought'> “I must have done something to upset them”</div>
                  </div>  
                 
                  <div class='float-child'>
                  <p><b>Interpretation 2</b></p>
                    <div class='thought'> “They probably just didn’t see me”</div>
                  </div>

                 </div>

                 <br>
                `,
      },
      {
        type: 'multi-select',
        prompt: `What kind of feelings do you think you might experience if you thought interpretation 1 was true?`, 
        name: 'int_eg1_1', 
        options: ['worried', 'tense', 'relaxed', 'unconcerned'],
        columns: 0,
        //correct_response: [],  
        required: true
      },
      {
        type: 'multi-select',
        prompt: "What kind of feelings do you think you might experience if you thought interpretation 2 was true?", 
        name: 'int_eg1_2', 
        options: ['worried', 'tense', 'relaxed', 'unconcerned'],
        columns: 0,
        //correct_response: [],  
        required: true
      },  
      {
        type: 'drop-down',
        prompt: "Which interpretation do you think is the most helpful to think about?", 
        name: 'int_eg1_3', 
        options: ['interpretation 1', 'interpretation 2'],
        //correct_response: '', 
        required: true
      }, 
    ]
  ],
  show_question_numbers: 'off',
  button_label_finish: 'continue',
  required_question_label: "",
  on_finish: function() {
    // get response and RT data
    var respData = jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("intervention_eg1", respData, respRT);
  }
};

var pe_example_2 = {
  type: jsPsychSurvey,
  //title: null,
  pages: [
    [
      {
        type: 'html',
        prompt: `<p><h2>Thoughts affect feelings: A core idea behind cognitive therapy</h2></p>
                 <br>
                 <p>
                 <b>Example two</b>
                 </p>
                 <p>
                 <blockquote>Imagine your boss tells you they have decided to offer you a promotion</blockquote>
                 </p>
                 Below are two different ways you could think about this event.
                 <div class='float-container'>

                  <div class='float-child'>
                  <p><b>Interpretation 1</b></p>
                    <div class='thought'> “I’ve worked hard and must have done well this year”</div>
                  </div>  
                 
                  <div class='float-child'>
                  <p><b>Interpretation 2</b></p>
                    <div class='thought'> “They probably feel they have to offer this to everyone after a certain amount of time”</div>
                  </div>

                 </div>

                 <br>
                `,
      },
      {
        type: 'multi-select',
        prompt: `What kind of feelings do you think you might experience if you thought interpretation 1 was true?`, 
        name: 'int_eg2_1', 
        options: ['proud', 'excited', 'neutral', 'nervous'],
        columns: 0,
        //correct_response: [],  
        required: true
      },
      {
        type: 'multi-select',
        prompt: "What kind of feelings do you think you might experience if you thought interpretation 2 was true?", 
        name: 'int_eg2_2', 
        options: ['proud', 'excited', 'neutral', 'nervous'],
        columns: 0,
        //correct_response: [],  
        required: true
      },  
      {
        type: 'drop-down',
        prompt: "Which interpretation do you think is the most helpful to think about?", 
        name: 'int_eg2_3', 
        options: ['interpretation 1', 'interpretation 2'],
        //correct_response: '', 
        required: true
      }, 
    ]
  ],
  show_question_numbers: 'off',
  button_label_finish: 'continue',
  required_question_label: "",
  on_finish: function() {
    // get response and RT data
    var respData = jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("intervention_eg2", respData, respRT);
  }
};

var pe_yourturn_1 = {
  type: jsPsychSurvey,
  //title: null,
  pages: [
    [
      {
        type: 'html',
        prompt: `<p><h2>Thoughts affect feelings: A core idea behind cognitive therapy</h2></p>
                 <p>
                 <b>Your turn!</b>
                 </p>
                 <p>
                 <blockquote>Think of something <i>negative</i> that happened to you recently. For example, 
                 something that didn’t go the way you would have liked it to at work, or in a social situation.
                 </p>
                 <p>
                 What was going through your mind in that moment?</blockquote>
                 </p>
                `,
      },
      {
        type: 'text',
        prompt: `Briefly, summarise your first thoughts about why this event happened`, 
        html: true, 
        name: 'int_yt1_1', 
        textbox_rows: 2,
        textbox_columns: 60,
        required: true
      },
      {
        type: 'text',
        prompt: `Now, try and come up with an alternative interpretation. 
                 Is there another way of seeing things?`, 
        html: true, 
        name: 'int_yt1_2', 
        textbox_rows: 2,
        textbox_columns: 60,
        required: true
      },
      {
        type: 'drop-down',
        prompt: `Consider how you would feel after thinking about each of the two different interpretations.
                 Which explanation do you think is the most helpful to think about?`, 
        html: true, 
        name: 'int_yt1_3', 
        options: ['first interpretation', 'alternative interpretation'],
        //correct_response: '', 
        required: true
      }, 
      {
        type: 'drop-down',
        prompt: `Which explanation do you think would be more likely to be true if this event 
                 happened to a colleague or friend of yours?`, 
        html: true, 
        name: 'int_yt1_4', 
        options: ['first interpretation', 'alternative interpretation'],
        //correct_response: '', 
        required: true
      },
      {
        type: 'drop-down',
        prompt: `If you were looking back on this event from 20 years in the future, which 
                interpretation do you think you would be likely to choose then?`, 
        html: true, 
        name: 'int_yt1_5', 
        options: ['first interpretation', 'alternative interpretation'],
        //correct_response: '', 
        required: true
      }
    ]
  ],
  show_question_numbers: 'off',
  required_question_label: "",
  button_label_finish: 'continue',
  on_finish: function() {
    // get response and RT data
    var respData = jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("intervention_yt1", respData, respRT);
  }
};

var pe_yourturn_2 = {
  type: jsPsychSurvey,
  //title: null,
  pages: [
    [
      {
        type: 'html',
        prompt: `<p><h2>Thoughts affect feelings: A core idea behind cognitive therapy</h2></p>
                 <p>
                 <b>Your turn!</b>
                 </p>
                 <p>
                 <blockquote>Now, think of something <i>positive</i> that happened to you recently. For example, 
                 something that went well at work, socially, or when taking part in another activity.
                 </p>
                 <p>
                 What was going through your mind in that moment?</blockquote>
                 </p>
                `,
      },
      {
        type: 'text',
        prompt: `Briefly, summarise your first thoughts about why this event happened`,
        html: true, 
        name: 'int_yt2_1', 
        textbox_rows: 2,
        textbox_columns: 60,
        required: true
      },
      {
        type: 'text',
        prompt: `Now, try and come up with an alternative interpretation. 
                 Is there another way of seeing things?`, 
        html: true, 
        name: 'int_yt2_2', 
        textbox_rows: 2,
        textbox_columns: 60,
        required: true
      },
      {
        type: 'drop-down',
        prompt: `Consider how you would feel after thinking about each of the two different interpretations.
                 Which explanation do you think is the most helpful to think about?`, 
        name: 'int_yt2_3', 
        options: ['first interpretation', 'alternative interpretation'],
        //correct_response: '', 
        required: true
      }, 
      {
        type: 'drop-down',
        prompt: `Which explanation do you think would be more likely to be true if this event 
                 happened to a colleague or friend of yours?`, 
        name: 'int_yt2_4', 
        options: ['first interpretation', 'alternative interpretation'],
        //correct_response: '', 
        required: true
      },
      {
        type: 'drop-down',
        prompt: `If you were looking back on this event from 20 years in the future, which 
                interpretation do you think you would be likely to choose then?`, 
        name: 'int_yt2_5', 
        options: ['first interpretation', 'alternative interpretation'],
        //correct_response: '', 
        required: true
      }
    ]
  ],
  show_question_numbers: 'off',
  required_question_label: "",
  button_label_finish: 'continue',
  on_finish: function() {
    // get response and RT data
    var respData = jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("intervention_yt2", respData, respRT);
  }
};

var pe_in_summary = {
  type: jsPsychSurvey,
  //title: null,
  pages: [
    [
      {
        type: 'html',
        prompt: `<p><h2>Thoughts affect feelings: A core idea behind cognitive therapy</h2></p>
                 <p>
                 <b>Putting it all together</b>
                 </p>
                 <p>
                 To finish up this part of the study, we'd like to ask you some questions 
                 about the information you've just read.
                 </p>
                 <p>
                 Please note, these questions are just to try and understand how clearly we have explained the 
                 material - your answers will not affect the chance of your submission being approved,
                 and you will continue on to the final main part of the study at the end, whichever options 
                 you choose.
                 </p>
                 <b>For each group of sentences below, which best summarises the information you 
                 just read?</b>
                `,
      },
      {
        type: 'multi-choice',
        prompt: `1`,
        html: true, 
        name: 'int_is_1', 
        options: ['Thoughts are facts. The way we think about and interpret events is always correct.', 
                  'People can vary in their interpretations of the same events.',
                  'People always interpret negative events in negative ways'],
        correct_response: 'People can vary in their interpretations of the same events.', 
        required: true
      },
      {
        type: 'multi-choice',
        prompt: `2`, 
        html: true, 
        name: 'int_is_2', 
        options: ['What we think doesn’t make any difference to how we feel and act.', 
                  'Different people experiencing the same events always experience the same feelings.',
                  'How we interpret events can affect our emotional responses to them.'],
        correct_response: 'How we interpret events can affect our emotional responses to them.', 
        required: true
      },
      {
        type: 'multi-choice',
        prompt: `3`, 
        name: 'int_is_3', 
        options: ['Whatever we think about events, we will always feel generally the same in the future as we do now.', 
                  'If we can learn to challenge unhelpful thoughts about events, over time we may come to experience less upsetting reactions to them.'],
        correct_response: 'If we can learn to challenge unhelpful thoughts about events, over time we may come to experience less upsetting reactions to them.', 
        required: true
      }
    ]
  ],
  show_question_numbers: 'off',
  required_question_label: "",
  button_label_finish: 'continue',
  on_finish: function() {
    // get response and RT data
    var respData = jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("intervention_is", respData, respRT);
  }
};

////////////////////////////////// EMOTION-FOCUSED (CONTROL) ////////////////////////////////////////
var ef_background = {
  type: jsPsychInstructions,
  allow_backward: true,
  show_clickable_nav: true,
  allow_keys: true,
  button_label_previous: "back",
  button_label_next: "next",
  pages: [ /////////////////////page one////////////////////////
          `<p><h2>Emotions as signals: a core idea behind emotion-focused therapy</h2></p>
          <p>
          Emotions are one of the most complex biological processes in the human body.
          </p>
          <p>
          <blockquote>The term dates back to the 1500s and comes from the French word 
          <i>emouvoir</i>, which means “to stir up”.</blockquote>
          </p>
          <p>
          Emotions are powerful experiences. They can be both positive and negative, and 
          both positive and negative emotions are experienced by all of us in our daily lives. 
          Despite - or perhaps because of - this, many psychologists believe that emotions are an 
          essential aspect of being human. 
          </p>
          <p>
          Emotion-focused therapy centers the role of emotions in human behaviour. Emotion-focused
          therapists believe that emotions 
          function both to tell people <i>what the problem is</i>, and keep them motivated 
          to <i>do something about it</i>.
          </p>
          <br>
          <div class='center-content'><img src='../assets/imgs/emotions.jpg' style='width:450px;'></img></div>
          <br><br>
          `,
          /////////////////////page two/////////////////////////
          `<p><h2>Emotions as signals: a core idea behind emotion-focused therapy</h2></p>
          <p>
          In particular, emotion-focused therapists argue that emotions are <i>signals</i>. They offer 
          messages that you are in danger, that your boundaries are being crossed, that a safe 
          and familiar person is absent, or that you are close to someone safe and familiar.  
          </p>
          <p>
          <blockquote>Emotion-focused therapy argues that rather than attempting to control, interrupt, change, or avoid 
          the experience of emotions, people need to learn to live in harmony with them.</blockquote>
          </p>
          <br>
          <div class='center-content'><img src='../assets/imgs/signal.jpg' style='width:450px;'></img></div>
          <br><br>
          `,
          /////////////////////page three///////////////////////
          `<p><h2>Emotions as signals: a core idea behind emotion-focused therapy</h2></p>
          <p>
          People can start to incorporate an emotion-focused approach into their daily lives by attending 
          to their bodies and learning to recognize and <b>label</b> what they feel. They can first acknowledge these 
          labels to themselves, and then, when appropriate, to others. 
          </p>
          <p>
          Having acknowledged and labelled their emotions, people can then begin to <b>understand</b> these 
          feelings. To do this, people have to ‘use their heads’ to make sense of their experiences, by 
          working out what their feelings and emotions might be trying to signal to them.
          </p>
          <br>
          <div class='center-content'><img src='../assets/imgs/unravel.jpg' style='width:450px;'></img></div>
          <br><br>  
          `,
          /////////////////////page four/////////////////////////
          `<p><h2>Emotions as signals: a core idea behind emotion-focused therapy</h2></p>
          <p>
          <br><br><br><br><br>
          Let's walk through some examples to see how this might work in practice.
          </p>
          <br><br><br><br><br>
          `
          ],
  on_start: function() {
    var intStartTime = performance.now(); 
    saveTaskData('interventionStartTime', intStartTime);
  }
};

var ef_example_1 = {
  type: jsPsychSurvey,
  //title: null,
  pages: [
    [
      {
        type: 'html',
        prompt: `<p><h2>Emotions as signals: a core idea behind emotion-focused therapy</h2></p>
                 <br>
                 <p>
                 <b>Example one</b>
                 </p>
                 <p>
                 <blockquote>Imagine you are away on a trip and your partner tells you they are enjoying the 
                 time alone</blockquote>
                 </p>
                 <p>
                 A reasonable response to hearing this may be to initially withdraw into yourself and think 
                 “I know they mean well, but hearing this makes me feel rejected.”
                 </p>
                 <p>
                 From an emotion-focused perspective, the first step with dealing with this situation would be 
                 to <b>recognise</n> and <b>label</b> the emotions you are experiencing.
                 </p> 
                `,
      },
      {
        type: 'multi-select',
        prompt: ` Which of the following do you think you might feel in this situation?`, 
        name: 'int_eg1_1', 
        options: ['sad', 'lonely', 'embarrassed', 'relieved'],
        columns: 0,
        //correct_response: [],  
        required: true
      },
      {
        type: 'multi-choice',
        prompt: "What signal or message do you think these feelings might be trying to convey?", 
        name: 'int_eg1_2', 
        options: ['you are in physical danger', 
                  'an important relationship may be at risk', 
                  'you are close to someone safe and familiar'],
        columns: 1,
        //correct_response: [],  
        required: true
      },  
      {
        type: 'multi-choice',
        prompt: "How do you think you might be likely to respond to this signal?", 
        name: 'int_eg1_3', 
        options: ['hang up the phone and leave the room', 
                  'say to your partner “When you sound so enthusiastic about me being away, I feel pushed away”', 
                  'say to your partner “I’m also really happy right now”'],
        //correct_response: '', 
        columns: 1,
        required: true
      }, 
    ]
  ],
  show_question_numbers: 'off',
  button_label_finish: 'continue',
  required_question_label: "",
  on_finish: function() {
    // get response and RT data
    var respData = jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("intervention_eg1", respData, respRT);
  }
};

var ef_example_2 = {
  type: jsPsychSurvey,
  //title: null,
  pages: [
    [
      {
        type: 'html',
        prompt: `<p><h2>Emotions as signals: a core idea behind emotion-focused therapy</h2></p>
                 <br>
                 <p>
                 <b>Example one</b>
                 </p>
                 <p>
                 <blockquote>Imagine you receive a message from a close friend saying that they are thinking 
                 of you</blockquote>
                 </p>
                `,
      },
      {
        type: 'multi-select',
        prompt: ` Which of the following do you think you might feel at this point in time?`, 
        name: 'int_eg1_1', 
        options: ['angry', 'upset', 'content', 'secure'],
        columns: 0,
        //correct_response: [],  
        required: true
      },
      {
        type: 'multi-choice',
        prompt: "What signal or message do you think these feelings might be trying to convey?", 
        name: 'int_eg1_2', 
        options: ['your boundaries are being crossed', 
                  'an important relationship may be at risk', 
                  'you are close to someone safe and familiar'],
        columns: 1,
        //correct_response: [],  
        required: true
      },  
      {
        type: 'multi-choice',
        prompt: "How do you think you might respond to this signal?", 
        name: 'int_eg1_3', 
        options: ['put down your phone and don’t respond', 
                  'reply to your friend “I’m feeling rejected right now”', 
                  'reply to your friend “When you message, I feel close to you”'],
        //correct_response: '', 
        columns: 1,
        required: true
      }, 
    ]
  ],
  show_question_numbers: 'off',
  button_label_finish: 'continue',
  required_question_label: "",
  on_finish: function() {
    // get response and RT data
    var respData = jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("intervention_eg2", respData, respRT);
  }
};

var ef_yourturn_1 = {
  type: jsPsychSurvey,
  //title: null,
  pages: [
    [
      {
        type: 'html',
        prompt: `<p><h2>Emotions as signals: a core idea behind emotion-focused therapy</h2></p>
                 <p>
                 <b>Your turn!</b>
                 </p>
                 <p>
                 <blockquote>Bring to mind a challenge that you are facing at the moment, perhaps at 
                 work or at home.</blockquote>
                 </p>
                 <p>
                 Observe any emotions or bodily sensations that come to mind when thinking about this 
                 particular challenge.
                 </p>
                `,
      },
      {
        type: 'text',
        prompt: `Briefly describe these feelings below.`, 
        html: true, 
        name: 'int_yt1_1', 
        textbox_rows: 2,
        textbox_columns: 60,
        required: true
      },
      {
        type: 'text',
        prompt: `What do you think these emotions might be trying to signal to you?`, 
        html: true, 
        name: 'int_yt1_2', 
        textbox_rows: 2,
        textbox_columns: 60,
        required: true
      },
      {
        type: 'drop-down',
        prompt: `Is it easy to understand the message behind these feelings?`, 
        html: true, 
        name: 'int_yt1_3', 
        options: ['no', 'yes', 'not sure'],
        //correct_response: '', 
        required: true
      }
    ]
  ],
  show_question_numbers: 'off',
  required_question_label: "",
  button_label_finish: 'continue',
  on_finish: function() {
    // get response and RT data
    var respData = jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("intervention_yt1", respData, respRT);
  }
};

var ef_yourturn_2 = {
  type: jsPsychSurvey,
  //title: null,
  pages: [
    [
      {
        type: 'html',
        prompt: `<p><h2>Emotions as signals: a core idea behind emotion-focused therapy</h2></p>
                 <p>
                 <b>Your turn!</b>
                 </p>
                 <p>
                 <blockquote>Now, bring to mind something you think is going well in your life at the 
                 moment - perhaps at work, in a relationship, or a hobby you enjoy.</blockquote>
                 </p>
                 <p>
                 Observe any emotions or bodily sensations that come to mind when thinking about this 
                 particular situation.
                 </p>
                `,
      },
      {
        type: 'text',
        prompt: `Briefly describe these feelings below.`, 
        html: true, 
        name: 'int_yt1_1', 
        textbox_rows: 2,
        textbox_columns: 60,
        required: true
      },
      {
        type: 'text',
        prompt: `What do you think these emotions might be trying to signal to you?`, 
        html: true, 
        name: 'int_yt1_2', 
        textbox_rows: 2,
        textbox_columns: 60,
        required: true
      },
      {
        type: 'drop-down',
        prompt: `Is it easy to understand the message behind these feelings?`, 
        html: true, 
        name: 'int_yt1_3', 
        options: ['no', 'yes', 'not sure'],
        //correct_response: '', 
        required: true
      }
    ]
  ],
  show_question_numbers: 'off',
  required_question_label: "",
  button_label_finish: 'continue',
  on_finish: function() {
    // get response and RT data
    var respData = jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("intervention_yt2", respData, respRT);
  }
};

var ef_in_summary = {
  type: jsPsychSurvey,
  //title: null,
  pages: [
    [
      {
        type: 'html',
        prompt: `<p><h2>Emotions as signals: a core idea behind emotion-focused therapy</h2></p>
                 <p>
                 <b>Putting it all together</b>
                 </p>
                 <p>
                 To finish up this part of the study, we'd like to ask you some questions 
                 about the information you've just read.
                 </p>
                 <p>
                 Please note, these questions are just to try and understand how clearly we have explained the 
                 material - your answers will not affect the chance of your submission being approved,
                 and you will continue on to the final main part of the study at the end, whichever options 
                 you choose.
                 </p>
                 <b>For each group of sentences below, which best summarises the information you 
                 just read?</b>
                `,
      },
      {
        type: 'multi-choice',
        prompt: `1`,
        html: true, 
        name: 'int_is_1', 
        options: ['The first step of an emotionally-informed response to a situation is to recognise and then discount whatever emotions you are feeling', 
                  'The first step of an emotionally-informed response to a situation is to recognise and label what emotions you are feeling.',
                  'The first step of an emotionally-informed response to a situation is to ignore whatever emotions you are feeling.'],
        correct_response: 'The first step of an emotionally-informed response to a situation is to recognise and label what emotions you are feeling.', 
        required: true
      },
      {
        type: 'multi-choice',
        prompt: `2`, 
        html: true, 
        name: 'int_is_2', 
        options: ['The second step of an emotionally-informed response to a situation is to walk away from the situation to take a breath.', 
                  'The second step of an emotionally-informed response to a situation is to dive straight into whatever your gut tells you to do.',
                  'The second step of an emotionally-informed response to a situation is to try and work out what signal these feelings are trying to convey.'],
        correct_response: 'The second step of an emotionally-informed response to a situation is to try and work out what signal these feelings are trying to convey.', 
        required: true
      },
      {
        type: 'multi-choice',
        prompt: `3`, 
        name: 'int_is_3', 
        options: ['In general, emotions and feelings can get in the way when trying to make sense of our experiences, so we should try to change or control them.', 
                  'In general, the messages or signals conveyed by emotions are important, so we should try to learn to live in harmony with them.'],
        correct_response: 'Making sense of the messages or signals conveyed by emotions can help to reconciles us to positive and negative events in our life.', 
        required: true
      }
    ]
  ],
  show_question_numbers: 'off',
  required_question_label: "",
  button_label_finish: 'continue',
  on_finish: function() {
    // get response and RT data
    var respData = jsPsych.data.getLastTrialData().trials[0].response;
    var respRT = jsPsych.data.getLastTrialData().trials[0].rt;
    saveQuestData("intervention_is", respData, respRT);
  }
};

///////////////////////////////////////////// CONCAT ////////////////////////////////////////////////////////
var timeline_intervention = [];
timeline_intervention.push(introText);
if ( randCond == "psychoed") {
  timeline_intervention.push(pe_background);
  timeline_intervention.push(pe_example_1);  
  timeline_intervention.push(pe_example_2); 
  timeline_intervention.push(pe_yourturn_1);  
  timeline_intervention.push(pe_yourturn_2);
  timeline_intervention.push(pe_in_summary);        
} else {
  timeline_intervention.push(ef_background);
  timeline_intervention.push(ef_example_1);  
  timeline_intervention.push(ef_example_2); 
  timeline_intervention.push(ef_yourturn_1);  
  timeline_intervention.push(ef_yourturn_2);
  timeline_intervention.push(ef_in_summary);  
};
timeline_intervention.push(continueText);  

export { timeline_intervention };