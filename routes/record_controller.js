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
	radioStream = radio.createReadStream("http://198.23.165.148:8888");

	
	console.log("Trying to connect http://198.23.165.148:8888");
	var recordPrinted = false;

	radioStream.on("connect", function(err) {
		console.log("Radio Stream connected!");
		console.log(radioStream.headers);
		if(err){
			console.log(err);
		}
	});


	//Generate an external file to save data
	radioStream.on("data", function(chunk) {
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

	radioStream.on("metadata", function(title) {
		console.log(title);
	});
	

	//renders the new view
	res.redirect('/');
};


exports.stop = function (req, res){
	console.log("Stopping radio stream");
	radioStream.on("end", function(){
		console.log("No more data");	
	});
};


