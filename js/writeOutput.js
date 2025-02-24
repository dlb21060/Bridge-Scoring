/**
 * javascript file to include basic output functions for bridge scoring oage
 * 
 *
 * Since this module will be (typically) opened via the 
 * "file://..." syntax, and not from a server, it should be included in 
 * the web page being opened by using the <script ...> tag.
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
 * 
 */

/**
 *  ---------------------------------------------------------------
 *  ------------- WRITE OUTPUT 
 *  ----------------------------------------------------------------
 */
let dirNames = { 
	NS:"North - South",
	EW:"East - West",
}; 

let contractLine = ""; 

// document.getElementById("scorebody").innerHTML = tableRows; 
function loadNames() { 
	document.getElementById("NSNames").innerHTML = dirNames.NS;
	document.getElementById("EWNames").innerHTML = dirNames.EW;
}

function erasePrevious() {
	
	removePreviousScoreElement();
    scoreTotals.clear(); 
    scoreArray.forEach(item => addToTotals(item)); 
    writeHTML();
    setErasePrevious(); 
    document.getElementById("contract").value = ""; 
	// write the hand number 
	document.getElementById('hNum').innerHTML = --handNum; 

}

function setErasePrevious(){ 
	if(scoreArray.length > 0){ 
		enableErasePrevious(); 
	}else{ 
		disableErasePrevious(); 
	}
}

function disableErasePrevious() { 
	setEnabled("resetPreviousButton",true); 
}
function enableErasePrevious() { 
	setEnabled("resetPreviousButton",false); 
}


function setEnabled(elementName, boolean){ 
	document.getElementById(elementName).disabled=boolean; 
}

function formTableRow(scoreObj){
	
	let elemString = `
	  <tr class=\"handScore\">`;
	  // console.log("writing HTML for: ", scoreObj);
	  // console.log(scoreObj); 
	  // who dealt?
	  // let suit = scoreObj.denom; 
	  
	  let suitSym = suitSymbols[scoreObj.denom];
	  
	  let handDescStr = '<td class="handScoreDesc">'; 
	  let tableRow = ""; 
	  if(scoreObj.denom ==="P"){ 
		  // scoreObj.handNumber = scoreArray.length; 
		  handDescStr = PASSOUTSTR; 
		  let vullStr = vulnerabilities[(scoreObj.handNumber -1) % 4];
		  
		  if(!vullStr){ vullStr = "none";} 
			 tableRow += "<td class=\"handNum\">"
			  +"hand #" 
			  + scoreObj.handNumber
			  + "<br/>dlr: "
			  + dealer[(scoreObj.handNumber-1) %4 ] + '<br/>'
			  + "vul: " + vullStr
			  + "</td>"; 
			 tableRow += '<td class="handScoreDesc passout">Passed Out</td>' 
			  +'<td class="handScore passout" colspan="2">no score</td>'
			  // +'<td class="handScore"></td>'
			  +'</tr>'; 

			 
			 
		  
	  }else {
	  handDescStr += scoreObj.level
	  + suitSym
	  + scoreObj.double
	  + " "
	  + scoreObj.player
	  + " " + (scoreObj.result==0? '=': scoreObj.result);   
	  handDescStr += '</td>'; 
	  // write the contract td
	  /*
   <td class="handScoreDesc">6&clubs; E -1</td>
	   */
	
	  /**
	  <td class=\"handNum\">hand #1<br/>dlr: S<br/>vul: none </th>
	  <td class=\"handScoreDesc\">6&clubs; E -1</td>
	  <td class=\"handScore\">&nbsp;</td>
	  <td class=\"handScore\">50</td>
	  </tr>;
	  */  

	  let vullStr = vulnerabilities[(scoreObj.handNumber -1) % 4];
	  
	  if(!vullStr){ vullStr = "none";} 
		 tableRow += "<td class=\"handNum\">"
		  +"hand #" 
		  + scoreObj.handNumber
		  + "<br/>dlr: "
		  + dealer[(scoreObj.handNumber-1) %4 ] + '<br/>'
		  + "vul: " + vullStr
		  + "</td>"; 
		 tableRow += handDescStr; 
		 
		 let blankTD =	  '<td class="handScore">&nbsp;</td>'; 
		 let penaltyTD = '<td class="handScore">';
		 penaltyTD += "penalty: " 
			  + scoreObj.penalty
			  + '</td>';
		 
		 /*
		  * 
		  */
		 
/*
 * 		  (scoreResult.ulScore || 0)
		+ (scoreResult.gameBonus || 0) 
		+ (scoreResult.partScoreBonus || 0)
		+ (scoreResult.slamBonus || 0)
		+ (scoreResult.otScore || 0)
		+ (scoreResult.insult || 0); 

 */		 
		 let declScoreTD = '<td class="handScore">';
		 declScoreTD += "contract: " + scoreObj.ulScore; 
		 declScoreTD += (scoreObj.partScoreBonus)? "<br/>PartScore: " + scoreObj.partScoreBonus:''; 
		 declScoreTD += (scoreObj.gameBonus)? "<br/>game bonus: " + scoreObj.gameBonus:'';
		 declScoreTD += (scoreObj.otScore)? "<br/>overtricks: " + scoreObj.otScore:'';
		 declScoreTD += (scoreObj.slamBonus)? "<br/>slam bonus: " + scoreObj.slamBonus: ""; 
		 declScoreTD += (scoreObj.insult)? "<br/>for the insult: " + scoreObj.insult:'';
		 declScoreTD += '</td>'; 
		 
	// who gets the score? 
	// first, what is the score? 
	  if(scoreObj.penalty){ 
		  // console.log("writing HTML for penalty:");
		  switch(scoreObj.player){ 
		  case 'S':  // NS_Played the hand, so start with a blank square and
		  case 'N':  // follow with the penalty score
			  tableRow += blankTD; 
		      tableRow += penaltyTD; 
    		  break; 
		  case 'E':
		  case 'W': 
			  tableRow += penaltyTD; 
              tableRow += blankTD;
              break; 
          default: 
        	  console.log("error condition: who played the hand?"); 
        	  break; 
		  }
		}else{ // declarer made the contract  
			  switch(scoreObj.player){ 
			  case 'S':  // NS_Played the hand, so start with a score and
			  case 'N':  // follow with a blank
				  tableRow += declScoreTD; 
				  tableRow += blankTD; 
	    		  break; 
			  case 'E':
			  case 'W': 
				  tableRow += blankTD; 
				  tableRow += declScoreTD; 
	              break; 
	          default: 
	        	  console.log("error condition: who played the hand?"); 
	        	  break; 
			  }
			  
		  }  // end else, decl made the contract
	  } 
	 elemString += tableRow; 
	elemString += "</tr>\n"; 
	return elemString; 
}

const emptyRowStuff =`<td class="handScore">&nbsp;</td>
	           <td class="handScore">&nbsp;</td>
	           <td class="handScore">&nbsp;</td></tr>
	           `; 

function addEmptyRow(rowTotal){
	let result = "";
	let vulPair = vulnerabilities[rowTotal]; 
	let dlr = dealer[rowTotal]; 
	result += '<tr class="handScore"><td class="handNum"> hand #' + (rowTotal +1)
	       + '<br/>' + 'dlr: ' + dlr
	       + '<br/>' + 'vul: ' + vulPair
	       + emptyRowStuff; 
	
	// console.log(result); 

	return result; 
}

function formTotals(){
	
/*
	   <tr class="summaryTotal">
	   <td class="TotalDesc">Total</td>
	   
	  <td class="TotalDesc"></td>
	  <td class="TotalScore">760</td>
	  <td class="TotalScore">190</td>
	  </tr>
	  
*/ 
	
	let totalLine = '<tr class="summaryTotal"> <td class="TotalDesc">&nbsp</td>';  
	totalLine += "<td class=\"TotalDesc\">Total</td>";
	totalLine += "<td class=\"TotalScore\">"+scoreTotals.NS + tdClose;
	totalLine += "<td class=\"TotalScore\">"+scoreTotals.EW + tdClose;
	totalLine += "</tr>\n";
	
	return totalLine; 
}

/**
 * write all the output to the page
 */
function writeHTML(){ 
	
	
// 	console.log("writing score result --- ");
	let tableRows = tableHeadline;
	let rowTotal = 0;
	scoreArray.forEach((element)=>{
		tableRows += formTableRow(element);
		rowTotal++; 
		console.log("row total " + rowTotal); 
	}); 

	while (rowTotal < 4) {
		tableRows += addEmptyRow(rowTotal); 
		rowTotal++; 
	}
	
	tableRows += formTotals(); 
	// add a row for the totals 
	// write one row for each score result 
	document.getElementById("scorebody").innerHTML = tableRows;
	loadNames(); 
}

let errorTextHeader = "Please enter a valid result: "; 
/** 
 * write an error message. The only error we use is that
 * the input is not valid
 */
function writeError(text){
	if(text.length == 0){ 
		text = "\"\""; 
	}
	let errorText = "\"" + text +  "\"" +  " is not valid." 
   console.log(errorText); 	
	let errElement = document.getElementById("errorMessage"); 
	
	errElement.innerHTML = errorTextHeader + errorText;
	errElement.style.visibility = "visible"; // visibility
}

/** 
 * turn the error text invisible again. Used after receiving 
 * valid input 
 */
function eraseError(){
//   console.log(errorText); 	
	let errElement = document.getElementById("errorMessage"); 
	
	errElement.innerHTML = errorTextHeader;
	errElement.style.visibility = "hidden"; // visibility
}


/**
 *  -------------------------- end output 
 */

