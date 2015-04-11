"use strict"
let express = require('express');
let router = express.Router();
let util = require('util');
let Article = require('../models/article');
let User = require('../models/user');
let Author = require('../models/author');

/* GET home page. */
router.get('/', (req, res, next) => {
    Article.find({ live: true })
           .sort({ lastEditedDate: -1 })
           .limit(9)
           .exec((err, articles) => {
        if (err) {
            return next(err);
        }
        let leadArticle = articles[0];
        let articlesList = articles.slice(1);
        res.cacheFor(180);
        res.render('index', { leadArticle: leadArticle, articlesList: articlesList, pageTitle: 'Acceuil' });
    });
});

/* GET about us page. */
router.get('/about-us', (req, res, next) => {
    res.cacheFor(180);
    res.render(res.view(), { pageTitle: 'Qui somme-nous?' });
});

/* GET about us page. */
router.get('/contact-us', (req, res, next) => {
    res.cacheFor(180);
    res.render(res.view(), { pageTitle: 'Contact' });
});

/* GET article page. */
router.get('/article/:articleId', (req, res) => {
    Article.findOne({ _id: req.params.articleId, live: true }, (err, article) => {
        if (err) {
            return next(err);
        }
        if (! article) {
            
        }
        Article.find({ _id: { $ne: article._id }, live: true,  smallImage: /\S+/})
               .sort({ lastEditedDate: -1 })
               .limit(4)
               .exec((err, relatedArticles) => {
            if (err) {
                return next(err);
            }
            let authorIds = article.authors;
            if(article.lastEditors) {
                authorIds = authorIds.concat(article.lastEditors);
            }
            Author.find({ userId: { $in: authorIds } }, (err, authors) => {
                if (err) {
                    return next(err);
                } 
                res.cacheFor(180);
                let pageDescription = article.allContent.substring(0, 185);
                let pageKeywords = article.keywordsString;
                let pageAuthors = authors.map(x => x.pseudo).join(',');
                let pageOgImage = article.largeImage; 
                res.render('article', { article: article, relatedArticles: relatedArticles, authors: authors, pageTitle: article.title, pageDescription: pageDescription, pageKeywords: pageKeywords, pageAuthors: pageAuthors, pageOgImage: pageOgImage });
            })
        });
    });
});

module.exports = router;
