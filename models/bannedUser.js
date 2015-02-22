var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bannedUserSchema = new Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    warningCount: { type: Number, required: true },
    from: Date,
    until: Date,
    reason: String,
    bannedBy: mongoose.Schema.Types.ObjectId
});

var BannedUser = mongoose.model('Ban', bannedUserSchema);

module.exports = BannedUser;
