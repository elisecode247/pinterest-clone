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
        if (/\S/.test(description) === false){
            description = `pic posted by @${user}`;
        }
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
                res.json(result);
            });
    };

    this.setStars = function (req, res) {
        var id = req.params.id;
        var user = req.user.twitter.username;
        Picture
            .findById(id, null, {
                'new': true
            })
            .exec(function (err, result) {
                if (err) throw err;
                var index = result.stars.findIndex(function (element) {
                    return element === user;
                })
                if (index > -1) {
                    result.stars.splice(index, 1);
                } else {
                    result.stars.push(user);
                }
                result.save(function () {
                    res.json(result);
                })

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
        var user = req.params.username;
        Picture
            .find({
                'owner': user
            })
            .exec(function (err, result) {
                if (err) throw err;
                res.json(result);
            });
    };


}

module.exports = PictureHandler;