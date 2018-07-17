var mongoose = require('mongoose');

var User = mongoose.model('User', {
    user: {
        type: String,
        minlength: 1,
        required: true
    },
    email: {
        type: String,
        trim: true,
        minlength: 1,
        required: true
    }
});

module.exports = {User} ;