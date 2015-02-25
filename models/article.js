var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    
    title: { type: String, required: true },
    summary: String,
    content: { type: String, required: true },
    smallImage: String,
    largeImage: String,
    video: String,
    hidden: { type: Boolean, default: true },
    reviewed: { type: Boolean, default: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    displayFrom: { type: Date, required: true },
    displayUntil: Date,
    createdDate: { type: Date, default: Date.now },
    lastEditedDate: Date,
    authors: [{ type: mongoose.Schema.Types.ObjectId, required: true }], // refers to user._id
    lastEditor: mongoose.Schema.Types.ObjectId,
    likes: {
        up: { type: Number, default: 0 },
        down: { type: Number, default: 0 }
    } 
    
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
