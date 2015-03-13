var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    
    username: { type: String, required: true, unique: true, trim: true },
    title: String,
    name: {
        first: { type: String, required: true },
        middle: String,
        last: { type: String, required: true }
    },
    gender: { type: String, enum: ['F', 'M', 'O'], required: true },
    dateOfBirth: { type: Date, required: true },
    signUpDate: { type: Date, default: Date.now, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, max: 50 },
    passwordSalt: { type: String, required: true, max: 50 },
    warningCount: Number,
    bannedFrom: Date,
    bannedUtil: Date,
    banReason: String,
    bannedBy: mongoose.Schema.Types.ObjectId
});

var User = mongoose.model('User', userSchema);

module.exports = User;
