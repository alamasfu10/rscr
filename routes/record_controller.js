var radio = require("../lib/radio-stream");


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
  	
	
	var stream = radio.createReadStream("http://icecast3.977music.com/comedy");

	stream.on("connect", function() {
	console.error("Radio Stream connected!");
	console.error(stream.headers);
	});

	stream.on("data", function(chunk) {
	process.stdout.write(chunk);
	});

	stream.on("metadata", function(title) {
	console.error(title);
	});
	

	//renders the new view
	res.render('record/confirm.ejs'); 
};
