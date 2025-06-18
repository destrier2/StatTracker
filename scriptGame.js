const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";
const GAMES_KEY = "games";
let offense; //true if currently on offense, false otherwise
let points;
let pointsOpponent;
let timeouts;
let current; //Person currently with the disc
let activePoint; //True if players have the disc and are throwing to each other, false if between points, half, etc
let pullID; //The id of the interval thing that keeps track of the pull length
let pullTimer; //Count how much time passes from pull start to end
let gameID; //The id that can be used to refer to this game
/*
Game data is stored according to the team name and the date.
Team name id = teamName+"|"+fullYear+month+day
*/

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

function onOffense() {
    offense = true;
    document.getElementById("TA").style.display="block";
    document.getElementById("RE").style.display="block";
    document.getElementById("G").style.display="block";
	document.getElementById("OG").style.display="none";
	document.getElementById("TO").style.display="none";
    document.getElementById("D").style.display="none";
}

function onDefense() {
    offense = false;
    document.getElementById("TA").style.display="none";
    document.getElementById("RE").style.display="none";
    document.getElementById("G").style.display="none";
	document.getElementById("OG").style.display="block";
	document.getElementById("TO").style.display="block";
    document.getElementById("D").style.display="block";
}

function nowActivePoint() {
    activePoint = true;
    document.getElementById("pulls").style.display="none";
    document.getElementById("container").style.display="inline-grid";
	document.getElementById("content").style.display="inline-grid";
}

function notActivePoint() {
    activePoint = false;
    document.getElementById("pulls").style.display="block";
	document.getElementById("endPull").style.display="none";
	document.getElementById("startPull").style.display="block";
    document.getElementById("content").style.display="none";
}

//D, TA, RE, G
document.getElementById("D").addEventListener("click", function(event) {
   onOffense(); //Defended the disc, now on offense 
});

document.getElementById("TA").addEventListener("click", function(event) {
    onDefense(); //Throwaway, now on defense
});

document.getElementById("RE").addEventListener("click", function(event) {
    onDefense(); //Someone dropped, now on defense
});

document.getElementById("G").addEventListener("click", function(event) {
    notActivePoint(); //Now not an active point, between points
	points++;
	//Just scored, so now they start on not offense, and the pull is theirs
	offense = false;
});

document.getElementById("OG").addEventListener("click", function(event) {
	notActivePoint();
	pointsOpponent++;
});

document.getElementById("TO").addEventListener("click", function(event) {
	onOffense(); //Now on offense
});

//Pulls stuff
document.getElementById("startPull").addEventListener("click", function(event) {
	if (current == null) {
		alert("please select the player who is pulling first");
	} else {
		document.getElementById("endPull").style.display="block";
		document.getElementById("startPull").style.display="none";
		pullTimer = 0; //Not really seconds, it's 10x how many seconds pass
		pullID = setInterval(function() {
	        pullTimer++;
	    }, 100);
	}
});

document.getElementById("endPull").addEventListener("click", function(event) {
    nowActivePoint();
	clearInterval(pullID);
	console.log(current+" pulled a pull that lasted for "+(pullTimer/10).toFixed(1));
	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
	const player = players.find(person => person.name === current); //Find the right person
	player.ph.push((pullTimer/10).toFixed(1));
	localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
		/*team.players.push(playername);
		localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));*/
	//Add pull to the player's pulls
});

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
            //alert(button.innerHTML+"clicked");  REPLACE THIS WITH WHATEVER HAPPENS WHEN A PLAYER IS CLICKED (separate function?)
            current = button.innerHTML;
            //Add player to the history of people with the disc.
            //Set the current player to this person
        });
        let div = document.getElementById("playerButtons");
        div.appendChild(button);
        const newline = document.createElement("br");
        div.appendChild(newline);
    });
	if (offense) {
		onOffense();
	} else {
		onDefense();
	}
	notActivePoint();
}