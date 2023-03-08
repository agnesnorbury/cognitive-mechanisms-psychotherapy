// Consent form: first thing to be run, requires full completion before passing on to task and other content

// import task-version relevant info and functions
import { version, infoSheet, briefStudyDescr, debugging, approxTime, hourlyRate, baseEarn, bonusRate, maxBonus, allowDevices } from "./versionInfo.js";
import { saveConsent } from "./saveData.js";
import { runTask } from "./task.js";	 	

// create task pre-instructions using task-version specific info
const preInstructions = "<div class=\"row\"> "+ 
	"<div class=\"col-3\"></div> "+ 
	"<div class=\"col-6\"> "+ 
	"<p><b>Thank you for agreeing to take part in this study!</b></p>"+
	"<p>"+briefStudyDescr+"</p>" + 
	"<p>" + 
	"We expect this study to take around <b>"+approxTime.toString()+" minutes</b> to complete. "+
	"Since the hourly payment rate for this study is £"+hourlyRate.toFixed(2)+", "+
	"you will earn <b>at least £"+baseEarn.toFixed(2)+" if you fully complete the study</b> "+
	"(both games and the questionnaires). "+
	"</p>" + 
	"<p>" + 
	"Everyone who successfully completes the study will also earn a <b>bonus payment</b>. "+
	"The exact amount will depend on the options you choose during the games. "+
	"Specifically, you will earn an extra "+bonusRate.toString()+" pence for every coin "+
	"you collect during the games (the maximum possible bonus you can earn during this study is "+
	"<b>£"+maxBonus.toFixed(2)+"</b>). Your bonus will be calculated at the end of the study "+
	"and added to your payment from Prolific."+
	"</p>" + 
	"<p>" + 
	"<b>IMPORTANT: If you close the study tab or window in your browser your "+
	"progress will be lost, and you will not be able to start the study again. Please "+
	"make sure you click the final 'complete study' button at the end of the game, in order to "+
	"submit your data back to Prolific and receive your payment.</b> "+
	"</p>" + 
	"<p>" + 
	"If you experience any technical difficulties, or have any other questions about "+
	"the study, please get in touch with us at "+
	"<a href=\"mailto:ion.mpc.cog@ucl.ac.uk\">ion.mpc.cog@ucl.ac.uk</a>, and we will aim "+
	"to respond to you as quickly as possible. "+
	"</p>" + 
	"<p>" + 
	"Press the <b>begin study</b> button below when you are ready to start the first session!"+
	"</p>" + 
	"<br>"+ 
	"<input type=\"submit\" id=\"startStudy\" value=\"begin study\" style=\"margin-left: 40%;\">"+
	"<br><br>"+
	"</div>"+ 
	"<div class=\"col-3\"></div>"+ 
	"</div>";

// information sheet and consent form (this text will be the same for all experiments)
const infoConsentText = "<div class=\"row\"> "+ 
	" 	<div class=\"col-3\"></div> "+ 
	" 	<div class=\"col-6\"> "+ 
	"	<img src=\"./assets/imgs/ucl-banner-land-brightblue-rgb.png\" alt=\"UCL logo\" style=\"width:100%;\">"+
	"   <h2>Modular Tests of Cognitive Interventions:<br>"+
	"		Participant Information and Consent</h2>"+ 
	" 		<p><b>Introduction</b></p> "+ 
	" 		<p>  " + 
	" 		You are being invited to take part in an online research study. Before you decide to take part, it is "+
	"		important for you to understand why the research is being done, and what taking part will involve.  "+
	"		Please take the time to read the following information carefully, and discuss it with others if you wish. "+
	"		Please ask us if anything is not clear or if you would like more information." + 
	" 		</p>  " + 
	"  " + 
	" 		<p><b>What is the purpose of this study?</b></p> "+ 
	" 		<p>  " + 
	" 		We hope that this study will allow us to better understand how psychological treatments "+
	"		(such as cognitive-behavioural therapy) work, and who they work for. In the future, this "+
	"		knowledge may help us guide people towards psychological treatments that are more likely to work for them."+ 
	" 		</p>  " + 
	"  " + 
	" 		<p><b>What is involved in the study?</b></p> "+ 
	" 		<p>  " + 
	" 		The study involves performing different online tasks. These may include both questionnaires and "+
	"		different kinds of computerised games. We hope these games will help us understand how the kinds "+
	"		of thought processes targeted by psychological treatments work."+ 
	" 		</p>  " + 
	"  " + 
	" 		<p><b>Why have I been invited?</b></p> "+ 
	" 		<p>  " + 
	" 		In order to help us understand how these kinds of thought processes work, and how they might vary "+
	"		across the population, we are inviting lots of different people to take part in our study. The only "+
	"		requirements are that you are an adult (aged 18 or older) and speak fluent English. This is because "+
	"		the different study components (questionnaires and games) are currently only available in English." + 
	"  " + 
	" 		<p><b>Do I have to take part?</b></p> "+ 
	" 		<p>  " + 
	" 		It is completely up to you to whether you decide to take part or not. You can also stop taking part "+
	"		(withdraw) at any point without giving a reason. If this happens, you will not be penalized in any way."+
	"		If you decide to withdraw after starting the study, we will keep any information about you that we have "+
	"		already collected. This is to ensure the integrity of any conclusions drawn from the research data. "+
	"		If you wish your data to be deleted, please email us at "+
	"		<a href=\"mailto:ion.mpc.cog@ucl.ac.uk\">ion.mpc.cog@ucl.ac.uk</a>."+ 
	"  " + 
	" 		<p><b>What will happen if I decide to take part?</b></p> "+ 
	" 		<p>  " + 
	"		If you decide to take part, we will first ask you to fill out an online consent form, confirming you "+
	"		have been made aware of your rights as a research participant. We may then ask you to provide some "+
	"		background information about yourself (e.g., your age and gender). We will not ask you to provide any "+
	"		identifying information, such as your name or phone number."+
	" 		</p>  " + 
	" 		<p>  " + 
	"		You will then be asked to play some online games, that will help us better understand how different "+
	"		people learn and make decisions. For example, one game might involve learning how to choose between "+
	"		different coloured shapes, in order to win bonus rewards. Another game might involve deciding which "+
	"		different computer characters to trust to share your rewards with. At certain points, you may be asked "+
	"		to take part in short tasks that mimic parts of common psychological treatments. For example, you be asked "+
	"		to watch a short animation involving some of the computer characters you met before, and asked to reflect "+
	"		on how you feel about them."+
	" 		</p>  " + 
	" 		<p>  " + 
	"		Finally, we may ask you to fill out some questionnaires that ask about your feelings and mood, personality "+
	"		(how you tend to think and act in different situations), or thinking styles (how you tend to think about "+
	"		the world)."+
	" 		</p>  " + 
	" 		<p>  " + 
	"		Overall, these different tasks should take about <b>"+approxTime.toString()+" minutes</b>. You can take a "+
	"		break at different points during the tasks, and complete the questionnaires at a pace that suits you."+
	" 		</p>  " + 
	"  " + 
	" 		<p><b>What are the possible disadvantages and risks of taking part?</b></p>"+ 
	" 		<p>  " + 
	" 		<b>Risks related to filling out the questionnaires</b>. Some of the questionnaires may ask about your "+
	"		feelings and mood, including stress, worry, and feeling low. Please note that none of these questionnaires"+
	"		are sufficient by themselves to diagnose mental health problems, therefore we will not be providing any "+
	"		feedback based on your responses. However, if you become upset at any point when answering these questions, "+
	"		or are concerned about your mental health for any other reason, we recommend the below resources for further "+
	"		information. You may also wish to discuss any concerns with your family doctor."+ 
	" 		</p>  " +
	"		<ul>  " +
	"		<p><li><a href=\"http://mind.org.uk\">Mind Charity</a></li></p>"+
	"		<p><li><a href=\"https://www.samaritans.org\">The Samaritans</a></li></p>"+
	"		<p><li><a href=\"https://www.nhs.uk/mental-health\">NHS Choices mental health page</a></li></p>"+
	"		</ul>  " +
	" 		<p>  " + 
	"		Please also note that although taking part in this study might involve experience of elements of common "+
	"		evidence-based psychological treatments, this in itself is not expected to lead to any substantial or "+
	"		meaningful improvement in any psychological symptoms you might experience."+
	" 		</p>  "+ 
	" 		<p>  " + 
	"		If at any point during completion of the study you have thoughts of harming yourself, please go "+
	"		immediately to your nearest emergency department, or call 999."+
	" 		</p>  " + 
	" 		<p>  " + 
	"		<b>Risks related to your personal data</b>. In any research study that collects sensitive data, "+
	"		there is a risk of loss of private information. Although we will not attempt to collect any identifying "+
	"		information as part of this study, this risk always exists. There are procedures in place to minimize "+
	"		this risk."+
	" 		</p>  " + 
	" 		<p>  " + 
	"		<b>Risks related to public sharing of anonymized data</b>. To do more powerful research, it is helpful for "+
	"		researchers to share information. They do this by putting it into scientific databases, where it is stored "+
	"		along with information from other studies. Researchers can then study the combined information to learn even "+
	"		more about health and disease. If you agree to take part in this study, some of your anonymized information "+
	"		might be placed into one or more scientific databases. Researchers will always have a duty to protect your "+
	"		privacy and to keep your information confidential, but there are risks associated with data sharing. "+
	"		For example, although we will not share with other researchers your name or other identifying details, your "+
	"		data may be linked to information such as your race, ethnic group, or gender. This information helps "+
	"		researchers learn whether the factors that lead to health problems are the same in different groups of people. "+
	"		It is possible that such findings could one day help people of the same race, ethnic group, or gender as you. "+
	"		However, they could also be used to support harmful stereotypes or even promote discrimination."+
	" 		</p>  "+ 
	"  " + 
	" 		<p><b>What are the possible benefits of taking part?</b></p>"+ 
	" 		<p>  " + 
	" 		There are no expected benefits to you from taking part. However, we hope that in the future results of this "+
	"		study might help us improve the effectiveness of psychological treatments for common mental health problems."+
	"  " + 
	"		You will be reimbursed for the time you spend taking part in the study a rate equivalent to "+
	"		<b>£"+hourlyRate.toFixed(2)+" per hour</b>. "+
	"		If you decide to withdraw from the study before the end you will be reimbursed for the parts you completed."+
	" 		</p>  " + 
	"  " + 
	" 		<p><b>What will happen to the results from the study?</b></p>"+ 
	" 		<p>  " + 
	" 		We plan to report our findings in scientific journals and present them to researchers at meetings and "+
	"		conferences. You will not be identified in any reports or publications from the study. If you would like "+
	"		to be informed of the results of this study, please inform the researcher. To make the best use of the "+
	"		data, we may make fully anonymised data available for further research and such data will be kept "+
	"		indefinitely. Shared data will not contain any information that could be used to identify you. "+ 
	"		</p>  "+ 
	"  " + 
	" 		<p><b>What if something goes wrong?</b></p>"+ 
	" 		<p> "+
	"		If you have any comments or concerns about any aspect of the study (e.g., the way you have been approached or"+
	"		treated during the study) you may speak to the Chief Investigator, "+
	"		<a href=\"mailto:q.huys@ucl.ac.uk\">Dr Quentin Huys</a>. If you wish to make a formal complaint, please "+
	"		write to us at the Max Planck UCL Centre for Computational  Psychiatry and Ageing Research, Russell Square "+
	"		House, London WC1B 5EH. If you feel that your complaint has not been handled to your satisfaction, "+
	"		you can contact the chair of the <a href=\"mailto:ethics@ucl.ac.uk\">UCL Research Ethics Committee</a> "+
	"		(+44 (0)20 7679 8717)."+ 
	"  " + 
	" 		<p><b>Will my taking part in this project be kept confidential?</b></p>"+ 
	" 		<p>  " + 
	" 		All the information that we collect during the course of the research will be kept strictly confidential. "+
	"		Professional standards of confidentiality will be adhered, and the handling, processing, storage and "+
	"		destruction of data will be conducted in accordance with the relevant information governance legislation."+
	"		Data may be looked at by responsible individuals from the sponsor for the purpose of monitoring and auditing "+
	"		or from regulatory authorities. This data will only be linked to a code and not your name. You will not be "+
	"		able to be identified in any ensuing reports or publications. Any information made available for research "+
	"		purposes will be done so in a coded form so that confidentiality is strictly maintained." + 
	"		</p>  "+ 
	"  " + 
	" 		<p><b>Local Data Protection Privacy Notice</b></p>"+ 
	" 		<p>  "+ 
	" 		The controller for this project will be University College London (UCL). The UCL Data Protection Officer "+
	"		provides oversight of UCL activities involving the processing of personal data, and can be contacted at "+
	"		<a href=\"mailto:data-protection@ucl.ac.uk\">data-protection@ucl.ac.uk</a>. This ‘local’ privacy notice sets "+
	"		out the information that applies to this particular study. Further information on how UCL uses participant "+
	"		information can be found in our ‘general’ privacy notice "+
	"		<a href=\"https://www.ucl.ac.uk/legal-services/privacy/ucl-general-research-participant-privacy-notice\">here</a>."+
	"		The information that is required to be provided to participants under data protection "+
	"		legislation (GDPR and DPA 2018) is provided across both the ‘local’ and ‘general’ privacy notices. "+
	"		If you are concerned about how your personal data is being processed, or if you would like to contact us "+
	"		about your rights, please contact UCL in the first instance at "+
	"		<a href=\"mailto:data-protection@ucl.ac.uk\">data-protection@ucl.ac.uk</a>. " + 
	"		</p>  "+ 
	"  " + 
	" 		<p><b>Who is organising and funding the research?</b></p>"+ 
	" 		<p>  "+ 
	" 		This study is organised by Dr Quentin Huys and colleagues at the Max Planck UCL Centre for Computational "+
	"		Psychiatry and Ageing Research at UCL. The study is sponsored by University College London and financially "+
	"		supported by the Conny Maeva Charitable Foundation, the Wellcome Trust, and Koa Health." + 
	"		</p>  "+ 
	"  " + 
	" 		<p><b>If I have further questions, who I can talk to?</b></p>  "+ 
	" 		<p>  " + 
	"		If you have any further questions or comments, please contact us at the Max Planck Centre for Computational "+
	"		Psychiatry and Ageing Research at University College London on +44 (0)203 108 7538 or email us on "+
	"		<a href=\"mailto:ion.mpc.cog@ucl.ac.uk\">ion.mpc.cog@ucl.ac.uk</a>." + 
	"		</p>  " + 
	" 		<p style=\"background-color:powderblue;\">  "+ 
	"  " + 
	" 		<b>Please <a href="+infoSheet+" download>download and save</a>"+
	" 		a copy of this Information Sheet for your records.</b>"+
	"  " + 
	" 		</p>  " + 
	"  " + 
	" 		<p><b>To indicate your consent to take part in this study, please read the statements below and tick the box"+
	"		if you agree with each statement. You can only take part in the study if you agree with all the statements.</b></p> "+ 
	"  " + 
	" 		</p>  " + 
	" 		<label class=\"container\"> " + 
	" 		<input type=\"checkbox\" id=\"consent_checkbox1\">  " + 
	" 		I have read and understood the above Information Sheet (Version 1, 12/10/2021)."+
	"		I have had an opportunity to consider the information and what will be expected of me. "+
	"		I have also had the opportunity to ask questions which have been answered to my satisfaction." + 
	" 		<span class=\"checkmark\"></span>  " + 
	" 		</label>  " + 
	" 		<br> <br> " + 
	"  " + 
	" 		<label class=\"container\"> " + 
	" 		<input type=\"checkbox\" id=\"consent_checkbox2\">  " + 
	" 		I consent to the processing of my personal data for the purposes explained to me in the "+
	"		Information Sheet. I understand that my information will be handled in accordance with all"+
	"		 applicable data protection legislation and ethical standards in research." + 
	" 		<span class=\"checkmark\"></span>  " + 
	" 		</label> <br><br> " + 
	"  " + 
	" 		<label class=\"container\"> " + 
	" 		<input type=\"checkbox\" id=\"consent_checkbox3\">  " + 
	" 		I understand that I am free to withdraw from this study at any time without giving a "+
	"		reason and this will not affect my future medical care or legal rights." + 
	" 		<span class=\"checkmark\"></span> <br><br> " + 
	" 		</label>  " + 
	"  " + 
	" 		<label class=\"container\"> " + 
	" 		<input type=\"checkbox\" id=\"consent_checkbox4\">  " + 
	" 		I understand the potential benefits and risks of participating, the support available "+
	"		to me should I become distressed during the research, and whom to contact if I wish to lodge a complaint." + 
	" 		<span class=\"checkmark\"></span> <br><br> " + 
	" 		</label>  " + 
	"  " + 
	" 		<label class=\"container\"> " + 
	" 		<input type=\"checkbox\" id=\"consent_checkbox5\">  " + 
	" 		I understand the inclusion and exclusion criteria set out in the Information Sheet. "+
	"		I confirm that I meet the inclusion criteria." + 
	" 		<span class=\"checkmark\"></span> <br><br> " + 
	" 		</label>  " + 
	"  " + 
	" 		<label class=\"container\"> " + 
	" 		<input type=\"checkbox\" id=\"consent_checkbox6\">  " + 
	" 		I understand that my anonymised personal data can be shared with others for future research, "+
	"		shared in public databases, and in scientific reports." + 
	" 		<span class=\"checkmark\"></span> <br><br> " + 
	" 		</label>  " + 
	"  " + 
	" 		<label class=\"container\"> " + 
	" 		<input type=\"checkbox\" id=\"consent_checkbox7\">  " + 
	" 		I understand that the data acquired is for research purposes and agree to it being kept "+
	"		and analysed even if and after I withdraw from the study." + 
	" 		<span class=\"checkmark\"></span> <br><br> " + 
	" 		</label>  " + 
	"  " + 
	" 		<label class=\"container\"> " + 
	" 		<input type=\"checkbox\" id=\"consent_checkbox8\">  " + 
	" 		I am aware of who I can contact should I have any questions or if any issues arise." + 
	" 		<span class=\"checkmark\"></span> <br><br> " + 
	" 		</label>  " + 
	"  " + 
	" 		<label class=\"container\"> " + 
	" 		<input type=\"checkbox\" id=\"consent_checkbox9\">  " + 
	" 		I voluntarily agree to take part in this study." + 
	" 		<span class=\"checkmark\"></span> <br><br> " + 
	" 		</label>  " + 
	" 		<br>  " + 
	"		<input type=\"submit\" id=\"start\" value=\"continue\" style=\"margin-left: 40%;\">"+
	" 		<br><br> " + 
	" 	</div> " + 
	" 	<div class=\"col-3\"></div> " + 
	" </div> ";

// create info sheet and consent form in consent div within consent-container 
document.getElementById('consent').innerHTML = infoConsentText;

// once consent form start button clicked, check consent form for completeness
var checkConsent = function () {
	// only proceed if all boxes are ticked
	//if (consent_checkbox9.checked == true) {	// [for debugging only!]
	if (consent_checkbox1.checked == true && consent_checkbox2.checked == true && consent_checkbox3.checked == true && consent_checkbox4.checked == true && consent_checkbox5.checked == true && consent_checkbox6.checked == true && consent_checkbox7.checked == true && consent_checkbox8.checked == true && consent_checkbox9.checked == true){
		if (uid) {
			// save consent data
			saveConsent(uid, version);
			// display post-consent 'pre instructions' (what exactly to expect in this version of the experiment)
			document.getElementById('consent').innerHTML = preInstructions;
			window.scrollTo(0, 0);
			document.getElementById('startStudy').onclick = runStudy;
		}
	} else {
		alert("Unfortunately you will not be able to participate in this research study if you do " +
		"not consent to the above. Thank you for your time.");
		return false;
	}
};

// once pre-instructions startStudy button clicked, hide info and run task!
var runStudy = function () {
	if (uid) {
		// hide consent-container
		document.getElementById('consent-container').style.display = "none";
		// run task!
		runTask(uid);
	}
};

// if real exp, check consent then run task - if debugging just run task
if (debugging == false) {
	document.getElementById('start').onclick = checkConsent;
} else {
	// hide consent-container
	document.getElementById('consent-container').style.display = "none";
	// run task!
	runTask(uid);
};

