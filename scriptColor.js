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
}