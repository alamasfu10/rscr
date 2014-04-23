var radio = require("../lib/radio-stream");
var fs = require ('fs');


// GET /record
exports.index = function(req, res) {
  	res.render('record/record.ejs') 
};

// GET /configure
exports.configure = function(req, res) {
  	res.render('record/configure.ejs') 
};


// GET /confirm 
// starts a radio stream, prints output in console
exports.confirm = function(req, res) {
  	
	
	//var stream = radio.createReadStream("http://icecast3.977music.com/comedy");
	var stream = radio.createReadStream("http://198.23.165.148:8888");
	// Timeout, not emiting?

	stream.on("connect", function() {
	console.error("Radio Stream connected!");
	console.error(stream.headers);
	});


	//Now, writes in standard out (terminal)
	//Generate an external file to save data
	stream.on("data", function(chunk) {
	//process.stdout.write(chunk);

		
		fs.appendFile("Salida de audio.mp3", chunk, function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("Grabando streaming de audio!");
			} 
		});
	});


/*
		fs.writeFile("tmp_test.mp3", chunk, function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("mp3 file was saved!");
			} 
		});

		fs.writeFile("tmp_test.txt", chunk, function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("txt file was saved!");
			} 
		});

    });
	*/
	

	stream.on("metadata", function(title) {
	console.error(title);
	});
	

	//renders the new view
	res.render('record/confirm.ejs'); 
};
