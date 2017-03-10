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
			res.redirect('/');
		}
	}

    app.route('/')
        .get(function (req, res) {
            res.render('index', {loggedIn: req.isAuthenticated()})
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
        .post(isLoggedIn,pictureHandler.incrementStars)
        .delete(isLoggedIn,pictureHandler.decrementStars);

    app.route('/api/pics/:id')
        .get(pictureHandler.getPicture)
        .delete(isLoggedIn,pictureHandler.deletePicture);

    app.route('/api/pics')
        .get(pictureHandler.getWall)
        .post(isLoggedIn,pictureHandler.createPicture)

    app.route('/api/pics/owner/:userId')
        .get(pictureHandler.getUserWall);

};