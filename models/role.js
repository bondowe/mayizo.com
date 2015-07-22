var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var roleSchema = new Schema({
	code: { type: String, required: true, maxlength: 20, unique: true, trim: true },
    name: { type: String, required: true, maxlength: 50, unique: true, trim: true },
	description: { type: String, maxlength: 512, trim: true },
});

roleSchema.statics.findAll = () => {
	var self = this;
	return new Promise((resolve, reject) => {
		self.find({}, (err, roles) => {
			if(err) {
				return reject(err);
			}
			return resolve(roles);
		});
	});	
};

var Role = mongoose.model('Role', roleSchema);

module.exports = Role;
