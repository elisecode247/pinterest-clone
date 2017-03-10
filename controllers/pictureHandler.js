'use strict';

var Picture = require('../models/pictures.js');

function PictureHandler() {

    this.getPicture = function (req, res) {
        var id = req.params.id;
        Picture
            .findById(id)
            .exec(function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    };

    this.createPicture = function (req, res) {
        var user = req.user.twitter.username;
        var ownerPhoto = req.user.twitter.photo;
        var url = req.body.url;
        var description = req.body.description;
        var newPicture = new Picture({
            'url': url,
            'description': description,
            'owner': user,
            'ownerPhoto': ownerPhoto
        });
        newPicture.save(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    };


    this.deletePicture = function (req, res) {
        var id = req.params.id;
        Picture
            .findByIdAndRemove(id)
            .exec(function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    };

    this.getStars = function (req, res) {
        var id = req.params.id;
        Picture
            .findById(id)
            .exec(function (err, result) {
                if (err) throw err;
                res.json(result.stars.length);
            });
    };

    this.incrementStars = function (req, res) {
        var id = req.params.id;
        var user = req.user.twitter.username;
        Picture
            .findByIdAndUpdate(id, {
                $push: {
                    'stars': user
                }
            }, {
                'stars': {
                    $ne: user
                }
            })
            .exec(function (err, result) {
                if (err) throw err;
                res.json(result.stars.length);
            });
    };

    this.decrementStars = function (req, res) {
        var id = req.params.id;
        var user = req.user.twitter.username;
        Picture
            .findByIdAndUpdate(id, {
                $pull: {
                    'stars': user
                }
            }, {new: true})
            .exec(function (err, result) {
                if (err) throw err;
                res.json(result.stars.length);
            });
    };

    this.getWall = function (req, res) {
        Picture
            .find({})
            .exec(function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    };

    this.getUserWall = function (req, res) {
        var user = req.params.userId;
        Picture
            .find({'owner': user})
            .exec(function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    };


}

module.exports = PictureHandler;