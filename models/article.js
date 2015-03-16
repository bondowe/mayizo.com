var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    
    title: { type: String, required: true, maxlength: 125 },
    keywords: [{ type: String, maxlength: 125 }],
    summary: { type: String, required: true, maxlength: 800 },
    content: { type: String, required: true, maxlength: 6400 },
    smallImage: { type: String, maxlength: 250 },
    largeImage: { type: String, maxlength: 250 },
    video: { type: String, maxlength: 250 },
    commentsAllowed: { type: Boolean, default: true },
    reviewed: { type: Boolean, default: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId },
    live: { type: Boolean, default: false },
    leadingArticle: Boolean,
    createdDate: { type: Date, default: Date.now, required: true },
    authors: [{ type: mongoose.Schema.Types.ObjectId }], // refers to user._id
    lastEditedDate: Date,
    lastEditors: [{ type: mongoose.Schema.Types.ObjectId }],
    keywords: [{ type: String }],
    likes: {
        up: { type: Number, default: 0 },
        down: { type: Number, default: 0 }
    }     
});

articleSchema.virtual('keywordsString').get(function () {
    if (this.keywords) {
        return this.keywords.join(', ');
    }
    return '';
});

articleSchema.virtual('allContent').get(function () {
  return this.summary + ' ' + this.content;
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
