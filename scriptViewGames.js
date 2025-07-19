const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";
const GAMES_KEY = "games";

let deleteStatus = false; //If true, then whatever game is clicked gets deleted.
let oldGames = [];

document.getElementById("viewData").addEventListener("click", function(event) {
    try {
		oldGames = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
    console.log(oldGames);
})

document.getElementById("clearData").addEventListener("click", function (event) {
    let emptyGames = [];
    try {
		localStorage.setItem(GAMES_KEY, JSON.stringify(emptyGames));
	} catch (e) {
		alert("Something went wrong when saving the game");
		return;
	}
})

document.getElementById("deleteGame").addEventListener("click", function(event) {
    deleteStatus = true;
})

//Upon loading
document.addEventListener("DOMContentLoaded", function() {    
	try {
		oldGames = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
    oldGames.forEach(game => {
        let div = document.createElement("div");
        div.style="border:1px solid black; border-radius: 3vw; width:40%; display:inline-block; margin:5px;"
        let title = document.createElement("p");
        let date = document.createElement("p");
        let score = document.createElement("p");
        let fullID = game.id.split("|");
        div.appendChild(title);
        div.appendChild(date);
        div.appendChild(score);
        title.innerHTML=fullID[0];
        date.innerHTML="("+fullID[1]+")";
        score.innerHTML= "Final score: " + game.scoreFor + " - " + game.scoreAgainst;
        div.addEventListener("click", function(event) {
            if (!deleteStatus) {
                view(game);
            } else {
                deleteGame(game);
            }
        })
        let divContainer = document.getElementById("gamesHere");
        divContainer.appendChild(div);
    });
    if (oldGames.length === 0) {
        let text = document.createElement("p");
        text.innerHTML="There are no games stored in the system.";
        let divContainer = document.getElementById("gamesHere");
        divContainer.appendChild(text);
    }
})

function deleteGame(game) {
    try {
		oldGames = JSON.parse(localStorage.getItem(GAMES_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
    const gametoDelete = oldGames.find(oldgame => game.id === oldgame.id); //Find the old game
    //let newNumbers = numbers.filter(number => number !== 3);
    oldGames = oldGames.filter(thisgame => thisgame !== gametoDelete);
    try {
		localStorage.setItem(GAMES_KEY, JSON.stringify(oldGames));
	} catch (e) {
		alert("Something went wrong when saving the game");
		return;
	}
    deleteStatus = true;
    location.reload();
}

function view(game) {
    let div = document.getElementById("viewGameHere");
    let table = document.getElementById("gameTable");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
    let teams = [];
    try {
		teams = JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
	} catch (e) {
		alert("Error. Please try again.");
		return false; //exit if there's an issue
	}
    console.log("Viewing game:",game);
    var row = table.insertRow(0);
    row.insertCell(0).innerHTML = "Player";
    row.insertCell(1).innerHTML = "Touches";
    row.insertCell(2).innerHTML = "Pulls";
    row.insertCell(3).innerHTML = "Average Hangtime";
    row.insertCell(4).innerHTML = "G";
    row.insertCell(5).innerHTML = "TA";
    row.insertCell(6).innerHTML = "RE";
    row.insertCell(7).innerHTML = "A";
    row.insertCell(8).innerHTML = "2A";
    row.insertCell(9).innerHTML = "D";
    const team = teams.find(team => team.name === game.id.split(" VS ")[0]); //If the player exists
    team.players.forEach(player => {
        var playerRow = table.insertRow(1);
        playerRow.insertCell(0).innerHTML = player;
        let g = 0;
        let ta = 0;
        let touch = 0;
        let re = 0;
        let a = 0;
        let d = 0;
        let pulls = 0;
        let avgPulls = 0.0;
        let aTwo = 0;
        game.data.forEach(data => {
            if (data.split("-")[0] === player) { //Player found
                //Check what stat to give the player. 
                /*Options: pick up, throwaway, pass/touch, receiver error, assist, goal, defense*/
                const other = data.split("-")[1];
                switch (other) {
                    case "G": 
                        g++;
                        break;
                    case "TA": 
                        ta++;
                        break;
                    case "RE":
                        re++;
                        break;
                    case "A":
                        a++;
                        break;
                    case "A2":
                        aTwo++;
                        break;
                    case "D":
                        d++;
                        break;
                    case "Pick up":
                        touch++;
                        break;
                    default: 
                        if (other.substring(0,4) === "pull") {
                            avgPulls = avgPulls*pulls+parseFloat(other.substring(6,other.length), 10);
                            pulls++;
                        }else { //Pass to someone else
                            touch++;
                        }
                }
            }
        })
        playerRow.insertCell(1).innerHTML=touch;
        playerRow.insertCell(2).innerHTML=pulls;
        playerRow.insertCell(3).innerHTML=avgPulls;
        playerRow.insertCell(4).innerHTML=g;
        playerRow.insertCell(5).innerHTML=ta;
        playerRow.insertCell(6).innerHTML=re;
        playerRow.insertCell(7).innerHTML=a;
        playerRow.insertCell(8).innerHTML=aTwo;
        playerRow.insertCell(9).innerHTML=d;
    })
    div.appendChild(table);
}