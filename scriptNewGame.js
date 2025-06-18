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
});

document.getElementById("fours").addEventListener("click", function(event) {
    document.getElementById("otherInput").style.display="none";
});
document.getElementById("fives").addEventListener("click", function(event) {
    document.getElementById("otherInput").style.display="none";
});
document.getElementById("sevens").addEventListener("click", function(event) {
    document.getElementById("otherInput").style.display="none";
});

//If the user says there is a half, the length can be set
document.getElementById("yesHalf").addEventListener("click", function(event) {
    document.getElementById("hiddenHalfStuff").style.display="inline";
});
document.getElementById("noHalf").addEventListener("click", function(event) {
    document.getElementById("hiddenHalfStuff").style.display="none";
});