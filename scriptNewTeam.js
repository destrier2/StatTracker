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

window.addEventListener("online", (e) => {
	document.getElementById("ifOffline").style.display="none";
});

window.addEventListener("offline", (e) => {
	document.getElementById("ifOffline").style.display="initial";
});

window.onload = function() {
	if (!navigator.onLine) {
		document.getElementById("ifOffline").style.display="initial";
	}
	try {
		let color = localStorage.getItem("color");
		if (color.length == 7) {
			setColors(color);
		} else {
			throw TypeError;
		}
	} catch (e) {
		localStorage.removeItem("color"); //if it exists
	}
	try {
		let bgcolor = localStorage.getItem("bgColor");
		const r = document.querySelector(':root');
		r.style.setProperty("--background", bgcolor);
	} catch (e) {
		localStorage.removeItem("bgColor"); //Delete bg color if it exists
	}
};
function setColors(color) {
	const r = document.querySelector(':root');
	r.style.setProperty("--main", color);
	const red = parseInt(color.substring(1,3), 16);
	const green = parseInt(color.substring(3,5), 16);
	const blue = parseInt(color.substring(5,7), 16);

	let redVal;
	let greenVal;
	let blueVal;
	
	if (red < 40 || blue < 40 || green < 40) {
		redVal = Math.min(red+50, 255);
		blueVal = Math.min(blue+50, 255);
		greenVal = Math.min(green+50, 255);
	} else {
		redVal = Math.max(red-40, 0);
		blueVal = Math.max(blue-40, 0);
		greenVal = Math.max(green-40, 0);
	}
	let newRed = (redVal.toString(16));
	let newGreen = (greenVal.toString(16));
	let newBlue = (blueVal.toString(16));
	//Set text to white or black
	if ((red+blue+green)/3 < 255/2) {
		r.style.setProperty("--text", "white");
	} else {
		r.style.setProperty("--text", "black");
	}
	//Add length if necessary
	if (newRed.length < 2) {
		newRed = "0"+newRed;
	}
	if (newBlue.length < 2) {
		newBlue = "0"+newBlue;
	}
	if (newGreen.length <2) {
		newGreen = "0"+newGreen;
	}
	let borderColor = "#"+newRed+newGreen+newBlue;
	r.style.setProperty("--accent", borderColor);
}