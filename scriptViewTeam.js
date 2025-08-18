const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";
let teamName;

function addPlayerToTable(playername, playernum, playergender, ta, d, g, a, twoa, re) {
	var table = document.getElementById("roster");
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

document.getElementById("deleteTeam").addEventListener("click", function(event) {
    let teams = [];
	try {
		teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
    const team = teams.find(team => team.name === teamName);
    teams.splice(teams.indexOf(team), 1);
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teams)); //Push changes to storage
    teamName = null;
    location.reload();
});
    
document.getElementById("addPlayer").addEventListener("submit", function(event) {
	event.preventDefault(); //Prevent default
	//Check if player is already in the list
	let playername = document.getElementById("pName").value;
		//Load the teams
	let teams = [];
	try {
		teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
	const team = teams.find(team => team.name === teamName);
	const exists = team.players.some(player => player === playername);
	if (exists) {
		alert("This person already is on this team!")
	} else {
		//Add another element to a list 
		addPlayerToTeam(playername, teamName);
	}
	/*document.getElementById("teamName").innerHTML=teamName;
	openTeam();*/
	document.getElementById("pName").value="";
	openTeam();
});

function addPlayerToTeam(playername, teamname) {
	//Load the players
	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
	//Load the teams
	let teams = [];
	try {
		teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
	
	//Check if the player exists
	const exists = players.some(player => player.name === playername);
	if (exists) { //If player exists, add player to team
		const team = teams.find(team => team.name === teamName);
		team.players.push(playername);
		localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
	} else {
		alert("No player by this name found");
	}
}

document.getElementById("teamName").addEventListener("keydown", function(event) {
	if (event.key==='Enter') {
		event.preventDefault();
		teamEntered();
	}
});

function teamEntered() {
	teamName = document.getElementById('teamName').value;
	openTeam();
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

window.onbeforeunload = function() {
	if (teamName){
		sessionStorage.setItem("teamName", teamName);
	} else {
		sessionStorage.removeItem("teamName");
	}
};

function openTeam() {
	document.getElementById('hiddenTeamStuff').style.display='block';
	document.getElementById('playerCount').style.display='block';
	console.log("Team name is:", teamName);
	if (teamName && teamName.length > 0) {
		document.getElementById('nameHere').innerHTML = teamName;
	}
	
	//document.getElementById('teamForm').style.display='none';
	
	if (!displayTeam(teamName)) {
		//alert("something failed");
		//document.location="index.html";
	}
}

document.getElementById("pName").addEventListener("input", function(event) {
	if (document.activeElement.tagName === 'INPUT') {
		let players = [];
		try {
			players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
		} catch (e) {
			return; //exit if there's an issue
		}
		let current = document.getElementById("pName").value;
		var table = document.getElementById("dropdownPlayers");
		while (table.rows.length > 0) {
			table.deleteRow(0);
		}
		players.forEach(player => checkPlayer(table, current, player));
	}
});

/*document.getElementById("pName").addEventListener("mousedown", function(event) {
	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		return; //exit if there's an issue
	}
	var table = document.getElementById("dropdownPlayers");
	while (table.rows.length > 0) {
		table.deleteRow(0);
	}
	players.forEach(player => {
		const row = table.insertRow(0);
		row.insertCell(0).innerHTML=player.name;
		row.insertCell(1).innerHTML=player.gender;
		if (table.rows.length % 2) {
			row.classList.add('dropdownOdd');
		}
		console.log("added",player.name,player.gender);
	});
});*/

document.getElementById("teamName").addEventListener("input", function(event) {
	if (document.activeElement.tagName === 'INPUT') {
		let teams = [];
		try {
			teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
		} catch (e) {
			return; //exit if there's an issue
		}
		var current = document.getElementById("teamName").value;
		var table = document.getElementById("dropdownTeams");
		while (table.rows.length > 0) {
			table.deleteRow(0);
		}
		teams.forEach(team => checkTeam(table, current, team));
	}
});

function checkTeam(table, current, team) {
    if (team.name.substring(0, current.length) === current) {
        var row = table.insertRow(0);
		row.insertCell(0).innerHTML=team.name;
		if (table.rows.length % 2) {
			row.classList.add('dropdownOdd');
		}
        
        row.addEventListener('mousedown', function(event) {
            document.getElementById('teamName').value = team.name;
			teamEntered();
        });
	}
}

document.addEventListener('mousedown', function(event) {
	var table = document.getElementById("dropdownPlayers");
	while (table.rows.length > 0) {
		table.deleteRow(0);
	}
    var table = document.getElementById("dropdownTeams");
	while (table.rows.length > 0) {
		table.deleteRow(0);
	}
});

function checkPlayer(table, current, player) {
	if (player.name.substring(0, current.length) === current) {
		var row = table.insertRow(0);
		row.insertCell(0).innerHTML=player.name;
		row.insertCell(1).innerHTML=player.gender;
		if (table.rows.length % 2) {
			row.classList.add('dropdownOdd');
		}

        row.addEventListener('mousedown', function(event) {
            document.getElementById('pName').value = player.name;
        });
        
	}
}

function displayTeam(teamname) {
	let teams = [];
	try {
		teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
	} catch (e) {
		//alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		//alert("Error. Please try again.");
		return false; //exit if there's an issue
	}	
	//Check if the team exists
	const exists = teams.some(team => team.name === teamname);
	if (exists) {
		document.getElementById("hiddenTeamStuff").style.display="block";
		if (teamname) {
			const team = teams.find(team => team.name === teamname);
			//Clear history
			const table = document.getElementById("roster");
			while (table.rows.length > 1) {
				table.deleteRow(1);
			}
			team.players.forEach(person => {
				const player = players.find(player => player.name === person);
				addPlayerToTable(player.name, player.number, player.gender, player.ta, player.d, player.g, player.a, player.twoa, player.re);
			});
			//team.players.forEach(player => addPlayerToTable(player.name, player.number, player.gender, player.ta, player.d, player.g, player.a, player.twoa, player.re));
		}
		return true;
	} else {
		alert("No team found.");
		document.getElementById("hiddenTeamStuff").style.display="none";
		return false;
	}
}

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
	if (sessionStorage.getItem("teamName") !== null) {
		teamName = sessionStorage.getItem("teamName");
		openTeam();
		console.log("team name should be ", teamName);
	}
	try {
		let bgcolor = localStorage.getItem("bgColor");
		const r = document.querySelector(':root');
		r.style.setProperty("--background", bgcolor);
	} catch (e) {
		localStorage.removeItem("bgColor"); //Delete bg color if it exists
	}
};