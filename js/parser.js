/**
* javascript module to parse bridge scores
* 
* 
* @author Doug Lawson  (dlb21060@gmail.com)
* 
* Copyright (C) 2023 Doug Lawson 
* 
* This file is part of Bridge Scoring (Simplified Chicago) (also known as BS(SC) ) 
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
*/

/**
*
* Since this module will be (typically) opened via the 
* "file://..." syntax, and not from a server, it should be included in 
* the web page being opened by using the <script ...> tag.
* 
*/ 

const blankStringRegEx = /^\s*$/; 
const simpleScoreRegEx = /^([1-7])\s*([CcDdHhSsNn])\s*([xX]{0,2})\s*([NnEeSsWw])\s*(=|[+-][\d]*)$/;
const passoutRegEx = /^\s*PASS(ED)?\s*(OUT)?\s*$/i;

const MTSTRING = "empty result"; 
const ERRSTRING = "ERROR PARSING RESULT";
const PASSEDOUT = "passed out"; 

/**
 * interpret the input string
 * 
 * called by calculate() in scoring.js, ~line 110 
 * 
 *  @return scoreResult object. 
 */
function parseResult(inputString) {
	let scoreResult = {
			  message: "", 
			  level: 0,
			  denom: "",
			  player: "", 
			  result: "",
			  double: ""
			}; 
	let blankFound = inputString.match(blankStringRegEx); 
    let passFound = inputString.match(passoutRegEx); 
	if(blankFound){
		console.log("empty String"); 
		scoreResult.message = MTSTRING; 
	}else if(passFound){ 
			console.log("PASSED OUT"); 
			scoreResult.message=  PASSEDOUT; 
			scoreResult.handNumber = scoreArray.length +1;
	}else { 
    let found = inputString.match(simpleScoreRegEx); 
	if(!found){
		console.log("no match to " + inputString +" " +  ERRSTRING); 
		scoreResult.message=  ERRSTRING; 
		// close off the 'remove previous' button 
	}else {
		// console.log(found); 
		scoreResult.handNumber = scoreArray.length +1;
		console.log("hand number: " + scoreResult.handNumber); 
		scoreResult.level = found[1]; 
		scoreResult.denom = found[2].toUpperCase(); 
		scoreResult.double = found[3].toLowerCase(); 
		scoreResult.player = found[4].toUpperCase();
		scoreResult.result = (found[5] == "=") ? 0: found[5];
		scoreResult.vul = vulnerabilities[(scoreResult.handNumber -1) % vulnerabilities.length];  
		console.log("VUL:" + scoreResult.vul); 
		calculateVul(scoreResult); 
// 	    console.log(scoreResult); 
	    eraseError(); 
	    if(resultIsImpossible(scoreResult)){ 
	    	scoreResult = null; 
	    }
	}
	}
	return scoreResult; 
}  

/**
 * handle impossible results, when the score indicates that 
 * declarer took more than 13 tricks or fewer than 0 
 * 
 */
function resultIsImpossible(scoreResult){
	let rslt = false; 
	let trickCount = 6 + parseInt(scoreResult.level) + parseInt(scoreResult.result);
	console.log("trick count: " + trickCount); 
	if(trickCount > 13){rslt= true;  }
	if(trickCount < 0){rslt= true;  }
	
	return rslt; 
}
/* */ 

// uncomment the line below to test in node.js
// module.exports.parseResult = parseResult; 


