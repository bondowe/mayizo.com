'use strict'
let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let articleSchema = new Schema({
    
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
    authorsOverride: String,
    lastEditedDate: Date,
    lastEditors: [{ type: mongoose.Schema.Types.ObjectId }],
    likes: {
        up: { type: Number, default: 0 },
        down: { type: Number, default: 0 }
    }     
});

articleSchema.virtual('keywordsString').get(() => {
    if (this.keywords) {
        return this.keywords.join(', ');
    }
    return '';
});

articleSchema.virtual('allContent').get(() => {
  return this.summary + ' ' + this.content;
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
