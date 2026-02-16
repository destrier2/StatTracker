/*
NEED TO ADD ASISTS TO THE GAME DATA
*/

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
let gameData = []; //All the stuff that happened during the game
let buttonPlayersArray = [];
let currentPlayersOn = [];
let playerLineButtons = []; //Array of buttons for selecting lines
const playerCount = sessionStorage.getItem("playerCount");
let seconds; //The length of the game
/*
Game data is stored according to the team name and the date.
Team name id = teamName+"|"+fullYear-month-day+"|"+hours:minutes:seconds
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
	startTimer();
};

function startTimer() {
    seconds = sessionStorage.getItem("gameLength") *60;
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
	document.getElementById("OorD").innerHTML="Offense";
	document.getElementById("OorD").style.color="green";
}

function onDefense() {
    offense = false;
    document.getElementById("TA").style.display="none";
    document.getElementById("RE").style.display="none";
    document.getElementById("G").style.display="none";
	document.getElementById("OG").style.display="block";
	document.getElementById("TO").style.display="block";
    document.getElementById("D").style.display="block";
	document.getElementById("OorD").innerHTML="Defense";
	document.getElementById("OorD").style.color="red";
}

function nowActivePoint() {
    activePoint = true;
    document.getElementById("pulls").style.display="none";
    document.getElementById("container").style.display="inline-grid";
	document.getElementById("content").style.display="inline-grid";
	buttonPlayersArray.forEach(buttonPlayer => {
		if (currentPlayersOn.includes(buttonPlayer.innerHTML)) {
			buttonPlayer.style.display="block";
		} else {
			buttonPlayer.style.display="none";
		}
	});
}

function makePlayerLineButtons() {
	let teamName = sessionStorage.getItem("nowPlaying");
	let thisPlayer;
	let numberPlayers = document.getElementById("instructions");
	numberPlayers.innerHTML+=" ("+playerCount+"):";
	let divTemp = document.getElementById("lineButtons");
	divTemp.appendChild(numberPlayers);
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
		button.classList.add('contentButton');
		button.addEventListener("click", function(event) {
			thisPlayer = button.innerHTML;
			button.style="background-color: var(--background)";
			currentPlayersOn.push(thisPlayer);
			if (currentPlayersOn.length == playerCount) {
				doNotActivePointStuff();
			}
		});
		let div = document.getElementById("lineButtons");
		div.appendChild(button);
		const newline = document.createElement("br");
		div.appendChild(newline);
		playerLineButtons.push(button);
	});
}

function addPlayerLineButtons() {
	buttonPlayersArray.forEach(buttonPlayer => {
		buttonPlayer.style="background-color:var(--main)";
	});
	currentPlayersOn = [];
	document.getElementById("pulls").style.display="none";
	document.getElementById("playerButtons").style.display="none";
	document.getElementById("lineButtons").style.display="block";
	playerLineButtons.forEach(buttonPlayer => {
		buttonPlayer.style="background-color:var(--main)";
	});
}

function notActivePoint() {
	saveGame();
	activePoint = false;
	addPlayerLineButtons();//Add the buttons for player on
	document.getElementById("pulls").style.display="none";
	document.getElementById("playerButtons").style.display="none";
	document.getElementById("content").style.display="none";
	buttonPlayersArray.forEach(buttonPlayer => {
		if (currentPlayersOn.includes(buttonPlayer.innerHTML)) {
			buttonPlayer.style.display="block";
		} else {
			buttonPlayer.style.display="none";
		}
	});
}

function doNotActivePointStuff() {
	document.getElementById("lineButtons").style.display="none";
	document.getElementById("content").style.display="inline-grid";
	document.getElementById("playerButtons").style.display="block";
	if (offense === false) { //If on defense, pull. Otherwise, no pull.
		document.getElementById("pulls").style.display="block";
		document.getElementById("endPull").style.display="none";
		document.getElementById("startPull").style.display="block";
		document.getElementById("content").style.display="none";
		document.getElementById("pickUp").style.display="none";
	} else {
		document.getElementById("pulls").style.display="block";
		//If the pull isn't from this team, there has to be a separate button. pick up? 
		document.getElementById("endPull").style.display="none";
		document.getElementById("startPull").style.display="none";
		document.getElementById("pickUp").style.display="block";
		document.getElementById("content").style.display="none";
	}
	reset();
}

//D, TA, RE, G
document.getElementById("D").addEventListener("click", function(event) {
	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
	const player = players.find(person => person.name === current); //Find the right person
	player.g++;
	gameData.push(current+"-D");
	onOffense(); //Defended the disc, now on offense 
	reset();
});

document.getElementById("TA").addEventListener("click", function(event) {
	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
	const player = players.find(person => person.name === current); //Find the right person
	player.ta++;
	gameData.push(current+"-TA");
	onDefense(); //Throwaway, now on defense
	reset();
});

document.getElementById("RE").addEventListener("click", function(event) {
	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
	const player = players.find(person => person.name === current); //Find the right person
	player.re++;
	gameData.push(current+"-RE");
	onDefense(); //Someone dropped, now on defense
	reset();
});

document.getElementById("G").addEventListener("click", function(event) {
	let players = [];
	try {
		players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
	const player = players.find(person => person.name === current); //Find the right person
	player.g++;
	const assistPlayerName = gameData[gameData.length-1].split("-")[0]; //Check who just had the disk
	const assistPlayer = players.find(person => person.name === assistPlayerName); //Find the right person
	assistPlayer.a++;
	const twoAssistPlayerName = gameData[gameData.length-2].split("-")[0]; //Check who had the disk two times before
	const twoBackAction = gameData[gameData.length-2].split("-")[1]; //Check what action occured before
	const twoAssistPlayer = players.find(person => person.name === assistPlayerName); //find the player
	if (twoBackAction === assistPlayerName) { //Only if it was a pass to the person who got an assist, does it count as a second assist
		twoAssistPlayer.twoa++;
		gameData.push(twoAssistPlayerName+"-A2");
	}
	localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
	points++;
	gameData.push(assistPlayerName+"-A");
	gameData.push(current+"-G");
	//Just scored, so now they start on not offense, and the pull is theirs
	onDefense();
	notActivePoint(); //Now not an active point, between points
	reset();
});

document.getElementById("OG").addEventListener("click", function(event) {
	pointsOpponent++;
	gameData.push("Opponent's goal");
	current = null;
	onOffense();
	notActivePoint();
});

document.getElementById("TO").addEventListener("click", function(event) { //Turnover
	gameData.push("Turnover");
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
	//Add pull to the player's pulls58.66.113
	gameData.push(current+"-pull ("+(pullTimer/10).toFixed(1)+")");
	onDefense();
	reset();
});

function saveGame() {
	//Get past games
	let pastGames = [];
	try {
		pastGames = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}

    const thisGame = pastGames.find(game => game.id === gameID); //Get the specific game
	thisGame.data = gameData;
	thisGame.scoreFor = points;
	thisGame.scoreAgainst = pointsOpponent;
	//Save the data
	try {
		localStorage.setItem(GAMES_KEY, JSON.stringify(pastGames));
	} catch (e) {
		alert("Something went wrong when saving the game");
		return;
	}
}

function loadButtons() {
	makePlayerLineButtons();
    let teamName = sessionStorage.getItem("nowPlaying");
	const d = new Date();
	const otherTeamName = sessionStorage.getItem("otherTeamName");
	gameID = teamName+" VS "+otherTeamName+"|"+d.toISOString().slice(0, 10)+"|"+d.toISOString().slice(11, 19);
	//Save this game to the list of games
	//Get past games
	let pastGames = [];
	try {
		pastGames = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
	//Make a new game and add it
	let thisGame = {id: gameID, data: [], scoreFor: 0, scoreAgainst: 0};
	pastGames.push(thisGame);
	try {
		localStorage.setItem(GAMES_KEY, JSON.stringify(pastGames));
	} catch (e) {
		alert("Something went wrong when saving the game");
		return;
	}
	//Make the buttons
	console.log("gameID: "+gameID);
    timeouts = sessionStorage.getItem("timeouts");
    points = 0;
    pointsOpponent = 0;
	//Load other games
	let games = [];
	try {
		games = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
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
    const team = teams.find(team => team.name === teamName); //Find the right team
    team.players.forEach(player => {
        const button = document.createElement("button");
        button.textContent = player;
        button.style.width="100%";
		button.style.display="block";
		button.classList.add('contentButton');
        button.addEventListener("click", function(event) {
            let players = [];
            try {
                players = JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];
            } catch (e) {
                alert("Error. Please try again.");
                return false; //exit if there's an issue
            }
			if (current !== undefined && current !== null && offense === true && current !== button.innerHTML && activePoint === true) {
				gameData.push(current+"-"+button.innerHTML);
			}
            //alert(button.innerHTML+"clicked");  REPLACE THIS WITH WHATEVER HAPPENS WHEN A PLAYER IS CLICKED (separate function?)
            current = button.innerHTML;
            //Add player to the history of people with the disc.
            //Set the current player to this person
			buttonPlayersArray.forEach(buttonPlayer => {
				if (buttonPlayer.style.display !== "none") {
					buttonPlayer.style="background-color:var(--main)";
					if (buttonPlayer.innerHTML === current) {
						buttonPlayer.style="background-color:var(--background)";
					}
				}
			})
        });
		buttonPlayersArray.push(button);
        let div = document.getElementById("playerButtons");
        div.appendChild(button);
       // const newline = document.createElement("br");
       // div.appendChild(newline);
    });
	offense = (sessionStorage.getItem("startOffense") === "true");
	console.log("Offense is " + offense);
	if (offense === true) {
		onOffense();
	} else {
		onDefense();
	}
	notActivePoint();
}

function reset() {
	current = null;
	buttonPlayersArray.forEach(button => {
		button.style="background-color:var(--main);";
		if (currentPlayersOn.includes(button.innerHTML)) {
			button.style.display="block";
		} else {
			button.style.display="none";
		}
	})
}

document.getElementById("viewGameData").addEventListener("click", function(event) {
	console.log(gameData);
})

document.getElementById("timeout").addEventListener("click", function(event) {
	if (timeouts > 0 || !offense) {
		document.getElementById("endTimeout").style.display="inline-block";
		document.getElementById("lineButtons").style.display="none";
		document.getElementById("playerButtons").style.display="none";
		document.getElementById("content").style.display="none";
		document.getElementById("pulls").style.display="none";
		document.getElementById("undo").style.display="none";
		document.getElementById("timeout").style.display="none";
		//Using USA ultimate rules instead of WFDF, 70 second timeout
		setTimeout(function() {
			endTimeout();
	    }, 70*1000); // 1000 milliseconds = 1 second 
	} 
})

function endTimeout() {
	document.getElementById("endTimeout").style.display="none";
	document.getElementById("timeout").style.display="inline-block";
	document.getElementById("undo").style.display="inline-block";
	document.getElementById("playerButtons").style.display="block";
	document.getElementById("content").style.display="inline-grid";
	if (offense === true || activePoint === false) { //If on offense, decrease number of timeouts allowed. Otherwise, the other team loses a timeout
		timeouts--;
		gameData.push("Timeout");
	} else {
		gameData.push("Timeout (Other team)");
	}
}

document.getElementById("endTimeout").addEventListener("click", function(event) {
	endTimeout();
})

document.getElementById("undo").addEventListener("click", function (event) {
	const previous = gameData.pop(); //Remove the last thing in the array
	//Must revert to offense/defense, whatever was before
	if (document.getElementById("lineButtons").style.display !== "none") {
		//Undoing selecting someone to go on the line
		//Pop the last element from the currently on list and set the color back to normal for the corresponding button
		const previousPlayer = currentPlayersOn.pop();
		
	} else if (previous.includes("-RE") || previous.includes("-TA") || previous.includes("-G")) { //Undoing a turnover
		onOffense();
		const temp = previous.split("-");
		const person = temp[0];
		buttonPlayersArray.forEach(button => {
			if (button.innerHTML===person) {
				button.style="background-color: var(--background)";
			} else {
				button.style="background-color: var(--main)";
			}
		});
	} else if (previous.includes("Turnover") || previous.includes("-D") || previous.includes("-OG")) {
		onDefense();
	} else if (previous.includes("-pull")) {
		onDefense();
		notActivePoint();
	} else {
		const temp = previous.split("-");
		const person = temp[0];
		buttonPlayersArray.forEach(button => {
			if (button.style.display !== "none") {
				if (button.innerHTML===person) {
					button.style="background-color: var(--background)";
				} else {
					button.style="background-color: var(--main)";
				}
			}
		});
	}
})
document.getElementById("pickUp").addEventListener("click", function(event) {
	if (current === null || current === undefined) {
		alert("Please select the player who picked up first");
	} else {
		gameData.push(current+"-Pick up");
		nowActivePoint();
	}
})