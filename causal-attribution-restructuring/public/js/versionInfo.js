// set up variables describing this specific task version

// task version
var version = "causal-attr-pe3";			       // experiment version (used to create data collection in firestore)
var infoSheet = "../assets/participant-information-sheet-220311_amendment_accepted_220518.pdf";  
var briefStudyDescr = "For this particular study, we will ask you to think about reasons behind different everyday situations. "+
					  "At the end, you will also be also asked to answer some brief questions about yourself. ";

// are we debugging, or running for real?
var debugging = false;							// !!set to "false" for real exp!!

// time and payment info for this task version
var approxTime = 45;   			 				// approx time to complete this version of the experiment (minutes)
var hourlyRate = 7.5;							// 7.50 hourly rate (GBP)
var baseEarn = ((approxTime/60)*hourlyRate);   
var bonusRate = 1.6;			 	 			// additional bonus per X (GBPpence)
const maxCorr = 60;
var maxBonus = (maxCorr*bonusRate)/100;        
var nQuests = 3;  								// how many questionnaires will we ask participant to complete?      
let allowDevices = false;                		// allow participants to access this task on mobile devices?

// set task variables
var nBlocksChoice = 2;
var nBlocksLearning = 3;
var nScenarios = "three";

// randomly assign intervention condition
var randCond;
let r = Math.random();                          // (no random seed availble for this rng as this depends on browser)
if (r < 0.5) {
	randCond = "control";
} else {
	randCond = "psychoed";
}
var taskConds = ["baseline", randCond];			// all participants complete same baseline condition

export { version, infoSheet, briefStudyDescr, debugging,
		 approxTime, hourlyRate, baseEarn, bonusRate, maxBonus, 
		 nQuests, allowDevices, nBlocksChoice, 
		 nBlocksLearning, nScenarios, randCond, taskConds 
		};