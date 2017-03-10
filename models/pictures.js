'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Picture = new Schema({
	url: {type: String, required: true},
    description: {type: String, required: true},
    owner: {type: String, required: true},
    ownerPhoto: {type: String, required: true},
    stars: [{type: String, required: false}],
});

module.exports = mongoose.model('Picture', Picture);