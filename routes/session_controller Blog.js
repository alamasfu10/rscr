var c = require('../public/js/count');
var util = require('util');


// Middleware: Login is required:
//
// Si el usuario ya hizo login anteriormente entonces existira 
// el objeto user en req.session, por lo que continuo con los demas 
// middlewares o rutas.
// Si no existe req.session.user, entonces es que aun no he hecho 
// login, por lo que me redireccionan a una pantalla de login. 
// Guardo cual es mi url para volver automaticamente a esa url 
// despues de hacer rlogin. 
//
exports.requiresLogin = function (req, res, next) {
    if (req.session.user) {
        console.log('Login done');
        next();
    } else {
        res.redirect('/login?redir=' + req.url);
    }
};



// Formulario para hacer login
//
// Es la tipica ruta REST que devuelve un formulario para crear 
// un nuevo recurso.
// Paso como parametro el valor de redir (es una url a la que 
// redirigirme despues de hacer login) que me han puesto en la 
// query (si no existe uso /).
//
exports.new = function(req, res) {

    res.render('session/new', 
               { redir: req.query.redir || '/', cont: c.getCont()
               });exports.requiresLogin = function (req, res, next) {
    if (req.session.user) {
        console.log('Login done');
        next();
    } else {
        res.redirect('/login?redir=' + req.url);
    }
};
};


// Crear session, es decir, hacer el login.
//
// El formulario mostrado por /login usa como action este metodo.
// Cojo los parametros que se han metido en el formulario y hago 
// login con ellos, es decir crea la session.
// Uso el metodo autenticar exportado por user_controller para 
// comprobar los datos introducidos.
// Si la autenticacion falla, me redirijo otra vez al formulario 
// de login.
// Notar que el valor de redir lo arrastro siempre. 
exports.create = function(req, res) {

    var redir = req.body.redir || '/'

    console.log('REDIR = ' + redir);

    var login = req.body.login;
    var password  = req.body.password;

    console.log('Login    = ' + login);
    console.log('Password = ' + password);

    require('./user_controller').autenticar(login, password, function(error, user) {

        if (error) {
            if (util.isError(error)) {
                next(error);
            } else {
                req.flash('error', 'Se ha producido un error: '+error);
                res.redirect("/login?redir="+redir);        
            }
            return;
        }

        // IMPORTANTE: creo req.session.user.
        // Solo guardo algunos campos del usuario en la sesion.
        // Esto es lo que uso para saber si he hecho login o no.
        req.session.user = {id:user.id, login:user.login, name:user.name, favourites: user.favourites, time: user.time};

        // Vuelvo al url indicado en redir
        res.redirect(redir);
    });
}; 


// Logout
// 
// Para salir de la session simplemente destruyo req.session.user
//
exports.destroy = function(req, res) {

    delete req.session.user;
    req.flash('success', 'Logout.');
    res.redirect("/login");     
};


//Control del tiempo de sesion
exports.sessionTime = function (req, res, next) {
        if (req.session.user) {
            if(req.session.user.lastDate){
                var now = new Date();
                console.log('Ultima hora:'+req.session.user.lastDate);
                console.log('Hora actual:'+now);
                if(req.session.user.lastTime+60000<now.getTime()){
                    //Ha pasado mas de un minuto desde la ultima accion
                    delete req.session.user;
                    req.flash('error','El tiempo de sesión ha expirado');                   
                }else{
                    console.log('Quedaban '+((req.session.user.lastTime+60000)-(now.getTime()))/1000+' segundos de tiempo de sesión');
                    req.session.user.lastDate = new Date();
                    req.session.user.lastTime = new Date().getTime();
                
                }
            }else{
                req.session.user.lastDate = new Date(); 
                req.session.user.lastTime = new Date().getTime(); //ms 1970
                console.log('created');
            }
            next();
        } else {
            //Si no esta logueado no pasa nada
            next();
        }
};
