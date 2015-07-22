var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var pendingUserSchema = new Schema({
    email: { type: String, required: true, maxlength: 250, unique: true, lowercase: true, trim: true },
    roleId:  { type: mongoose.Schema.Types.ObjectId, required: true  }, // refers to role._id
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true }, // refers to user._id
    createdDate: { type: Date, default: Date.now, required: true }
});

pendingUserSchema.statics.findAll = () => {
    var self = this;
	return new Promise((resolve, reject) => {
        self.find({}, (err, pendingUsers) => {
            if (err) {
                return reject(err);
            }
			return resolve(pendingUsers);
        });
	});	
};

pendingUserSchema.statics.getById = (id) => {
    var self = this;
	return new Promise((resolve, reject) => {
        self.findById(id, (err, pendingUser) => {
            if (err) {
                return reject(err);
            }
			return resolve(pendingUser);
        });
	});	
};

pendingUserSchema.statics.findByEmail = (email) => {
    var self = this;
	return new Promise((resolve, reject) => {
        self.findOne({ email: email }, (err, pendingUser) => {
            if (err) {
                return reject(err);
            }
			return resolve(pendingUser);
        });
	});	
};

pendingUserSchema.statics.createNew = (document) => {
    var self = this;
	return new Promise((resolve, reject) => {
        self.create(document, (err, pendingUser) => {
            if (err) {
                return reject(err);
            }
            return resolve(pendingUser);
        });
	});	
};

pendingUserSchema.statics.updateOne = (id, upd) => {
    var self = this;
	return new Promise((resolve, reject) => {
        self.findOneAndUpdate({ _id: id }, upd, { new: true }, (err, pendingUser) => {
            if (err) {
                return reject(err);
            }
            return resolve(pendingUser);
        });
	});	
};

pendingUserSchema.statics.delete = (id) => {
    var self = this;
	return new Promise((resolve, reject) => {
        self.remove({ _id: id }, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
	});	
};

var PendingUser = mongoose.model('PendingUser', pendingUserSchema);

module.exports = PendingUser;
