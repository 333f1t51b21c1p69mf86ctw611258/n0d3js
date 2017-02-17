var fs = require("fs");

fs.readFile("input.txt", function(err, data) {
	if (err) {
		return console.log("ERROR: " + err);
	}

	console.log(data.toString());
});

console.log("This string may pull out before the end of reading file process");