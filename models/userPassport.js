var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserPassport = new Schema({
    admin:   {
        type: Boolean,
        default: false
    }
});

UserPassport.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserPassport', UserPassport);