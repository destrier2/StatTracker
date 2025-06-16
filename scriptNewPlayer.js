const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";

document.getElementById("newPlayer").addEventListener("submit", function (event) {
    event.preventDefault();
	console.log("All players: ", localStorage.getItem(PLAYERS_KEY));
	let playerName = document.getElementById("playerName").value;
	let playerNum = document.getElementById("playerNumber").value;
	let playerGender = "W";
	if (playerOpen.checked) {
		playerGender="O";
	}
	if (storeNewPlayer(playerName, playerNum, playerGender)) {
		document.location="viewPlayers.html";
	}
});

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
		const newPlayer = { name: playerName, number:playerNum, gender: playerGender, ta:0, d:0, g:0, a:0, twoa:0, re:0 };
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