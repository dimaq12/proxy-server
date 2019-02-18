const passport = require('passport');

exports.login = passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: 'Войти неполучилось!',
	successRedirect: '/',
	successFlash: 'Залогинились отлично, так держать!'
});



exports.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		next();
		return;
	}
	req.flash('error', 'Опа! А надо-бы залогиниться!');
	res.redirect('/login');
}