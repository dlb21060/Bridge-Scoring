/**
* Constants for bridge scoring HTML page
* 
*/
/**
 * javascript file to include constants for bridge scoring oage
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



const dealer = ["N", "E", "S", "W"]; 

/** who is vul, hand wise */ 
const vulnerabilities = [
	"","EW","NS","ALL",
    "NS","EW","ALL","",
	"EW","ALL","","NS",
	"ALL","","NS","EW"
]; 

const partScoreBonus = 50; 

/** game bonuses */ 
const gameBonus = {
		vul: 500,
		nvul: 300, 
};

const suitSymbols = { 
		C: "<span class=\"blackSuit\">&clubs;</span>",
		D: "<span class=\"redSuit\">&diams;</span>",
		H: "<span class=\"redSuit\">&hearts;</span>",
		S: "<span class=\"blackSuit\">&spades;</span>",
		N: "NT",
		P: "Passed Out"
	}; 


const PASSOUTSTR = "Passed Out"; 


const tableHeadline = `
<!-- table header --> 
<tr class="scoreTableHeader">
<th width = "10%">&nbsp;</th>
<th width="30%">Contract</th>
<th width="35%">N-S<br/><span id="NSNames">test</span></th>
<th>E-W<br/><span id="EWNames">test</span></th>
</tr>
`; 

/** 
 * set this to FALSE to disable honors scoring
 */
const scoreHonors = false; 

/** 
 * set this to FALSE to score passouts and move on 
 * to the next dealer. Normal practice is to ignore passwouts. 
 */
const ignorePassout = true; 

const invalidResultMsg = "Please enter a valid result: ";

const passoutMessage = "Passed: repeat the hand with the same dealer"; 

 
/**
* 
*/
const scoreArray = []; 

let handNum = 1; 
let debug = 0; 

/**
 * value of the NT tricks declarer bid for
 */
const ntBidScores = [
	40,  // 1NT
	70,  // 2NT
	100, // 3NT
	130,160,190,220 //etc ...
]; 

const majorBidScores = [
	30,  // 1M
	60,  // 2
	90, // 3
	120,150,180,210 //etc ...
]; 

const minorBidScores = [
	20,  // 1m
	40,  // 2m
	60, // 3m
	80,100,120,140 //etc ...
]; 



const tdClose = "</td>"; 
const trClose = "</tr>"; 

/**
 * handle it when declarer goes down 
 */
const Penalties = {
	notvul: { 
		undoubled: [50, 100, 150, 200, 250, 300, 350,400,450, 500, 550, 600, 650],
		doubled:   [100, 300, 500, 800, 1100, 1400, 1700, 2000, 2300, 2600, 2900, 3200, 3500], 
		redoubled: [200, 600, 1000, 1600, 2200, 2800, 3400, 4000, 4600, 5200, 5600, 6400, 7000 ]
	}, 
    vul: { 
		undoubled: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300],
		doubled:   [200, 500, 800, 1100, 1400, 1700, 2000, 2300, 2600, 2900, 3200, 3500, 3800 ], 
		redoubled: [400, 1000, 1600, 2200, 2800, 3400, 4000, 4600, 5200, 5800, 6400, 7000, 7600 ]
    },
    getPenalty(scoreObj){ 
    	let result = -(scoreObj.result);  
    	if(scoreObj.isDeclVul){   // vulnerable 
    		if(!scoreObj.double){
    			scoreObj.penalty = this.vul.undoubled[result -1]; 
    		}else if (scoreObj.double == 'x'){ 
    			scoreObj.penalty = this.vul.doubled[result -1];
    		}else if (scoreObj.double == 'xx'){ 
    			scoreObj.penalty = this.vul.redoubled[result -1];
    		}
    	}else {               // not vulnerable 
    		if(!scoreObj.double){
    			scoreObj.penalty = this.notvul.undoubled[result -1]; 
    		}else if (scoreObj.double == 'x'){ 
    			scoreObj.penalty = this.notvul.doubled[result -1];
    		}else if (scoreObj.double == 'xx'){ 
    			scoreObj.penalty = this.notvul.redoubled[result -1];
    		}
    	}
    }
}; 

