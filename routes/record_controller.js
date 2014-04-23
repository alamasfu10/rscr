// GET /record

exports.index = function(req, res) {
  	res.render('record.ejs') 
};


exports.configure = function(req, res) {
  	res.render('configure.ejs') 
};

exports.confirm = function(req, res) {
  	res.render('confirm.ejs') 
};
