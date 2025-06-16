const PLAYERS_KEY = "players";
const TEAMS_KEY = "teams";
let teamName;

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

document.getElementById("newGameForm").addEventListener("submit", function(event) {
    let tname = document.getElementById("newGameTeamName").value;
    if (!validGame(tname)){
        alert("This team does not exist.")
    } else {
        teamName = tname;
        
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