var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    
    title: { type: String, required: true, max: 125 },
    summary: { type: String, required: true, max: 800 },
    content: { type: String, required: true, max: 6400 },
    smallImage: { type: String, max: 250 },
    largeImage: { type: String, max: 250 },
    video: { type: String, max: 250 },
    commentsAllowed: { type: Boolean, default: true },
    reviewed: { type: Boolean, default: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId },
    leadingArticle: Boolean,
    createdDate: { type: Date, default: Date.now },
    lastEditedDate: Date,
    authors: [{ type: mongoose.Schema.Types.ObjectId }], // refers to user._id
    lastEditor: mongoose.Schema.Types.ObjectId,
    likes: {
        up: { type: Number, default: 0 },
        down: { type: Number, default: 0 }
    } 
    
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
