const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";
let offense;
let points;
let pointsOpponent;
let timeouts;

function startTimer() {
    let seconds = sessionStorage.getItem("gameLength") *60;
    const intervalID = setInterval(function() {
        seconds--;
        let minutes = Math.floor(seconds/60);
        document.getElementById("timeHere").innerHTML=minutes+":"+seconds%60;
        document.getElementById("timeoutsHere").innerHTML="Timeouts remaining: "+timeouts;
        document.getElementById("pointsHere").innerHTML=points+" : "+pointsOpponent;
    }, 1000);
    setTimeout(function() {
        alert("Done game of "+sessionStorage.getItem("gameLength")+" minutes");
        clearInterval(intervalID);
    }, sessionStorage.getItem("gameLength") * 60*1000); // 1000 milliseconds = 1 second
    loadButtons();
}

// Start the timer when the page loads
window.onload = startTimer;

function loadButtons() {
    let teamName = sessionStorage.getItem("nowPlaying");
    timeouts = sessionStorage.getItem("timeouts");
    points = 0;
    pointsOpponent = 0;
    offense = sessionStorage.getItem("startOffense");
    //Load players (do this for whenever the buttons are clicked)
    /*let players = [];
    try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}*/
	//Load the teams
	let teams = [];
	try {
		teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
    const team = teams.find(team => team.name === teamName); //Find the right team
    team.players.forEach(player => {
        const button = document.createElement("button");
        button.textContent = player;
        button.style.width="100%";
        let div = document.getElementById("playerButtons");
        div.appendChild(button);
        const newline = document.createElement("br");
        div.appendChild(newline);
    });
    /*	//Check if the player exists
	const exists = players.some(player => player.name === playername);
	if (exists) { //If player exists, add player to team
		const team = teams.find(team => team.name === teamName);
		team.players.push(playername);
		localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
	} else {
		alert("No player by this name found");
	}*/
}
