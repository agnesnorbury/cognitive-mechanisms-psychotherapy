// helper function to get Prolific subject ID from url

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
};

if (window.location.search.indexOf('PROLIFIC_PID') > -1) {
	var subjectID = getQueryVariable('PROLIFIC_PID');
}
else {
   var subjectID = Math.floor(Math.random() * (2000000 - 0 + 1)) + 0;   // if no Prolific ID, generate random subject ID (for testing)
};

if (window.location.search.indexOf('STUDY_ID') > -1) {
   var studyID = getQueryVariable('STUDY_ID');
}
else {
   var studyID = 0;    // if no Prolific ID, use study ID = 0 (for testing)
};

console.log('prolific study ID: '+studyID);
console.log('prolific subject ID: '+subjectID);