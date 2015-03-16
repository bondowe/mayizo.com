var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var authorSchema = new Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    pseudo: { type: String, required: true, maxlength: 30 },
    isReviewer: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    activeFrom: { type: Date, required: true },
    activeUntil: Date,
    reviewRequired: Boolean
});

var Author = mongoose.model('Author', authorSchema);

module.exports = Author;
