var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var authorSchema = new Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    pseudo: { type: String, required: true },
    reviewRequired: Boolean
});

var Author = mongoose.model('Author', authorSchema);

module.exports = Author;
