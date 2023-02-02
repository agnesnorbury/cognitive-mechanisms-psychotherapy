// set up variables describing this specific task version

// task version
var version = "rew-eff-planning4";			    // experiment version (used to create data collection in firestore)
var infoSheet = "../assets/approved-participant-information-sheet-211012-rew-eff-planning.pdf";  
var briefStudyDescr = "For this particular study, we will ask you play two games, and also "+
					  "to answer some questions about your feelings, mood, and personal circumstances.";

// are we debugging, or running for real?
var debugging = false;							// !!set to "false" for real exp!!

// time and payment info for this task version
var approxTime = 40;   			 				// approx time to complete this version of the experiment (minutes)
var hourlyRate = 7.5;							// 7.50 hourly rate (GBP)
var baseEarn = ((approxTime/60)*hourlyRate);   
var bonusRate = 0.2;			 	 			// additional bonus per coin collected (GBPpence)
const maxCoins = 266;
var maxBonus = (maxCoins*bonusRate*2)/100;
var approxTimeTask = 14;                        // approx time to complete each task
var nQuests = 4;  								// how many questionnaires will we ask participant to complete?      
let allowDevices = false;                		// allow participants to access this task on mobile devices?

// set effort-related task variables
var effortTime = 10000;					   		// time participant will have to try and exert effort (ms)
var pracTrialEfforts = [56, 26, 52, 68, 53];    // array of efforts ppts will be asked to perform in effortTime during practice
var minPressMax = 55;        				    // set a minimum on max press count to avoid gaming the practice trials
var nBlocks = 4;

// set planning-intervention related variables
var maxRews = [65, 65, 67, 69];					// max coins participants could earn per block (if they choose max effort) 
// and randomly assign intervention condition
var randCond;
let r = Math.random();                          // (no random seed availble for this rng as this depends on browser)
if (r < 0.5) {
	randCond = "control";
} else {
	randCond = "planning";
}
var taskConds = ["baseline", randCond];			// all participants complete same baseline condition

export { version, infoSheet, briefStudyDescr, debugging,
		 approxTime, hourlyRate, baseEarn, bonusRate, maxBonus, nQuests, approxTimeTask, allowDevices, 
		 effortTime, pracTrialEfforts, minPressMax, nBlocks, 
	     maxRews, randCond, taskConds };