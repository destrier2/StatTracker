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
		const newPlayer = { name: playerName, number:playerNum, gender: playerGender, ph: [], ta:0, d:0, g:0, a:0, twoa:0, re:0 };
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
	console.log("Border color is: " + borderColor + " red is: " + newRed + " green is: " + newGreen + " and blue is " + newBlue);
}