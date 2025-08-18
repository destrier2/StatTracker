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

document.getElementById("editPlayer").addEventListener("click", function(event) {
	document.getElementById("editPlayerHiddenStuff").style.display='block';
})

document.getElementById("dropdown").addEventListener("click", function(event) {
	const dropdownValue = document.getElementById("dropdown").value;
	if (dropdownValue === "number" || dropdownValue === "pulls" || dropdownValue === "throwaways" || dropdownValue === "ds" || dropdownValue === "goals" || dropdownValue === "assists" || dropdownValue === "secondAssists" || dropdownValue === "receiverError"){
		document.getElementById("newValue").type = "number";
	} else {
		document.getElementById("newValue").type = "text";
	}
})

document.getElementById("formEditPlayer").addEventListener("submit", function(event) {
	event.preventDefault();
	//Search for the player
	let playerToEdit = document.getElementById("playerName").value;
	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return; //exit if there's an issue
	}
	const exists = players.some(player => player.name === playerToEdit); //If the player exists
	if (!exists) {
		alert("Player not found: "+playerToEdit);
	} else {
		const player = players.find(person => person.name === playerToEdit);
		const dropdownValue = document.getElementById("dropdown").value;
		const newValue = document.getElementById("newValue").value;
		if (dropdownValue === "name") {
			player.name = newValue;
		} else if (dropdownValue === "number"){
			player.number = newValue;
		} else if (dropdownValue === "gender") {
			if (newValue === "O" || newValue === "W" || newValue === "o" || newValue === "w") {
				player.gender = newValue.toUpperCase();
			} else {
				alert('Please enter either "O" or "W" for the gender');
			}
		} else if (dropdownValue === "pulls") {
			player.ph = [];
			player.ph.push(newValue);
		} else if (dropdownValue === "throwaways") {
			player.ta = newValue;
		} else if (dropdownValue === "ds") {
			player.d = newValue;
		} else if (dropdownValue === "goals") {
			player.g = newValue;
		} else if (dropdownValue === "assists") {
			player.a = newValue;
		} else if (dropdownValue === "secondAssists") {
			player.twoa = newValue;
		} else if (dropdownValue === "receiverError") {
			player.re = newValue;
		}
		console.log(player);
		localStorage.setItem(PLAYERS_KEY, JSON.stringify(players)); //Push changes to storage
		location.reload(); //Display changes in the table once the changes are pushed
	}
})

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
		setColors(color);
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