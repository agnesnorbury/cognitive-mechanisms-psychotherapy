// helper functions to enable firebase authorisation

// sign in
firebase.auth().signInAnonymously().catch(function(error) {
	var errorCode = error.code;
	var errorMessage = error.message;
	console.log(errorCode);
	console.log(errorMessage);
});

// when signed in, get user ID
var uid;  
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
		uid = user.uid;
		console.log('firebase uid: '+uid);
  } else {
		uid = 'not found';
		console.log('firebase uid not found');
  }
});