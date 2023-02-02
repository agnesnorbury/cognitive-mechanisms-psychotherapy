// Helper functions for saving trial data using firebase's firestore

// import task version info
import { version, randCond } from "./versionInfo.js";

// import jspsych object so can access modules
import { jsPsych } from "./constructStudy.js";

// enable persistence 
firebase.firestore().enablePersistence()
.catch(function(err) {
  if (err.code == 'failed-precondition') {  // multiple tabs open, persistence can only be enabled in one tab at a a time
  } else if (err.code == 'unimplemented') { // the current browser does not support all of the features required to enable persistence
  }
});

// initialize db
var db = firebase.firestore();

// function to save consent 
var saveConsent = function(){
  db.collection('tasks').doc('causal-attr').collection(version).doc(uid).set({
    firebaseUID: uid,                     // firebase user ID, see firebaseAuth.js
    prolificSubID: subjectID,             // prolific subject ID, see getProlificID.js
    prolificStudyID: studyID,             // prolific study ID, see getProlificID.js
    consentObtained: 'yes',               // participant only proceeds to this point if they agree to all consent items
    condition: randCond,                  // intervention condition
    consentDate: new Date().toISOString().split('T')[0],
    consentTime: new Date().toLocaleTimeString(),
    participantOS: navigator.userAgent
  }); 
};

// function to save initial data
var saveStartData = function(startTime){
  db.collection('tasks').doc('causal-attr').collection(version).doc(uid).update({
    taskStartTimeJsPsych: startTime,
    expCompleted: 0
  });
  // initialize data-storage collections
  db.collection('tasks').doc('causal-attr').collection(version).doc(uid).collection('task-data').doc('data').set({init: 1});
  db.collection('tasks').doc('causal-attr').collection(version).doc(uid).collection('quest-data').doc('data').set({init: 1});
  // db.collection('tasks').doc('causal-attr').collection(version).doc(uid).collection('task-data').doc('data-backup').set({init: 1});
};

// function to save the main task data
var saveTaskData = function(trialN, dataToSave) {
  db.collection('tasks').doc('causal-attr').collection(version).doc(uid).collection('task-data').doc('data').update({[trialN]: dataToSave});
  db.collection('tasks').doc('causal-attr').collection(version).doc(uid).update({
      totalTimeJsPsych: jsPsych.getTotalTime()
    });
};

// function to save questionnaire data
var saveQuestData = function (questionnaire, dataToSave, completionRT) {
  db.collection('tasks').doc('causal-attr').collection(version).doc(uid).collection('quest-data').doc('data').update({
    [questionnaire]: dataToSave,
    [questionnaire+'_RT']: completionRT
  });
};

// function to save end data 
var saveEndData = function(){
  // save end time info
  db.collection('tasks').doc('causal-attr').collection(version).doc(uid).update({
    expEndTime: new Date().toLocaleTimeString(),
    expCompleted: 1
  });
  // // data-dump in case of any issues
  // var dataBackup = jsPsych.data.get();
  // db.collection('tasks').doc('causal-attr').collection(version).doc(uid).collection('task-data').doc('data-backup').update(dataBackup);
};

export { saveConsent, saveStartData, saveTaskData, saveQuestData, saveEndData }

