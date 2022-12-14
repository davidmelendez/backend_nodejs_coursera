var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserPassport = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    },
    facebookId: String
});

UserPassport.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserPassport', UserPassport);