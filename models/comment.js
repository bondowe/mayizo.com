var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
    
    content: { type: String, required: true },
    reviewed: { type: Boolean, default: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdDate: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, required: true }, // refers to user._id
    blocked: { type: Boolean, default: false },
    blockReason: String,
    blockedBy: mongoose.Schema.Types.ObjectId,
    likes: {
        up: { type: Number, default: 0 },
        down: { type: Number, default: 0 }
    }   
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
