var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    
    alias: { type: String, required: true },
    title: String,
    name: {
        first: String,
        middle: String,
        last: String,
    },
    gender: {
        type:String,
        enum: ['F', 'M']
    },
    dateOfBirth: Date,
    signUpDate: { type: Date, default: Date.now },
    emailAddress: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    passwordSalt: { type: String, required: true },
});

var User = mongoose.model('User', personSchema);

module.exports = User;
