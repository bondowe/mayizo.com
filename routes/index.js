var express = require('express');
var router = express.Router();
var util = require('util');
var Article = require('../models/article');
var User = require('../models/user');
var Author = require('../models/author');

/* GET home page. */
router.get('/', (req, res, next) => {
    Article.find()
           .sort({ lastEditedDate: -1 })
           .limit(9)
           .exec((err, articles) => {
        if (err) {
            return next(err);
        }
        var leadArticle = articles[0];
        var articlesList = articles.slice(1);
        res.render('index', { leadArticle: leadArticle, articlesList: articlesList, pageTitle: 'Acceuil' });
    });
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
            var authorIds = article.authors;
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
