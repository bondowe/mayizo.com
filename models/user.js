var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    
    username: { type: String, required: true, maxlength: 30, unique: true, trim: true },
    title: String,
    name: {
        first: { type: String, required: true, maxlength: 30 },
        middle: { type: String, maxlength: 30 },
        last: { type: String, required: true, maxlength: 30 }
    },
    gender: { type: String, enum: ['F', 'M', 'O'], required: true },
    dateOfBirth: { type: Date, required: true },
    signUpDate: { type: Date, default: Date.now, required: true },
    email: { type: String, required: true, maxlength: 250, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, maxlength: 50 },
    passwordSalt: { type: String, required: true, maxlength: 50 },
    warningCount: Number,
    bannedFrom: Date,
    bannedUtil: Date,
    banReason: String,
    bannedBy: mongoose.Schema.Types.ObjectId
});


userSchema.virtual('fullName').get(() => {
  return (this.title ? this.title + ' ' : '') 
        + this.name.first + ' '
        + (this.name.middle ? this.name.middle + ' ' : '') 
        + this.name.last;
});

var User = mongoose.model('User', userSchema);

module.exports = User;
