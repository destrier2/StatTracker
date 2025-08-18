/*document.getElementById("test").addEventListener("click", function() {
	//alert("Button was clicked! alert");
	document.getElementById("testText").style.display='block';
});*/

const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";
const GAMES_KEY = "games";

document.getElementById("clearStorage").addEventListener("click", function(event) {
	localStorage.clear();
    sessionStorage.removeItem("teamName");
	console.log("cleared storage");
});
document.getElementById("viewStorage").addEventListener("click", function(event) {
	console.log("Players Storage:", localStorage.getItem(PLAYERS_KEY));
	console.log("Teams Storage:", localStorage.getItem(TEAMS_KEY));
	console.log("Games storage:", localStorage.getItem(GAMES_KEY));
});

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
		document.getElementById("colorPicker").value="#f7cac9";
	}
	try {
		let bgcolor = localStorage.getItem("bgColor");
		const r = document.querySelector(':root');
		r.style.setProperty("--background", bgcolor);
		document.getElementById("bgColorPicker").value = bgcolor;
	} catch (e) {
		localStorage.removeItem("bgColor"); //Delete bg color if it exists
	}
};

document.getElementById("bgColorPicker").addEventListener("input", function(event) {
	let bgcolor = document.getElementById("bgColorPicker").value;
	const r = document.querySelector(':root');
	localStorage.setItem("bgColor", bgcolor);
	r.style.setProperty("--background", bgcolor);
})

function setColors(color) {
	const r = document.querySelector(':root');
	r.style.setProperty("--main", color);
	document.getElementById("colorPicker").value=color;
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
	document.getElementById("borderColor").value = borderColor;
}

document.getElementById("colorPicker").addEventListener("input", function(event) {
	setColors(document.getElementById("colorPicker").value);
	localStorage.setItem("color", document.getElementById("colorPicker").value);
})

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