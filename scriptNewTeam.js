const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";



document.getElementById("newteamName").addEventListener("keydown", function(event) {
	if (event.key==='Enter') {
		event.preventDefault();
		let teamName = document.getElementById('newteamName').value; 
		
		document.getElementById('newteamForm').style.display='none';
		
		if (!storeNewTeam(teamName)) {
			document.location="index.html";
			sessionStorage.remove("teamName");
		} else {
			//alert("Team created successfully");
			sessionStorage.setItem("teamName", teamName);
			document.location="viewTeam.html";
		}
	}
});

function storeNewTeam(teamname) {
	let teams = [];
	try {
		teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}

	console.log("LocalStorage content:", localStorage.getItem(TEAMS_KEY));
	
	//Check if the team exists
	const duplicate = teams.some(team => team.name === teamname);
	if (duplicate) {
		alert("Team already exists");
		return false;
		
	} else {
		let team = { name:teamname, players:[] };
		teams.push(team);
		localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
		return true;
	}
}

/*
document.addEventListener('DOMContentLoaded', function() {
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
*/