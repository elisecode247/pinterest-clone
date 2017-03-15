'use strict';

var path = process.cwd();
var PictureHandler = require(path + '/controllers/pictureHandler.js');
var bodyParser = require('body-parser');

module.exports = function (app, passport) {

    app.use(bodyParser.urlencoded({
		extended: false
	}));

    var pictureHandler = new PictureHandler();

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.status(401).redirect('/');
		}
	}

    app.route('/')
        .get(function (req, res) {
            var user = null;
            if (req.hasOwnProperty('user')){
                user = req.user.twitter.username;
            }
            res.render('index', {loggedIn: req.isAuthenticated(), username: user})
        });

    app.route('/logout')
        .get(function (req, res) {
            req.logout();
            res.redirect('/');
        });

    app.route('/auth/twitter')
        .get(passport.authenticate('twitter'));

    app.route('/auth/twitter/callback')
        .get(passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/'
        }));

    app.route('/api/pics/:id/stars')
        .get(pictureHandler.getStars)
        .post(isLoggedIn,pictureHandler.setStars);

    app.route('/api/pics/:id')
        .get(pictureHandler.getPicture)
        .delete(isLoggedIn,pictureHandler.deletePicture);

    app.route('/api/pics')
        .get(pictureHandler.getWall)
        .post(isLoggedIn,pictureHandler.createPicture)

    app.route('/api/pics/owner/:username')
        .get(pictureHandler.getUserWall);

};