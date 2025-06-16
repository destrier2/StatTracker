/*document.getElementById("test").addEventListener("click", function() {
	//alert("Button was clicked! alert");
	document.getElementById("testText").style.display='block';
});*/

const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";

document.getElementById("clearStorage").addEventListener("click", function(event) {
	localStorage.clear();
	console.log("cleared storage");
});
document.getElementById("viewStorage").addEventListener("click", function(event) {
	console.log("Players Storage:", localStorage.getItem(PLAYERS_KEY));
	console.log("Teams Storage:", localStorage.getItem(TEAMS_KEY));
});

/*document.getElementById("addPlayer").addEventListener("click", function(event) {
	document.getElementById('hiddenAddPlayer').style.display='block';
	this.style.display='none';
	
	//localStorage.clear();
	//alert('Cleared local storage');
});*/

/*document.getElementById("addedNewPlayer").addEventListener("click", function(event) {
	event.preventDefault();
	var table=document.getElementById('roster');
	var row=roster.insertRow(1);
	
	let playerName = document.getElementById("pName").value;
	let pGender;
	if (document.getElementById("pW").checked) {
		pGender = "W";
	} else {
		pGender = "O"
	}
	
	if (storeNewPlayer(playerName, pGender)) {
	
		row.insertCell(0).innerHTML=playerName;
		row.insertCell(1).innerHTML=pGender;
		row.insertCell(2).innerHTML="0";
		row.insertCell(3).innerHTML="0";
		row.insertCell(4).innerHTML="0";
		row.insertCell(5).innerHTML="0";
		row.insertCell(6).innerHTML="0";
		row.insertCell(7).innerHTML="0";
		
		document.getElementById("formAddPlayer").reset();
	}
		
});*/