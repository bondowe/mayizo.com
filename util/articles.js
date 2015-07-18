'use strict'
let Article = require('../models/article');
let Author = require('../models/author');

let getArticleWithRelated = (options, res, next) => {
    return getArticle(options)
        .then(article => {
            if(article.authorsOverride != undefined
               && article.authorsOverride != null
               && article.authorsOverride.trim().length > 0) {
                    return Promise.resolve(article);
            }
            return setArticleAuthorsOverride(article);
        })
        .then(getRelatedArticles)
        .then(articles => {
                let article = articles[0];
                let relatedArticles = articles[1];
                let pageDescription = article.allContent.substring(0, 185);
                let pageKeywords = article.keywordsString;
                let pageOgImage = article.largeImage; 
                res.render('article', { 
                    article: article, 
                    relatedArticles: relatedArticles, 
                    authors: article.authorsOverride.split(','), 
                    pageTitle: article.title, 
                    pageDescription: pageDescription, 
                    pageKeywords: pageKeywords, 
                    pageAuthors: article.authorsOverride, 
                    pageOgImage: pageOgImage });
            })
            .catch(err => {
                return next(err);
            });
};

function getArticle(options) {
    return new Promise((resolve, reject) => {
        Article.findOne(options, (err, article) => {
            if (err) {
                return reject(err);
            }
            if (! article) {
                return reject(new Error('Article not found'));
            }
            return resolve(article);
        });
    });
}

function getRelatedArticles(article) {
    return new Promise((resolve, reject) => {
        Article.find({ _id: { $ne: article._id }, live: true,  smallImage: /\S+/})
               .sort({ lastEditedDate: -1 })
               .limit(8)
               .exec((err, relatedArticles) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve([article, relatedArticles]);
               });
    });
}

function setArticleAuthorsOverride(article) {
    return new Promise((resolve, reject) => {
        let authorIds = article.authors;
        if(article.lastEditors) {
            authorIds = authorIds.concat(article.lastEditors);
        }
        Author.find({ userId: { $in: authorIds } }, (err, authors) => {
            if (err) {
                return reject(err);
            }
            var authorsOverride = authors.map(x => x.pseudo).join(', ');
            article.authorsOverride = authorsOverride;
            return resolve(article);
        });
    });
}

module.exports = {
    getArticleWithRelated: getArticleWithRelated
}
