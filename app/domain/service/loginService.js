var loginService = module.exports;

// Login
loginService.login = function(req, res) {
    req.session.username = req.body.username;
    res.redirect("/game");
};

// After login

loginService.afterLogin = function(req, res) {
    if(req.session.username) {
        res.render('gameIndex', { username: req.session.username});
    }
    else {
        res.redirect("/");
    }
}