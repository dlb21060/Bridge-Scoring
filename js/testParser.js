/**
 * 
 * test bed for ParseScore.js
 * 
 */

 let parser = require('./ParseScore'); 
 
 let goodStrings = [
	 "2NN-1",
	 "2N N -1",
	 "3 s E +2",
	 "3NE+1",
	 "3NW=",
	 "6 c E +1",
	 "6S S -1",
	 "6S S x -1",
	 "6SSx -1",
	 "6ssXX -1",
 ]; 

 let badStrings = [
	 "2NG-1",
	 "2X N -1",
	 "3 s J +2",
	 "33NE+1",
	 "3NW==",
	 "3 N E =2",
	 "6SSxxx -1",

 ]; 
 
 console.log("\n\n----------- Good Strings -----------\n");
 
 for(let ii=0; ii < goodStrings.length; ii++)
 {
		 console.log(goodStrings[ii]); 
		 console.log(parser.parseResult(goodStrings[ii])); 
 }

 console.log("\n\n----------- Bad Strings -----------\n");
 
 for(let ii=0; ii < badStrings.length; ii++)
 {
		 console.log(badStrings[ii]); 
		 console.log(parser.parseResult(badStrings[ii])); 
 }
 
 
 


