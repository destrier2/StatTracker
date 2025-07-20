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
	location.reload();
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
		teamName = document.getElementById('teamName').value;
		openTeam();
	}
});

window.addEventListener('load', () => {
  // Create debug console container
  const debugDiv = document.createElement('div');
  debugDiv.id = 'debugConsole';
  Object.assign(debugDiv.style, {
    position: 'fixed',
    bottom: '0',
    left: '0',
    width: '100%',
    maxHeight: '150px',
    overflowY: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#0f0',
    fontSize: '12px',
    fontFamily: 'monospace',
    zIndex: '99999',
    padding: '4px',
    whiteSpace: 'pre-wrap',
  });
  document.body.appendChild(debugDiv);

  // Function to add messages to debug console
  window.logDebug = function(msg) {
    const p = document.createElement('div');
    p.textContent = msg;
    debugDiv.appendChild(p);
    debugDiv.scrollTop = debugDiv.scrollHeight;
  };

  // Override console.log to also output to debug console
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    originalConsoleLog.apply(console, args);
    window.logDebug(args.join(' '));
  };

  // Catch and log uncaught errors
  window.addEventListener('error', event => {
    window.logDebug(`ERROR: ${event.message} at ${event.filename}:${event.lineno}`);
  });

  // Example test log
  console.log('Debug console initialized.');
});


window.onload = function() {
	if (sessionStorage.getItem("teamName") !== null) {
		teamName = sessionStorage.getItem("teamName");
		openTeam();
	}
};

window.onbeforeunload = function() {
	if (teamName){
		sessionStorage.setItem("teamName", teamName);
	} else {
		sessionStorage.removeItem("teamName");
	}
};

function openTeam() {
	document.getElementById('hiddenTeamStuff').style.display='block';
	
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

