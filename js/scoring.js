 /**
 * javascript file to include constants for bridge scoring oage
 * 
 * @author Doug Lawson  (dlb21060@gmail.com)
 * 
 * Copyright (C) 2023 Doug Lawson 
 * 
 * This file is part of Bridge Scoring (Simplified Chicago) (also known as BS(SC))
 *  
 * 
 * Bridge Scoring (Simplified Chicago) is free software: you can redistribute it 
 * and/or modify it under the terms of the GNU General Public License 
 * as published by the Free Software Foundation, either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * Bridge Scoring (Simplified Chicago) is distributed in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 *  
 * See the GNU General Public License for more details. 
 * You should have received a copy of the 
 * GNU General Public License along with BSSC. 
 * If not, see <https://www.gnu.org/licenses/>.
 * 
 */ 

/**
 *  --------- CONSTANTS, VARIABLES and STRINGS -------
 */

let seatNames = { 
		S:"",
		W:"",
		N:"",
		E:""
}; 

let scoreTotals = {
		NS: 0,
		EW: 0,
		clear() {
			this.NS = 0; 
			this.EW = 0; 
		},
}; 

/**
 * used in standard Chicago where part scores carry over
 */
let belowLineScore = {
	EW: 0, 
	NS: 0,
	clear() {
		this.NS = 0; 
		this.EW = 0; 
	 }
}; 

/**
 * ------------------------------- do calculations ------------
 */

/**
 * add up the total for display later 
 */
function addToTotals(scoreResult){
	let declTotal = 0; 
	let defTotal = 0; 
	declTotal += 
		  (scoreResult.ulScore || 0)
		+ (scoreResult.gameBonus || 0) 
		+ (scoreResult.partScoreBonus || 0)
		+ (scoreResult.slamBonus || 0)
		+ (scoreResult.otScore || 0)
		+ (scoreResult.insult || 0); 
	
	defTotal += (scoreResult.penalty||0); 
	
	switch (scoreResult.player){
	case 'N':
	case 'S':
		scoreTotals.NS += declTotal; 
		scoreTotals.EW += defTotal; 
		break; 
	case 'E':
	case 'W': 
		scoreTotals.EW += declTotal; 
		scoreTotals.NS += defTotal; 
		break;
	default:   // error condition
		break; 
	}
}

function removePreviousScoreElement(){ 
	if(scoreArray.length > 0){ 
		scoreArray.pop(); 
	}
}

function calculate() {
	if(debug){ msgAlert(); }  
	let text = document.getElementById("contract").value; 
	console.log("handNum: "+ scoreArray.length); 

	// disable the erase previous button until calculations are done
	disableErasePrevious(); 

	let result = parseResult(text);
	if((result != null) && (result.message === MTSTRING)){ 
		console.log(MTSTRING); 
		eraseError(); 
	} else if((result != null) && (result.message === PASSEDOUT)){  
		eraseError();
		console.log("calculate(): passed out");
		 
		getPassoutScore(result); 
		if(!ignorePassout){ 
				scoreArray.push(result); 
				writeHTML(scoreArray);
		}
		document.getElementById("contract").value = "";
		 
	} else if(result && result.message !== ERRSTRING){ 
		getScore(result); 
		handNum++; 
		document.getElementById("hNum").innerHTML = handNum;
		console.log(result + " hand number: " + handNum ); 
		scoreArray.push(result);
		// loop through the array of scoreResults and total them up
		scoreTotals.clear(); 
		scoreArray.forEach(item => addToTotals(item)); 
		writeHTML(scoreArray);
		document.getElementById("contract").value = ""; 

	}else {
		// then write the error
		writeError(text); 

	}
	setErasePrevious(); 
}

function getPassoutScore(scoreResult){
//    scoreObj.handNumber = scoreArray.length; 
	scoreResult.denom = "P"; 
	scoreResult.level = 0; 
	scoreResult.result = 0; 
	scoreResult.vul = null; 
}

/*
 * figure out if declarer was vulnerable on this deal
 */
function calculateVul(scoreResult){
	// if(scoreResult.vul  )
	let vulness = false;
	if(!scoreResult.vul){ 
		vulness = false; 
	}else if (scoreResult.vul == "ALL"){
		vulness = true; 
	}else if ((scoreResult.vul == "EW") && ((scoreResult.player == "E") || (scoreResult.player == "W"))){
		vulness = true; 
	}else if ((scoreResult.vul == "NS") && ((scoreResult.player == "N") || (scoreResult.player == "S"))) {
		vulness = true; 
	}
	scoreResult.isDeclVul = vulness; 
}


function scoreOvertricks(scoreRslt){
	let denom = scoreRslt.denom; 
	let otValue = (denom == 'N' || denom == 'S' || denom == 'H') ? 30 : 20; 
	switch (scoreRslt.double){ 
	case 'x': //doubled overtricks
		if(scoreRslt.isDeclVul){ 
			scoreRslt.otScore =  200 *  scoreRslt.result;
		}else{
			scoreRslt.otScore =  100 *  scoreRslt.result;
		}
	  break; 
	case 'xx': // redoubled overtricks 
		if(scoreRslt.isDeclVul){ 
			scoreRslt.otScore =  400 *  scoreRslt.result;
		}else{
			scoreRslt.otScore =  200 *  scoreRslt.result;
		}
	  break; 
	default: 
		scoreRslt.otScore = otValue *  scoreRslt.result; 
	}
 }

/**
 * adds partial, game and slam bonuses 
 */
function scoreBonuses(scoreRslt){
	if (scoreRslt.ulScore >= 100){
		scoreRslt.gameBonus = scoreRslt.isDeclVul?    
			gameBonus.vul: gameBonus.nvul; 
	}else {
		scoreRslt.partScoreBonus = partScoreBonus; 
	}
	// add a slam bonus 
	if(scoreRslt.level >= 6){
		switch (scoreRslt.level){
		
		case "6":
		case 6: 
			scoreRslt.slamBonus = (scoreRslt.isDeclVul)? 750:500;
			break;
		case "7":
		case 7: 
			scoreRslt.slamBonus = (scoreRslt.isDeclVul)? 1500:1000;
			break; 
		default: 
			break; 
		}
	}
}


/**
 * score a notrump contract 
 * 
 * ignore doubles for now
 */
function scoreNT(scoreRslt){ 
	// how many were bid 
	let bidLevel = scoreRslt.level; 
	if(scoreRslt.result >=0){    // work in doubled scores
		// set the below line score 
		scoreRslt.ulScore = ntBidScores[scoreRslt.level-1]; 
		if(scoreRslt.double == 'x'){ 
			scoreRslt.ulScore *= 2; 
		    scoreRslt.insult = 50; 
		}else if(scoreRslt.double == 'xx'){
			scoreRslt.ulScore *= 4; 
		    scoreRslt.insult = 100; 
			}
		// is there an overtrick score 
		if(scoreRslt.result >=1){
			scoreOvertricks(scoreRslt); 		}
		scoreBonuses(scoreRslt); 
	} else {
		console.log("penalty"); 
		// figure out the penalties 
		Penalties.getPenalty(scoreRslt); 
	}
}



/** 
 * score major contracts 
 */
function scoreMajor(scoreRslt){
	// how many were bid 
	let bidLevel = scoreRslt.level; 
	if(scoreRslt.result >=0){  
		// set the below line score 
		scoreRslt.ulScore = majorBidScores[scoreRslt.level-1]; 
		if(scoreRslt.double == 'x'){ scoreRslt.ulScore *= 2; 
	    scoreRslt.insult = 50; }
		if(scoreRslt.double == 'xx'){ scoreRslt.ulScore *= 4; 
	    scoreRslt.insult = 100; }
		// is there an overtrick score 
		if(scoreRslt.result >=1){
			scoreOvertricks(scoreRslt); 		}
		scoreBonuses(scoreRslt); 
	} else {
		console.log("penalty"); 
		// figure out the penalties 
		Penalties.getPenalty(scoreRslt); 
	}
}

function scoreMinor(scoreRslt){
	// how many were bid
	let bidLevel = scoreRslt.level; 
	if(scoreRslt.result >=0){    // work in doubled scores
		// set the below line score
		scoreRslt.ulScore = minorBidScores[scoreRslt.level-1]; 
		if(scoreRslt.double == 'x'){ scoreRslt.ulScore *= 2; 
		   scoreRslt.insult = 50; }
		if(scoreRslt.double == 'xx'){ scoreRslt.ulScore *= 4; 
	       scoreRslt.insult = 100; }
		// is there an overtrick score
		if(scoreRslt.result >=1){
			scoreOvertricks(scoreRslt); 
			}
         scoreBonuses(scoreRslt); 
      } else {
		console.log("penalty"); 
		// figure out the penalties
		Penalties.getPenalty(scoreRslt); 
	}
}


/**
 * figure out the score for a hand, given the hand number 
 * and result. 
 */
function getScore(scoreResult){ 
	// who played the hand? 
	let player = scoreResult.player;
	// is declarer vul?
	if((player=='N')||(player=='S')){ 
		console.log("NS playing"); 
	}else{ 
		console.log("EW playing"); 
	}
	
   switch (scoreResult.denom) {
	// get the score 
	case "N": // no trump
		scoreNT(scoreResult); 
		break;
	case "S":
	case "H":
		// Major Suit 
		scoreMajor(scoreResult); 
		break; 
	case "C":
	case "D": 
		scoreMinor(scoreResult); 
		break; 
	default: // unreachable error
		console.log("unknown denomination"); 
		break; 
	} 
}



/**
 * 
 */
function handlePassoutSelection(bidLevel = 0) {
	 
//	let text = document.getElementById("contract").value; 
    
//	let formElement = document.forms[handParms].
    let level=parseInt(bidLevel); 
	 
	console.log("bid level " + level); 
	
	// if it's a passout, set the rest off the choices (but not the buttons) to 
	// inactive (read-only)
	if(level == 0){ 
		console.log("PASSED OUT"); 
//		postErrorMessage("pass");  
		setDisabledHandParms(true);
	}else{ 
		console.log("NOT PASSED OUT");
		setDisabledHandParms(false);
	}
}

function postErrorMessage(condition) { 
	if(condition.toLowerCase()==="pass"){ 
		document.getElementById("errorMessage").innerHTML = passoutMessage;
		document.getElementById("errorMessage").style.visibility = 'visible';  
	}
	
}

function setDisabledHandParms(trueFalse){ 
	document.getElementById("suit").disabled = trueFalse; 
	document.getElementById("player").disabled = trueFalse; 
	document.getElementById("dbl").disabled = trueFalse; 
	document.getElementById("result").disabled = trueFalse;
	document.getElementById("honors").disabled = scoreHonors ?  trueFalse : true; 
	
}

/**
 * loads the results of selection into the text-mode box
 */
function loadWhatever() { 
	// create a string
	let resultString = ""; 
	
	// handle a passout
	if(document.getElementById("bidlevel").value==="0" ){ 
		resultString = "PASSOUT"; 
		postErrorMessage("pass");  
	}else{ 

	// build a result string
	resultString += document.getElementById("bidlevel").value; 

	resultString += document.getElementById("suit").value +' ';
	resultString +=	(document.getElementById("dbl").value === '0') ? "":
        document.getElementById("dbl").value + ' '; 
	resultString += document.getElementById("player").value + ' ' +
	document.getElementById("result").value; 
	}
	console.log("RESULT " + resultString );	
	// stick the result in the text box
	document.getElementById("contract").value = resultString;
	 
	
}



/**
 * called by body.onLoad(), This method tells the system 
 * to call calculate() when the button is clicked
 */

function init() { 
	loadNames();
	setErasePrevious(); 
	handlePassoutSelection(document.getElementById("bidlevel").value); 
	if(!scoreHonors){ 
		document.getElementById("honors").style.display="none"; 
	}
	
	document.getElementById("bidlevel").addEventListener("change", (event) => {
		handlePassoutSelection(document.getElementById('bidlevel').value); 
	}); 
	
	document.getElementById("contract").addEventListener("keydown", (event) => {
	    	
		// if the enter key was pressed in the text field, do the calculation 
		if(event.keyCode == 0x0d){ 
			event.preventDefault();
			calculate();
			}
				
	}); 
	
	
    document.getElementById("calcButton").addEventListener("click",  () => { 
		calculate(); 
	}); 
	document.getElementById("scoreButton").addEventListener("click",  () => { 
		loadWhatever(); 
    }); 
	
    document.getElementById("resetPreviousButton").addEventListener("click", function(){ 
    	erasePrevious(); 	
    }); 
    
/**
 * allow the user to set the names for N-S, E-W
 */
    document.getElementById("NSNames").addEventListener("click", function(){ 
    	let nsNames = prompt("Name(s) for NS team", "North - South");
    	if(nsNames) { 
    		document.getElementById("NSNames").innerHTML = nsNames;  
    	    dirNames.NS = nsNames; 
    	   }  
    }); 
   
    document.getElementById("EWNames").addEventListener("click", function(){ 
    	let ewNames = prompt("Name(s) for EW team", "East - West");
       	if(ewNames) { 
       		document.getElementById("EWNames").innerHTML = ewNames; 
       		dirNames.EW = ewNames;
       	}  	
    }); 
   
	
}



