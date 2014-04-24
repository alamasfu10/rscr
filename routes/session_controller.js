//
exports.new = function(req, res) {
    res.render('undefined');
};


//Requires login
exports.requiresLogin = function (req, res, next) {
    if (req.session) {
        console.log('Login done');
        next();
    } else {
        res.redirect('/login?redir=' + req.url);
    }
};


exports.invitado = function(req,res,next){
	var redir = req.body.redir || '/record'

    console.log('REDIR = ' + redir);

	req.session = {name:"Invitado"};

    // Vuelvo al url indicado en redir
    res.redirect(redir);

}
