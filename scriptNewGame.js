const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";
let teamName;

document.getElementById("newGameForm").addEventListener("submit", function(event) {
    let tname = document.getElementById("newGameTeamName").value;
    if (!validGame(tname)){
        alert("This team does not exist.")
    } else {
        teamName = tname;
        if (document.getElementById("yesO").checked) {
            sessionStorage.setItem("startOffense", true);
        } else {
            sessionStorage.setItem("startOffense", false);
        }
        sessionStorage.setItem("timeouts", document.getElementById("timeoutCount").value);
        sessionStorage.setItem("nowPlaying", tname);
        sessionStorage.setItem("gameLength",document.getElementById("length").value);
		sessionStorage.setItem("otherTeamName", document.getElementById("otherTeamName").value)
        document.location="game.html";
        event.preventDefault();
    }
});

function validGame(teamname) {
    let teams = [];
	try {
		teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
	} catch (e) {
		//alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
    const exists = teams.some(team => team.name === teamname);
    return exists;
}

//Ensure that if the user says Other, then the number of players box pops up
document.getElementById("other").addEventListener ("click", function(event) {
    document.getElementById("otherInput").style.display="inline";
	sessionStorage.setItem("playerCount", document.getElementById("otherInput").value);
});

document.getElementById("fours").addEventListener("click", function(event) {
    document.getElementById("otherInput").style.display="none";
	sessionStorage.setItem("playerCount", 4);
});
document.getElementById("fives").addEventListener("click", function(event) {
    document.getElementById("otherInput").style.display="none";
	sessionStorage.setItem("playerCount", 5);
});
document.getElementById("sevens").addEventListener("click", function(event) {
    document.getElementById("otherInput").style.display="none";
	sessionStorage.setItem("playerCount", 7);
});

//If the user says there is a half, the length can be set
document.getElementById("yesHalf").addEventListener("click", function(event) {
    document.getElementById("hiddenHalfStuff").style.display="inline";
});
document.getElementById("noHalf").addEventListener("click", function(event) {
    document.getElementById("hiddenHalfStuff").style.display="none";
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