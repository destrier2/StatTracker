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
	
	players.forEach(player => displayPlayer(player.name, player.number, player.gender, player.ta, player.d, player.g, player.a, player.twoa, player.re));
});

function displayPlayer(playername, playernum, playergender, ta, d, g, a, twoa, re) {

	var row = table.insertRow(1);
	row.insertCell(0).innerHTML=playername;
	row.insertCell(1).innerHTML=playernum;
	row.insertCell(2).innerHTML=playergender;
	row.insertCell(3).innerHTML=ta;
	row.insertCell(4).innerHTML=d;
	row.insertCell(5).innerHTML=g;
	row.insertCell(6).innerHTML=a;
	row.insertCell(7).innerHTML=twoa;
	row.insertCell(8).innerHTML=re;
}

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