const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";
let offense;
let points;
let pointsOpponent;
let timeouts;
let current; //Person currently with the disc

function startTimer() {
    let seconds = sessionStorage.getItem("gameLength") *60;
    const intervalID = setInterval(function() {
        seconds--;
        let minutes = Math.floor(seconds/60);
        if (seconds%60 < 10) {
            document.getElementById("timeHere").innerHTML=minutes+":0"+seconds%60;
        } else {
            document.getElementById("timeHere").innerHTML=minutes+":"+seconds%60;
        }
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
        button.addEventListener("click", function(event) {
            let players = [];
            try {
                players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
            } catch (e) {
                alert("Error. Please try again.");
                return false; //exit if there's an issue
            }
            alert(button.innerHTML+"clicked"); 
            current = button.innerHTML;
            //Add player to the history of people with the disc.
            //Set the current player to this person
        });
        let div = document.getElementById("playerButtons");
        div.appendChild(button);
        const newline = document.createElement("br");
        div.appendChild(newline);
    });
}
