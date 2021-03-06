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

userSchema.statics.findAll = () => {
    var self = this;
	return new Promise((resolve, reject) => {
        self.find({}, (err, users) => {
            if (err) {
                return reject(err);
            }
			return resolve(users);
        });
	});	
};

userSchema.statics.getById = (id) => {
    var self = this;
	return new Promise((resolve, reject) => {
        self.findById(id, (err, user) => {
            if (err) {
                return reject(err);
            }
			return resolve(user);
        });
	});	
};

userSchema.statics.findByEmail = (email) => {
    var self = this;
	return new Promise((resolve, reject) => {
        self.findOne({ email: email }, (err, user) => {
            if (err) {
                return reject(err);
            }
			return resolve(user);
        });
	});	
};

userSchema.statics.createNew = (document) => {
    var self = this;
	return new Promise((resolve, reject) => {
        self.create(document, (err, user) => {
            if (err) {
                return reject(err);
            }
            return resolve(user);
        });
	});	
};

userSchema.virtual('fullName').get(() => {
  return (this.title ? this.title + ' ' : '') 
        + this.name.first + ' '
        + (this.name.middle ? this.name.middle + ' ' : '') 
        + this.name.last;
});

var User = mongoose.model('User', userSchema);

module.exports = User;
