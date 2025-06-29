const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";
var table = document.getElementById("allPlayers");

document.addEventListener('DOMContentLoaded', function(event) {
	event.preventDefault();
    let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return; //exit if there's an issue
	}

	if (players.length > 0) {
		document.getElementById("removePlayer").style.display="inline-block";
	} else {
		document.getElementById("removePlayer").style.display="none";
	}
	
	players.sort((a, b) => { //Sort the players alphabetically
		if (a.name > b.name) {
			return -1; // b comes first
		}
		if (a.name < b.name) {
			return 1; // a comes first
		}
		return 0; // names are equal
	});

	try {
		localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
	} catch (e) {
		alert("Error saving to localStorage.");
		return;
	}
	
	players.forEach(player => displayPlayer(player.name, player.number, player.gender, player.ph, player.ta, player.d, player.g, player.a, player.twoa, player.re));
});

function displayPlayer(playername, playernum, playergender, ph, ta, d, g, a, twoa, re) {

	var row = table.insertRow(1);
	row.insertCell(0).innerHTML=playername;
	row.insertCell(1).innerHTML=playernum;
	row.insertCell(2).innerHTML=playergender;
	if (ph.length > 0) {
		let count = 0;
		let total = 0;
		ph.forEach(stat =>  {
			total+=parseFloat(stat);
			count++;
		});
		total /= count;
		row.insertCell(3).innerHTML=total.toFixed(1);
	} else {
		row.insertCell(3).innerHTML=0;
	}
	row.insertCell(4).innerHTML=ta;
	row.insertCell(5).innerHTML=d;
	row.insertCell(6).innerHTML=g;
	row.insertCell(7).innerHTML=a;
	row.insertCell(8).innerHTML=twoa;
	row.insertCell(9).innerHTML=re;
}

document.getElementById("removePlayer").addEventListener("click", function(event) {
	document.getElementById('removePlayerHiddenStuff').style.display='inline-block';
	document.getElementById("removePlayer").style.display="none";
});

document.getElementById("cancelRemove").addEventListener("click", function(event) {
	document.getElementById("removePlayerHiddenStuff").style.display="none";
	document.getElementById("removePlayer").style.display="inline-block";
});

document.getElementById("formRemovePlayer").addEventListener("submit", function(event) {
	const toDelete = document.getElementById("removePlayerName").value; //Get the player name to be deleted
	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return; //exit if there's an issue
	}
	const exists = players.some(player => player.name === toDelete); //If the player exists
	if (!exists) {
		alert("Player not found: "+toDelete);
	} else {
		const player = players.find(person => person.name === toDelete);
	    players.splice(players.indexOf(player), 1);
		localStorage.setItem(PLAYERS_KEY, JSON.stringify(players)); //Push changes to storage
	}
});

/*
function storeNewPlayer(playerName, playerNum, playerGender) {

	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return; //exit if there's an issue
	}
	
	const duplicate = players.some(player => player.name === playerName);
	
	if (duplicate) {
		alert("Already exists");
		return false;
	} else {
		const newPlayer = { name: playerName, number:playerNum, gender: playerGender };
		players.push(newPlayer);
		try {
			localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
		} catch (e) {
			alert("Error saving to localStorage.");
			return;
		}
		//localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
		console.log("after adding: ", players);
		
		console.log("LocalStorage content:", localStorage.getItem(PLAYERS_KEY));
		return true;
	}
}
*/