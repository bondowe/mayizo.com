"use strict"
let express = require('express');
let router = express.Router();
let util = require('util');
let Article = require('../models/article');
let User = require('../models/user');
let Author = require('../models/author');

/* GET home page. */
router.get('/', (req, res, next) => {
    Article.find()
           .sort({ lastEditedDate: -1 })
           .limit(9)
           .exec((err, articles) => {
        if (err) {
            return next(err);
        }
        let leadArticle = articles[0];
        let articlesList = articles.slice(1);
        res.render('index', { leadArticle: leadArticle, articlesList: articlesList, pageTitle: 'Acceuil' });
    });
});

/* GET about us page. */
router.get('/about-us', (req, res, next) => {
    res.render(res.view(), { pageTitle: 'Qui somme-nous?' });
});

/* GET about us page. */
router.get('/contact-us', (req, res, next) => {
    res.render(res.view(), { pageTitle: 'Contact' });
});

/* GET article page. */
router.get('/article/:articleId', (req, res) => {
    Article.findById(req.params.articleId, (err, article) => {
        if (err) {
            return next(err);
        }
        Article.find({ _id: { $ne: article.id } })
               .sort({ lastEditedDate: -1 })
               .limit(2)
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
                res.render('article', { article: article, relatedArticles: relatedArticles, authors: authors, pageTitle: 'Article' });
            })
        });
    });
});

module.exports = router;
