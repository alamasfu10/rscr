var radio = require("../lib/radio-stream");
var fs = require ('fs');

var radioStream;


// GET /record
exports.index = function(req, res) {
  	res.render('record/record.ejs') 
};

// GET /configure
exports.configure = function(req, res) {
  	res.render('record/configure.ejs') 
};


// GET /confirm 
// starts recording a radio stream
exports.confirm = function(req, res) {
  	

	var date = req.body.record.date;
	var startTime = req.body.record.startHour + ":" + req.body.record.startMinutes;
	var endTime = req.body.record.endHour + ":" + req.body.record.endMinutes;
	
	console.log("Date: " + date);	
	console.log("From: " + startTime);
	console.log("To: " + endTime);

	

	//renders the new view
	res.render('record/confirm.ejs',{date: date, startTime: startTime, endTime: endTime}); 
};

exports.startRecord = function (req,res){
  	
	//var stream = radio.createReadStream("http://icecast3.977music.com/comedy");
	var stream = radio.createReadStream("http://198.23.165.148:8888");
	radioStream = stream;
	
	console.log("Trying to connect http://198.23.165.148:8888");
	var recordPrinted = false;

	stream.on("connect", function(err) {
		console.log("Radio Stream connected!");
		console.log(stream.headers);
		if(err){
			console.log(err);
		}
	});

	//Now, writes in standard out (terminal)
	//Generate an external file to save data
	stream.on("data", function(chunk) {
	//process.stdout.write(chunk);		
		fs.appendFile("output.mp3", chunk, function(err) {
			if(err) {
				console.log(err);
			} else {
				if(recordPrinted==false){
					console.log("Grabando streaming de audio!");
					recordPrinted=true;
				}
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
		console.log(title);
	});
	

	//renders the new view
	res.render('index', { title: 'Initial Page' });
};


exports.stop = function (req, res){
	console.log("Stopping radio stream");
	radioStream = undefined;
};


